# -*- coding: utf-8 -*-
"""SAA-C03 dump PDF -> dump.js (684 questions) + knowledge.js (concept graph).

dump.js/dump-ko.js/knowledge.js are gitignored local build artifacts (same as
the source PDF): the pipeline (answer_dual.py) needs them on disk to work,
but they must never be shipped in the public site or committed to the repo,
since the question text is copyrighted ExamTopics dump content. Re-run this
script any time they're missing.
"""
import re, io, os, json, collections
import fitz  # pymupdf

OUT = r"C:\SAA-EDUCATION"
doc = fitz.open(os.path.join(OUT, "AWS Certified Solutions Architect Associate SAA-C03.pdf"))
txt = "".join(page.get_text() for page in doc)

# ---------------------------------------------------------------- 1. repair
FL = {"ow","ows","eet","ag","uctuates","ect","ight","ood","la","at"}
FFL = {"ine","oad"}
FFI = {"c","cient","ciency","ciently","nity","ce","cer","ces"}
def _rep(m):
    r = re.match(r"[A-Za-z]*", txt[m.end():m.end()+20]).group(0)
    l = re.search(r"[A-Za-z]*$", txt[max(0,m.start()-20):m.start()]).group(0)
    if r in FFL: return "ffl"
    if r in FFI and l.lower() in ("tra","e","o","a","su","ine","insu","incomingtra"): return "ffi"
    if r in FL: return "fl"
    return "fi"
clean = re.sub("\x00", _rep, txt)
assert "\x00" not in clean
clean = re.sub(r"\n===== PAGE \d+ \(chars=\d+, images=\d+\) =====\n", "\n", clean)
# glued words introduced by the PDF's line packing
for a, b in [("the file","the file"),("Cross- Region","Cross-Region"),("Multi- AZ","Multi-AZ")]:
    clean = clean.replace(a, b)

# ---------------------------------------------------------------- 2. parse
parts = re.split(r"Topic 1\s*\nQuestion #(\d+)\s*\n", clean)
raw = {int(parts[i]): parts[i+1].strip() for i in range(1, len(parts), 2)}
OPT = re.compile(r"(?m)^([A-F])\.[ \t]?")
EXHIBIT = {96, 97, 253, 254, 423, 424, 429, 477, 494, 495}
sq = lambda s: re.sub(r"\s*\n\s*", " ", s).replace("\u2019", "'").strip()

questions = []
for n in sorted(raw):
    body, ms = raw[n], list(OPT.finditer(raw[n]))
    stem = sq(body[:ms[0].start()])
    opts = []
    for k, m in enumerate(ms):
        end = ms[k+1].start() if k+1 < len(ms) else len(body)
        opts.append(sq(body[m.end():end]))
    ch = re.search(r"\(Choose (two|three|TWO|THREE)\.?\)", stem, re.I)
    questions.append({
        "id": "saa%03d" % n, "num": n, "stem": stem, "options": opts,
        "select": 3 if ch and ch.group(1).lower() == "three" else (2 if ch else 1),
        "answer": None,                       # not present in the source PDF
        "exhibit": n in EXHIBIT,
    })
print("parsed questions:", len(questions))

# ---------------------------------------------------------------- 3. taxonomy
# (id, label, label_ko, category, [regex patterns])
T = [
 # ---- compute
 ("ec2","Amazon EC2","EC2 인스턴스","compute",[r"\bEC2\b"]),
 ("lambda","AWS Lambda","Lambda","compute",[r"\bLambda\b"]),
 ("ecs","Amazon ECS","ECS","compute",[r"\bECS\b|Elastic Container Service"]),
 ("eks","Amazon EKS","EKS","compute",[r"\bEKS\b|Elastic Kubernetes"]),
 ("fargate","AWS Fargate","Fargate","compute",[r"\bFargate\b"]),
 ("autoscaling","Auto Scaling","오토 스케일링","compute",[r"Auto Scaling"]),
 ("elasticbeanstalk","Elastic Beanstalk","Beanstalk","compute",[r"Elastic Beanstalk"]),
 ("batch","AWS Batch","Batch","compute",[r"AWS Batch"]),
 ("outposts","AWS Outposts","Outposts","compute",[r"Outposts"]),
 ("ami","AMI","AMI 이미지","compute",[r"\bAMI\b|Amazon Machine Image"]),
 ("spot","Spot Instances","스팟 인스턴스","compute",[r"Spot Instance|Spot Fleet|\bSpot\b"]),
 ("reserved","Reserved / Savings Plans","예약·약정 할인","compute",[r"Reserved Instance|Savings Plan"]),
 ("placement","Placement Groups","배치 그룹","compute",[r"[Pp]lacement group"]),
 # ---- storage
 ("s3","Amazon S3","S3 오브젝트 스토리지","storage",[r"\bS3\b|Simple Storage Service"]),
 ("ebs","Amazon EBS","EBS 블록 볼륨","storage",[r"\bEBS\b|Elastic Block Store"]),
 ("efs","Amazon EFS","EFS 공유 파일","storage",[r"\bEFS\b|Elastic File System"]),
 ("fsx","Amazon FSx","FSx","storage",[r"\bFSx\b"]),
 ("glacier","S3 Glacier","Glacier 아카이브","storage",[r"Glacier"]),
 ("s3class","S3 Storage Classes","S3 스토리지 클래스","storage",[r"Standard-IA|One Zone-IA|Intelligent-Tiering|S3 Standard\b"]),
 ("lifecycle","S3 Lifecycle","수명주기 정책","storage",[r"[Ll]ifecycle (policy|configuration|rule)"]),
 ("s3version","S3 Versioning / Lock","버전 관리·오브젝트 락","storage",[r"[Vv]ersioning|Object Lock"]),
 ("storagegw","Storage Gateway","스토리지 게이트웨이","migration",[r"Storage Gateway|File Gateway|Volume Gateway|Tape Gateway"]),
 ("snowball","AWS Snow Family","Snowball","migration",[r"Snowball|Snowcone|Snowmobile"]),
 ("backup","AWS Backup","AWS Backup","management",[r"AWS Backup"]),
 # ---- database
 ("rds","Amazon RDS","RDS","database",[r"\bRDS\b"]),
 ("aurora","Amazon Aurora","Aurora","database",[r"Aurora"]),
 ("dynamodb","DynamoDB","DynamoDB","database",[r"DynamoDB"]),
 ("elasticache","ElastiCache","ElastiCache","database",[r"ElastiCache"]),
 ("redshift","Amazon Redshift","Redshift","analytics",[r"Redshift"]),
 ("documentdb","DocumentDB","DocumentDB","database",[r"DocumentDB"]),
 ("neptune","Amazon Neptune","Neptune","database",[r"Neptune"]),
 ("dax","DynamoDB DAX","DAX 캐시","database",[r"\bDAX\b"]),
 ("readreplica","Read Replica","읽기 전용 복제본","database",[r"[Rr]ead replica"]),
 ("multiaz","Multi-AZ","다중 AZ 이중화","principle",[r"Multi-AZ"]),
 ("dms","AWS DMS","DB 마이그레이션","migration",[r"\bDMS\b|Database Migration Service"]),
 # ---- networking
 ("vpc","Amazon VPC","VPC","networking",[r"\bVPC\b"]),
 ("subnet","Subnets","서브넷 설계","networking",[r"[Pp]rivate subnet|[Pp]ublic subnet"]),
 ("natgw","NAT Gateway","NAT 게이트웨이","networking",[r"NAT gateway|NAT instance",]),
 ("vpcendpoint","VPC Endpoints","VPC 엔드포인트","networking",[r"VPC endpoint|gateway endpoint|interface endpoint|PrivateLink"]),
 ("alb","Application Load Balancer","ALB","networking",[r"\bALB\b|Application Load Balancer"]),
 ("nlb","Network Load Balancer","NLB","networking",[r"\bNLB\b|Network Load Balancer"]),
 ("route53","Amazon Route 53","Route 53 DNS","networking",[r"Route 53"]),
 ("cloudfront","Amazon CloudFront","CloudFront CDN","networking",[r"CloudFront"]),
 ("directconnect","Direct Connect","전용선 연결","networking",[r"Direct Connect"]),
 ("transitgw","Transit Gateway","트랜짓 게이트웨이","networking",[r"Transit Gateway"]),
 ("vpcpeering","VPC Peering","VPC 피어링","networking",[r"[Pp]eering"]),
 ("globalaccel","Global Accelerator","글로벌 액셀러레이터","networking",[r"Global Accelerator"]),
 ("sitevpn","Site-to-Site VPN","VPN 연결","networking",[r"Site-to-Site VPN|\bVPN\b"]),
 ("sgnacl","Security Group / NACL","보안 그룹·NACL","networking",[r"[Ss]ecurity group|network ACL|\bNACL\b"]),
 # ---- security
 ("iam","AWS IAM","IAM","security",[r"\bIAM\b"]),
 ("iamrole","IAM Role","IAM 역할","security",[r"IAM role|instance profile|AssumeRole"]),
 ("kms","AWS KMS","KMS 키 관리","security",[r"\bKMS\b|Key Management Service"]),
 ("secretsmanager","Secrets Manager","시크릿 매니저","security",[r"Secrets Manager"]),
 ("acm","Certificate Manager","ACM 인증서","security",[r"\bACM\b|Certificate Manager"]),
 ("waf","AWS WAF","WAF","security",[r"\bWAF\b"]),
 ("shield","AWS Shield","Shield DDoS","security",[r"Shield"]),
 ("guardduty","GuardDuty","GuardDuty","security",[r"GuardDuty"]),
 ("macie","Amazon Macie","Macie","security",[r"Macie"]),
 ("inspector","Amazon Inspector","Inspector","security",[r"Inspector"]),
 ("cognito","Amazon Cognito","Cognito 인증","security",[r"Cognito"]),
 ("organizations","AWS Organizations","Organizations","management",[r"Organizations\b|\bSCP\b|service control polic"]),
 ("encryption","Encryption","암호화","principle",[r"encrypt|\bSSE-|at rest\b"]),
 # ---- integration
 ("sqs","Amazon SQS","SQS 큐","integration",[r"\bSQS\b|Simple Queue Service"]),
 ("sns","Amazon SNS","SNS 알림","integration",[r"\bSNS\b|Simple Notification Service"]),
 ("eventbridge","EventBridge","EventBridge","integration",[r"EventBridge|CloudWatch Events"]),
 ("apigw","API Gateway","API Gateway","integration",[r"API Gateway"]),
 ("stepfunctions","Step Functions","Step Functions","integration",[r"Step Functions"]),
 ("mq","Amazon MQ","Amazon MQ","integration",[r"Amazon MQ"]),
 ("ses","Amazon SES","SES 메일","integration",[r"\bSES\b"]),
 # ---- analytics
 ("kinesis","Amazon Kinesis","Kinesis 스트림","analytics",[r"Kinesis"]),
 ("athena","Amazon Athena","Athena","analytics",[r"Athena"]),
 ("glue","AWS Glue","Glue ETL","analytics",[r"AWS Glue|\bGlue\b"]),
 ("emr","Amazon EMR","EMR","analytics",[r"\bEMR\b"]),
 ("opensearch","OpenSearch","OpenSearch","analytics",[r"OpenSearch|Elasticsearch"]),
 ("quicksight","QuickSight","QuickSight","analytics",[r"QuickSight"]),
 # ---- management
 ("cloudwatch","Amazon CloudWatch","CloudWatch","management",[r"CloudWatch"]),
 ("cloudtrail","AWS CloudTrail","CloudTrail 감사","management",[r"CloudTrail"]),
 ("config","AWS Config","AWS Config","management",[r"AWS Config"]),
 ("cloudformation","CloudFormation","CloudFormation IaC","management",[r"CloudFormation"]),
 ("ssm","Systems Manager","Systems Manager","management",[r"Systems Manager|Parameter Store|Session Manager"]),
 ("trustedadvisor","Trusted Advisor","Trusted Advisor","management",[r"Trusted Advisor"]),
 ("costmgmt","Cost Management","비용 관리 도구","management",[r"Cost Explorer|AWS Budgets|Cost and Usage"]),
 ("datasync","AWS DataSync","DataSync","migration",[r"DataSync"]),
 ("transferfamily","Transfer Family","Transfer Family","migration",[r"Transfer Family|Transfer for SFTP"]),
 # ---- exam intent (the "knots")
 ("cost","Cost Optimization","비용 최적화 요구","principle",[r"cost-effective|MOST cost|reduce (the )?cost|minimize (the )?cost|lowest cost|cost savings"]),
 ("opex","Least Operational Overhead","운영 부담 최소화","principle",[r"operational overhead|operational complexity|LEAST management|minimal management|fully managed|serverless"]),
 ("ha","High Availability","고가용성","principle",[r"highly available|high availability|fault toleran|resilien"]),
 ("dr","Disaster Recovery","재해 복구","principle",[r"disaster recovery|\bRPO\b|\bRTO\b|failover"]),
 ("leastpriv","Least Privilege","최소 권한 원칙","principle",[r"least privilege|least-privilege"]),
 ("decouple","Decoupling","결합도 분리","principle",[r"decoupl"]),
 ("crossregion","Cross-Region","리전 간 복제","principle",[r"[Cc]ross-Region|another Region|second Region|multiple Regions"]),
 ("hybrid","Hybrid / On-Premises","하이브리드·온프레미스","principle",[r"on-premises|data center"]),
 ("compliance","Compliance & Audit","규정 준수·감사","principle",[r"complian|regulat|audit|\bPII\b|\bHIPAA\b|\bGDPR\b|\bPCI\b"]),
 ("latency","Latency & Performance","지연시간·성능","principle",[r"latenc|throughput|performance"]),
 ("scalab","Scalability","확장성","principle",[r"scalab|scale (out|up|automatically)|unpredictable|varies|spike"]),
]
# Drawn from the iOS/macOS system palette, deepened where needed for AA contrast
# on white. Reserved: #0071e3 (Apple blue) is the interactive accent and is not
# used for a category, so a coloured dot never reads as a link.
CATS = {
 "compute":  ("컴퓨팅","Compute","#5856d6"),              # systemIndigo
 "storage":  ("스토리지","Storage","#2aa3b8"),             # systemTeal, deepened
 "database": ("데이터베이스","Database","#248a3d"),          # systemGreen, deepened
 "networking":("네트워킹","Networking","#c26a00"),          # systemOrange, deepened
 "security": ("보안 및 IAM","Security & IAM","#d70015"),    # systemRed, deepened
 "integration":("애플리케이션 통합","Integration","#9a4dc4"),  # systemPurple, deepened
 "analytics":("분석","Analytics","#00747a"),               # dark cyan
 "management":("관리·거버넌스","Management","#6e6e73"),      # systemGray
 "migration":("마이그레이션·전송","Migration","#a2845e"),     # systemBrown
 "principle":("출제 의도","Exam Intent","#d4306d"),         # magenta — the knots
}
compiled = [(cid, lab, ko, cat, re.compile("|".join(pats))) for cid, lab, ko, cat, pats in T]

for q in questions:
    blob = q["stem"] + " \n " + " \n ".join(q["options"])
    q["concepts"] = [cid for cid, _, _, _, rx in compiled if rx.search(blob)]

# ---------------------------------------------------------------- 4. graph
node_qs = collections.defaultdict(list)
for q in questions:
    for c in q["concepts"]:
        node_qs[c].append(q["num"])
edge_qs = collections.defaultdict(list)
for q in questions:
    cs = sorted(q["concepts"])
    for i in range(len(cs)):
        for j in range(i+1, len(cs)):
            edge_qs[(cs[i], cs[j])].append(q["num"])

MIN_W = 4
nodes = [{"id": cid, "label": lab, "label_ko": ko, "cat": cat,
          "w": len(node_qs[cid]), "qs": sorted(node_qs[cid])}
         for cid, lab, ko, cat, _ in compiled if len(node_qs[cid]) > 0]
nodes.sort(key=lambda n: -n["w"])
keep = {n["id"] for n in nodes}
chosen = {(a, b) for (a, b), v in edge_qs.items() if len(v) >= MIN_W and a in keep and b in keep}

# no node may be left stranded: rescue each orphan with its single strongest link
deg = collections.Counter()
for a, b in chosen:
    deg[a] += 1; deg[b] += 1
for n in nodes:
    if deg[n["id"]]:
        continue
    cand = [(len(v), k) for k, v in edge_qs.items()
            if n["id"] in k and k[0] in keep and k[1] in keep]
    if cand:
        best = max(cand)[1]
        chosen.add(best)
        deg[best[0]] += 1; deg[best[1]] += 1

edges = [{"s": a, "t": b, "w": len(edge_qs[(a, b)]), "qs": sorted(edge_qs[(a, b)])}
         for (a, b) in chosen]
edges.sort(key=lambda e: -e["w"])
orphans = [n["id"] for n in nodes if deg[n["id"]] == 0]

print("\n=== GRAPH ===")
print("nodes: %d   edges(w>=%d): %d   orphan nodes: %s" % (len(nodes), MIN_W, len(edges), orphans))
print("questions with 0 concepts:", sum(1 for q in questions if not q["concepts"]))
print("avg concepts/question: %.1f" % (sum(len(q["concepts"]) for q in questions)/len(questions)))
print("category spread:", collections.Counter(n["cat"] for n in nodes))
print("\ntop 15 nodes:", [(n["id"], n["w"]) for n in nodes[:15]])
print("\ntop 15 edges:", [(e["s"], e["t"], e["w"]) for e in edges[:15]])

# ---------------------------------------------------------------- 5. emit
hdr = ("/**\n * AUTO-GENERATED from 'AWS Certified Solutions Architect Associate SAA-C03.pdf'\n"
       " * (ExamTopics dump, 249 pages, 684 questions). Do not edit by hand.\n"
       " * Regenerate with scripts/generate.py\n")

with io.open(os.path.join(OUT, "dump.js"), "w", encoding="utf-8") as f:
    f.write(hdr + " *\n * NOTE: the source PDF contains NO answer key. Every `answer` is null\n"
            " * until an answer key is supplied. Questions are study material only.\n */\n")
    f.write("const SAA_DUMP = ")
    json.dump(questions, f, ensure_ascii=False, separators=(",", ":"))
    f.write(";\n")

with io.open(os.path.join(OUT, "knowledge.js"), "w", encoding="utf-8") as f:
    f.write(hdr + " */\n")
    f.write("const KG_CATEGORIES = ")
    json.dump({k: {"ko": v[0], "en": v[1], "color": v[2]} for k, v in CATS.items()}, f, ensure_ascii=False, indent=1)
    f.write(";\n\nconst KNOWLEDGE_GRAPH = ")
    json.dump({"nodes": nodes, "edges": edges}, f, ensure_ascii=False, separators=(",", ":"))
    f.write(";\n")

for fn in ("dump.js", "knowledge.js"):
    print("wrote %-14s %6d KB" % (fn, os.path.getsize(os.path.join(OUT, fn)) // 1024))

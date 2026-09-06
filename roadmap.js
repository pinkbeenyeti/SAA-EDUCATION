/**
 * AWS SAA-C03 Study Roadmap
 *
 * Answers "what should I study first" -- with combo questions spanning 2-3
 * concepts and 95 concepts spread flat across the mindmap, it's easy to not
 * know where to start. Each concept here is bucketed into one of 8 phases
 * (hand-curated by topic, so related concepts stay together) and ordered
 * within its phase by a hub score: 0.6 * (node weight / max weight) + 0.4 *
 * (co-occurrence degree / max degree), both pulled from KNOWLEDGE_GRAPH in
 * knowledge.js. Weight is how often a concept appears in the real dump;
 * degree is how many other concepts it commonly combines with -- so the
 * concepts most other combo questions lean on come first in each phase.
 */
const STUDY_ROADMAP = [
  {
    id: 1,
    title_ko: "컴퓨팅·스토리지·네트워크 기초",
    title_en: "Compute, Storage & Networking Basics",
    intro_ko: "AWS의 가장 기본이 되는 서비스들입니다. EC2로 서버를 띄우고, EBS/S3에 데이터를 저장하며, VPC·서브넷·보안그룹으로 네트워크를 구성하는 흐름을 먼저 익히세요. 이후 모든 단계가 이 개념들을 전제로 합니다.",
    intro_en: "The foundational AWS services. Learn to launch servers with EC2, store data with EBS/S3, and structure networks with VPC, subnets, and security groups -- every later phase assumes you already know these.",
    conceptIds: ["ec2", "s3", "autoscaling", "vpc", "ebs", "sgnacl", "subnet", "ami"]
  },
  {
    id: 2,
    title_ko: "시험 판단 기준 (원칙 개념)",
    title_en: "Exam Judgment Criteria (Principles)",
    intro_ko: "특정 서비스가 아니라, 시험 문제를 푸는 '판단 기준'입니다. 비용 대비 효율, 고가용성, 확장성, 재해 복구, 최소 권한 같은 원칙들은 문제 지문 속 힌트 단어를 해석하는 열쇠이므로, 서비스보다 먼저 개념 자체를 확실히 이해해야 합니다.",
    intro_en: "Not services, but the judgment criteria the exam actually tests. Cost-efficiency, high availability, scalability, disaster recovery, least privilege -- these are the keywords hidden in every scenario, so nail the concepts here before diving into more services.",
    conceptIds: ["opex", "latency", "cost", "hybrid", "ha", "scalab", "compliance", "multiaz", "encryption", "dr", "crossregion", "leastpriv", "decouple"]
  },
  {
    id: 3,
    title_ko: "데이터베이스",
    title_en: "Databases",
    intro_ko: "관계형(RDS/Aurora)과 NoSQL(DynamoDB) 데이터베이스의 차이, 그리고 읽기 성능을 높이는 Read Replica·캐싱(ElastiCache, DAX)을 다룹니다. '어떤 워크로드에 어떤 DB가 맞는가'를 구분하는 게 핵심입니다.",
    intro_en: "Relational (RDS/Aurora) vs. NoSQL (DynamoDB), plus read-scaling with replicas and caching (ElastiCache, DAX). The key skill is matching the right database to the right workload.",
    conceptIds: ["rds", "dynamodb", "aurora", "elasticache", "readreplica", "dax", "documentdb", "neptune"]
  },
  {
    id: 4,
    title_ko: "네트워킹 심화",
    title_en: "Advanced Networking",
    intro_ko: "VPC 안팎을 연결하는 심화 네트워킹입니다. 로드밸런서(ALB/NLB), CDN(CloudFront), DNS(Route53)부터 온프레미스 연결(Direct Connect, Site-to-Site VPN), VPC 간 연결(Peering, Transit Gateway)까지 다룹니다.",
    intro_en: "Advanced networking that connects your VPC to the world -- load balancers (ALB/NLB), CDN (CloudFront), DNS (Route53), on-prem connectivity (Direct Connect, VPN), and VPC-to-VPC links (Peering, Transit Gateway).",
    conceptIds: ["alb", "cloudfront", "route53", "vpcendpoint", "sitevpn", "nlb", "directconnect", "natgw", "globalaccel", "vpcpeering", "transitgw"]
  },
  {
    id: 5,
    title_ko: "보안 & IAM 심화",
    title_en: "Advanced Security & IAM",
    intro_ko: "IAM 기초를 넘어, 암호화(KMS), 비밀 관리(Secrets Manager), 위협 탐지(GuardDuty, Macie, Inspector), 애플리케이션 보호(WAF, Shield)까지 다루는 보안 심화 단계입니다.",
    intro_en: "Beyond basic IAM: encryption (KMS), secrets management, threat detection (GuardDuty, Macie, Inspector), and application-layer protection (WAF, Shield).",
    conceptIds: ["iam", "kms", "iamrole", "waf", "secretsmanager", "macie", "inspector", "guardduty", "shield", "acm", "cognito"]
  },
  {
    id: 6,
    title_ko: "서버리스 & 통합/디커플링",
    title_en: "Serverless & Integration/Decoupling",
    intro_ko: "서버 관리 없이 확장하는 서버리스(Lambda, Fargate)와, 컴포넌트를 느슨하게 연결하는 디커플링(SQS, SNS, EventBridge, Step Functions)을 함께 배웁니다. 시험에서 자주 나오는 '이 아키텍처를 어떻게 분리할 것인가' 패턴의 핵심입니다.",
    intro_en: "Serverless compute (Lambda, Fargate) paired with the messaging/orchestration services (SQS, SNS, EventBridge, Step Functions) that decouple them -- the core of the exam's recurring 'how would you decouple this architecture' pattern.",
    conceptIds: ["lambda", "apigw", "eventbridge", "sqs", "ecs", "sns", "fargate", "spot", "eks", "reserved", "elasticbeanstalk", "stepfunctions", "batch", "ses", "placement", "mq", "outposts"]
  },
  {
    id: 7,
    title_ko: "스토리지 심화 & 마이그레이션",
    title_en: "Advanced Storage & Migration",
    intro_ko: "S3 스토리지 클래스, 수명주기 정책부터 온프레미스-클라우드 데이터 이전(DataSync, Snowball, DMS, Storage Gateway)까지, 데이터를 어디에 얼마나 저렴하게 보관하고 어떻게 옮기는지를 다룹니다.",
    intro_en: "S3 storage classes and lifecycle rules, plus moving data between on-prem and cloud (DataSync, Snowball, DMS, Storage Gateway) -- where to store data cheaply, and how to get it there.",
    conceptIds: ["efs", "storagegw", "datasync", "glacier", "lifecycle", "fsx", "dms", "s3class", "snowball", "s3version", "transferfamily"]
  },
  {
    id: 8,
    title_ko: "분석 & 운영관리",
    title_en: "Analytics & Operations Management",
    intro_ko: "인프라를 코드로 관리하고(CloudFormation), 모니터링·감사하고(CloudWatch, CloudTrail, Config), 데이터를 분석하는(Kinesis, Redshift, Athena, Glue, EMR) 운영 단계입니다. 실무형 문제가 몰려 있는 마지막 관문입니다.",
    intro_en: "Operations: managing infrastructure as code (CloudFormation), monitoring and auditing (CloudWatch, CloudTrail, Config), and analyzing data at scale (Kinesis, Redshift, Athena, Glue, EMR) -- the final phase, heavy on real-world scenario questions.",
    conceptIds: ["cloudwatch", "kinesis", "redshift", "athena", "ssm", "glue", "organizations", "cloudtrail", "backup", "config", "emr", "quicksight", "cloudformation", "opensearch", "costmgmt", "trustedadvisor"]
  }
];

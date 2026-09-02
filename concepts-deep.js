/**
 * AWS SAA-C03 Concept Deep Dive
 *
 * concepts.js answers "what should I remember for the exam".
 * This file answers "how does it actually work, and why does the exam care" —
 * the layer that was missing.
 *
 *   how_*      mechanism: what the service actually does, at machine level
 *   why_*      what judgement the exam is testing through this concept
 *   traps[]    the specific wrong answers people pick, and why they are wrong
 *   compare[]  pairs that are routinely confused, with the deciding rule
 *
 * Keyed by the same ids as KNOWLEDGE_GRAPH.nodes / CONCEPT_DETAIL.
 */
const CONCEPT_DEEP = {

  /* ====================================================================== */
  ec2: {
    how_ko: 'EC2 인스턴스는 AWS가 운영하는 물리 서버 위에서 Nitro 하이퍼바이저가 잘라낸 가상 머신입니다. 인스턴스를 시작하면 AMI(디스크 이미지)가 EBS 볼륨으로 복제되고, 지정한 서브넷에 ENI(가상 네트워크 카드)가 붙고, 그 ENI에 보안 그룹이 적용됩니다. 즉 인스턴스는 "컴퓨팅 + 디스크 + 네트워크 인터페이스"의 조립품이며, 시험 문제는 이 세 조각 중 어디가 병목이거나 잘못 묶였는지를 묻습니다.\n\n중요한 물리적 사실 하나: 인스턴스는 하나의 가용 영역(AZ)에 존재하고 EBS 볼륨도 같은 AZ에 묶입니다. 그래서 "AZ가 죽으면 어떻게 되는가"가 곧 EC2 아키텍처 문제의 출발점입니다. 인스턴스를 여러 AZ에 흩뿌리고(ASG), 앞에 로드 밸런서를 두고, 상태는 인스턴스 밖(S3·EFS·RDS·ElastiCache)으로 빼는 구조가 나오는 이유가 이것입니다.',
    how_en: 'An EC2 instance is a virtual machine carved out of AWS-operated physical hardware by the Nitro hypervisor. Launching one clones an AMI onto an EBS volume, attaches an ENI in your chosen subnet, and applies security groups to that ENI. An instance is therefore an assembly of compute plus disk plus network interface, and exam questions ask which of those three is the bottleneck or wrongly coupled.\n\nOne physical fact drives everything: an instance lives in a single Availability Zone, and its EBS volume is pinned to the same AZ. So "what happens when the AZ dies" is the starting point of every EC2 architecture question. That is why the answers keep converging on spreading instances across AZs with an ASG, fronting them with a load balancer, and moving state outside the instance into S3, EFS, RDS, or ElastiCache.',
    why_ko: '시험은 EC2를 통해 두 가지 판단력을 봅니다. 첫째는 비용 판단 — 워크로드의 시간적 성격(중단 가능한가, 상시인가, 예측 가능한가)을 읽고 구매 옵션을 고르는 능력입니다. 둘째는 결합도 판단 — 무엇을 인스턴스에 두고 무엇을 밖으로 빼야 하는지입니다. EC2가 등장하는 319문제 중 대부분은 이 둘 중 하나이며, 인스턴스 타입 스펙을 외우는 문제는 거의 없습니다.',
    why_en: 'The exam uses EC2 to test two judgements. First, cost: read the temporal shape of the workload — interruptible, steady, predictable — and pick the purchase option. Second, coupling: decide what belongs on the instance and what must move off it. Most of the 319 EC2 questions are one of those two; almost none require memorising instance-type specifications.',
    traps: [
      { ko: '액세스 키를 인스턴스에 저장하거나 사용자 데이터에 넣는 선택지 — 자격 증명이 AMI·스냅샷·로그로 새어 나가고 교체가 불가능합니다. 정답은 항상 인스턴스 프로파일에 IAM 역할을 붙이는 것입니다.',
        en: 'Storing access keys on the instance or in user data — credentials leak into AMIs, snapshots, and logs, and cannot be rotated. The answer is always an IAM role via an instance profile.' },
      { ko: '"더 큰 인스턴스로 교체"로 확장성 문제를 푸는 선택지 — 수직 확장은 상한이 있고 재시작이 필요합니다. 부하가 변동한다면 ASG로 수평 확장하는 쪽이 정답입니다.',
        en: 'Solving a scalability question by "move to a larger instance" — vertical scaling has a ceiling and needs a restart. Variable load calls for horizontal scaling with an ASG.' },
      { ko: '각 인스턴스의 EBS에 사용자 업로드를 저장하는 구성 — 로드 밸런서가 요청을 분산하면 사용자가 새로고침마다 다른 파일 집합을 보게 됩니다. 공유 스토리지(EFS)나 객체 스토리지(S3)로 빼야 합니다.',
        en: 'Writing user uploads to each instance\'s own EBS volume — once a load balancer spreads requests, users see a different subset of files on every refresh. Move to shared storage (EFS) or object storage (S3).' }
    ],
    compare: [
      { left: 'Spot', right: 'Reserved / Savings Plans',
        rule_ko: '워크로드가 중단을 견디는가로 갈립니다. 견디면 Spot(최대 90% 할인), 못 견디고 상시 가동이면 약정 할인(최대 72%). 둘은 배타적이 아니어서 ASG 혼합 정책으로 함께 쓸 수 있습니다.',
        rule_en: 'Decided by whether the workload tolerates interruption. If yes, Spot (up to 90% off); if not and it runs continuously, a commitment discount (up to 72%). They are not exclusive — an ASG mixed-instances policy uses both.' },
      { left: 'Dedicated Host', right: 'Dedicated Instance',
        rule_ko: 'Dedicated Host는 물리 서버 자체를 점유해 소켓·코어 수가 보이므로 코어 단위 BYOL 라이선스를 충족할 수 있습니다. Dedicated Instance는 하드웨어를 독점하지만 어느 물리 서버인지 통제하지 못해 BYOL 요구를 만족하지 못합니다.',
        rule_en: 'A Dedicated Host gives you the physical server with visible sockets and cores, satisfying per-core BYOL licensing. A Dedicated Instance is single-tenant but you do not control which host, so it cannot satisfy BYOL.' }
    ]
  },

  lambda: {
    how_ko: 'Lambda는 요청이 올 때 컨테이너 형태의 실행 환경을 띄우고, 그 안에서 핸들러 함수를 호출한 뒤 잠시 살려 두다가 회수합니다. 처음 띄우는 순간이 콜드 스타트이고, 살아 있는 환경을 재사용하는 것이 웜 스타트입니다. 동시에 들어온 요청 수만큼 환경이 병렬로 늘어나므로, Lambda의 "확장"은 인스턴스를 키우는 게 아니라 실행 환경 개수가 늘어나는 것입니다.\n\n과금은 (요청 수) + (할당 메모리 × 실행 시간)입니다. 메모리 슬라이더를 올리면 vCPU와 네트워크 대역폭이 비례해 함께 올라가므로, CPU 바운드 함수는 메모리를 두 배로 올려 실행 시간이 절반 이하로 줄면 총비용이 오히려 내려갑니다. 이 비직관적 관계가 성능·비용 문제에서 종종 정답 근거가 됩니다.',
    how_en: 'Lambda spins up a container-like execution environment on demand, invokes your handler inside it, keeps it warm briefly, then reclaims it. The first spin-up is a cold start; reusing a live environment is a warm start. Concurrency scales by adding environments, so "scaling" in Lambda means more parallel environments, not bigger ones.\n\nBilling is requests plus allocated memory multiplied by duration. Raising the memory dial raises vCPU and network bandwidth proportionally, so a CPU-bound function given twice the memory may finish in less than half the time and cost less overall. That counter-intuitive relationship is often the reasoning behind the correct answer.',
    why_ko: '시험이 Lambda로 보는 것은 "관리형으로 대체할 수 있는가"를 알아보는 눈입니다. 크론 서버, 폴링 워커, 이미지 리사이즈 데몬처럼 사람이 EC2에 올려 관리하던 것들이 이벤트 + Lambda로 사라지는 패턴을 반복해서 묻습니다. 동시에 반대 방향의 판단력도 봅니다 — 15분 제한, 상태 유지 불가, VPC 콜드 스타트 같은 경계에 부딪히면 Fargate나 Batch로 넘어가야 한다는 것입니다.',
    why_en: 'Lambda tests whether you can spot what a managed service replaces. Cron boxes, polling workers, and image-resize daemons that people used to run on EC2 collapse into event plus Lambda, and the exam asks that repeatedly. It also tests the reverse judgement: when you hit the 15-minute cap, the lack of durable local state, or VPC cold starts, you must move to Fargate or Batch.',
    traps: [
      { ko: '실행 시간이 15분을 넘는 시나리오에 Lambda를 고르는 것 — 900초는 조정 불가능한 하드 리미트입니다. "각 파일 처리에 30분", "야간 전체 재계산"이 보이면 즉시 후보에서 제외하세요.',
        en: 'Choosing Lambda when the scenario runs longer than 15 minutes — 900 seconds is a hard limit that cannot be raised. "Thirty minutes per file" or "nightly full recompute" eliminates it immediately.' },
      { ko: 'VPC에 붙인 Lambda가 인터넷에 나갈 수 있다고 가정하는 것 — VPC에 연결하면 퍼블릭 인터넷 경로를 잃습니다. 외부 API 호출이 필요하면 NAT 게이트웨이가, S3·DynamoDB면 VPC 엔드포인트가 추가로 필요합니다.',
        en: 'Assuming a VPC-attached Lambda can reach the internet — attaching to a VPC removes the public path. External API calls then need a NAT gateway; S3 and DynamoDB need VPC endpoints.' },
      { ko: '/tmp나 전역 변수에 상태를 유지하는 설계 — 환경 재사용은 보장되지 않으므로 다음 호출에 데이터가 없을 수 있습니다. 상태는 DynamoDB·S3·ElastiCache로 빼야 합니다.',
        en: 'Keeping state in /tmp or module globals — environment reuse is not guaranteed, so the next invocation may not see it. State belongs in DynamoDB, S3, or ElastiCache.' }
    ],
    compare: [
      { left: 'Reserved Concurrency', right: 'Provisioned Concurrency',
        rule_ko: 'Reserved는 "이 함수가 쓸 수 있는 동시성의 상한과 몫"을 정하는 용량 배분 장치이고, Provisioned는 "미리 데워 둘 환경 개수"를 정하는 지연시간 장치입니다. 계정 한도를 한 함수가 독점하는 문제 → Reserved, 콜드 스타트로 응답이 튀는 문제 → Provisioned.',
        rule_en: 'Reserved allocates a ceiling and a share of concurrency (a capacity tool). Provisioned pre-warms a number of environments (a latency tool). One function starving the account → Reserved. Cold starts causing latency spikes → Provisioned.' },
      { left: 'Lambda', right: 'Fargate',
        rule_ko: '실행 단위가 함수인가 컨테이너 이미지인가, 그리고 15분을 넘는가로 갈립니다. 기존 도커 이미지를 그대로 써야 하거나 장시간 상주해야 하면 Fargate입니다.',
        rule_en: 'Decided by whether the unit is a function or a container image, and whether it exceeds 15 minutes. An existing Docker image or a long-lived process means Fargate.' }
    ]
  },

  autoscaling: {
    how_ko: 'Auto Scaling Group은 시작 템플릿(어떤 AMI·인스턴스 타입·보안 그룹으로 띄울지)과 용량 범위(최소·희망·최대), 그리고 여러 서브넷 목록을 갖습니다. ASG는 주기적으로 "지금 살아 있는 정상 인스턴스 수"를 희망 용량과 비교해 차이를 메꿉니다. 이 단순한 루프가 두 가지 일을 동시에 합니다 — 부하에 따른 확장과, 죽은 인스턴스의 자동 교체입니다.\n\n조정의 방아쇠는 CloudWatch 지표입니다. Target Tracking은 "CPU 50%"처럼 목표를 주면 ASG가 알아서 용량을 계산하고, Step Scaling은 임계 구간별 증감폭을 직접 지정합니다. 여기서 자주 놓치는 것은 조정 근거가 CPU일 필요가 없다는 점입니다 — SQS 큐 깊이, ALB의 인스턴스당 요청 수, 커스텀 지표 모두 쓸 수 있고, 워커 아키텍처에서는 큐 깊이가 훨씬 정확한 신호입니다.',
    how_en: 'An Auto Scaling Group holds a launch template (which AMI, instance type, and security groups), a capacity range (min, desired, max), and a list of subnets. It periodically compares the count of healthy running instances against desired capacity and closes the gap. That one loop delivers two things at once: load-driven scaling and automatic replacement of dead instances.\n\nScaling is triggered by CloudWatch metrics. Target Tracking takes a goal such as 50% CPU and computes capacity itself; Step Scaling lets you set increments per threshold band. What people miss is that the metric need not be CPU — SQS queue depth, ALB requests per target, or a custom metric all work, and for worker architectures queue depth is a far truer signal.',
    why_ko: '시험은 ASG를 "고가용성과 탄력성을 동시에 사는 도구"로 다룹니다. 그래서 ASG가 없는 단일 인스턴스 구성은 가용성 요구가 있는 문제에서 자동 탈락합니다. 또 하나의 축은 조정 근거를 올바르게 고르는 것 — 부하의 실제 신호가 무엇인지(CPU인가 큐인가 시각인가) 읽어내는 능력을 봅니다.',
    why_en: 'The exam treats an ASG as buying availability and elasticity in one move, so any single-instance design is automatically eliminated when the requirement mentions availability. The second axis is choosing the right scaling signal — reading whether real load shows up as CPU, queue depth, or a known schedule.',
    traps: [
      { ko: '단일 AZ의 서브넷 하나만 지정한 ASG — 인스턴스는 교체되지만 그 AZ가 통째로 죽으면 서비스도 죽습니다. 고가용성 요구가 있으면 최소 2개 AZ의 서브넷을 포함해야 합니다.',
        en: 'An ASG bound to one subnet in one AZ — instances get replaced, but a whole-AZ failure still takes the service down. Availability requirements need subnets in at least two AZs.' },
      { ko: 'EC2 상태 확인만 켜 둔 구성 — OS는 살아 있는데 애플리케이션만 죽은 인스턴스를 잡아내지 못합니다. ELB 상태 확인을 함께 켜야 교체가 일어납니다.',
        en: 'Leaving only EC2 status checks enabled — an instance whose OS is fine but application is dead never gets replaced. Enable ELB health checks too.' },
      { ko: '큐 소비 워커를 CPU 기준으로 조정하는 것 — I/O 대기가 많은 워커는 백로그가 쌓여도 CPU가 낮아 확장이 일어나지 않습니다. 큐 깊이나 인스턴스당 백로그를 써야 합니다.',
        en: 'Scaling queue-consuming workers on CPU — I/O-bound workers show low CPU while the backlog grows, so scaling never fires. Use queue depth or backlog per instance.' }
    ],
    compare: [
      { left: 'Target Tracking', right: 'Scheduled Scaling',
        rule_ko: '부하의 시점을 미리 아는가로 갈립니다. "매일 오전 9시 급증", "월말 정산"처럼 시각이 예측되면 Scheduled가 선제적으로 용량을 올려 콜드 스타트 지연을 없앱니다. 예측 불가하면 Target Tracking입니다. 둘을 함께 쓰는 것도 정답이 됩니다.',
        rule_en: 'Decided by whether you know when load arrives. Known times such as "spikes at 9am" or "month-end close" favour Scheduled, which raises capacity ahead of the spike. Unpredictable load favours Target Tracking. Using both together is also a valid answer.' }
    ]
  },

  ecs: {
    how_ko: 'ECS는 태스크 정의(컨테이너 이미지, CPU·메모리, 포트, 환경 변수, IAM 역할을 적은 명세)를 받아 클러스터 안에 태스크로 실행합니다. 서비스는 "이 태스크를 항상 N개 유지하라"는 선언이며, 죽으면 다시 띄우고 ALB 대상 그룹에 등록·해제하는 일까지 처리합니다.\n\n실행 위치는 시작 유형이 결정합니다. EC2 시작 유형에서는 여러분이 컨테이너 인스턴스(ECS 에이전트가 깔린 EC2)를 직접 운영하고, ECS는 그 위에 태스크를 배치합니다. Fargate 시작 유형에서는 호스트가 보이지 않고 태스크당 vCPU·메모리를 선언하면 AWS가 실행 환경을 대신 준비합니다. 같은 태스크 정의를 두 방식 모두에서 쓸 수 있어, 시험은 "어느 쪽이 요구에 맞는가"만 묻습니다.',
    how_en: 'ECS takes a task definition — image, CPU and memory, ports, environment variables, IAM roles — and runs it as a task in a cluster. A service declares "keep N of this task running", restarting failures and registering or draining targets in an ALB target group.\n\nWhere it runs depends on the launch type. With EC2 you operate the container instances (EC2 hosts running the ECS agent) and ECS places tasks on them. With Fargate there is no visible host: you declare vCPU and memory per task and AWS provides the runtime. The same task definition works either way, so the exam only asks which side fits the requirement.',
    why_ko: '컨테이너 문제에서 시험이 보는 것은 두 갈래입니다. 하나는 ECS와 EKS 중 무엇인가 — 쿠버네티스가 명시되지 않으면 ECS가 운영 부담이 낮아 정답입니다. 다른 하나는 EC2와 Fargate 중 무엇인가 — 관리 부담 최소화면 Fargate, 최저 비용이고 사용률이 높으면 EC2 + Spot입니다.',
    why_en: 'Container questions fork twice. First ECS or EKS: without an explicit Kubernetes signal, ECS wins on lower overhead. Second EC2 or Fargate: minimise overhead → Fargate; lowest cost at high utilisation → EC2 with Spot.',
    traps: [
      { ko: '태스크 역할과 실행 역할을 혼동하는 것 — 컨테이너 안 코드가 S3를 못 읽는 문제의 원인은 태스크 역할이고, ECR에서 이미지를 못 당기는 문제의 원인은 실행 역할입니다.',
        en: 'Confusing the task role with the execution role — code inside the container failing to read S3 is a task-role problem; failing to pull from ECR is an execution-role problem.' },
      { ko: '한 호스트에 같은 컨테이너를 여러 개 띄우려는데 호스트 포트를 고정하는 것 — 포트 충돌로 두 번째 태스크가 뜨지 않습니다. ALB 동적 포트 매핑을 써야 합니다.',
        en: 'Pinning a host port while trying to run several copies of a container on one host — the second task fails on a port conflict. Use ALB dynamic port mapping.' }
    ],
    compare: [
      { left: 'ECS', right: 'EKS',
        rule_ko: '문제에 Kubernetes·kubectl·Helm·기존 매니페스트가 언급되면 EKS, 그냥 "컨테이너"면 ECS입니다. EKS는 컨트롤 플레인 시간당 요금과 쿠버네티스 자체의 학습·운영 부담이 추가로 붙습니다.',
        rule_en: 'A mention of Kubernetes, kubectl, Helm, or existing manifests means EKS; plain "containers" means ECS. EKS adds an hourly control-plane charge plus the operational weight of Kubernetes itself.' }
    ]
  },

  spot: {
    how_ko: 'Spot은 AWS가 지금 팔지 못하고 남은 EC2 용량을 대폭 할인해 내놓는 시장입니다. 온디맨드 수요가 늘어 그 용량이 필요해지면 AWS가 회수하는데, 회수 2분 전에 인스턴스 메타데이터와 EventBridge로 중단 알림이 옵니다. 따라서 Spot 워크로드의 설계 요건은 단 하나입니다 — 2분 안에 안전하게 손을 뗄 수 있어야 합니다.\n\n실무 패턴은 작업을 큐에서 꺼내 처리하고 완료 시에만 삭제하는 구조입니다. 중단되면 가시성 제한 시간이 지나 메시지가 큐로 되돌아가고 다른 워커가 집어갑니다. 체크포인트를 S3에 주기적으로 쓰는 방식도 같은 목적입니다.',
    how_en: 'Spot is a market for EC2 capacity AWS currently cannot sell, offered at a deep discount. When On-Demand demand rises and that capacity is needed, AWS reclaims it, sending an interruption notice through instance metadata and EventBridge two minutes ahead. So Spot imposes exactly one design requirement: be able to let go safely within two minutes.\n\nThe practical pattern is pulling work from a queue and deleting the message only on completion. An interruption lets the visibility timeout expire so another worker picks the message up. Periodically checkpointing to S3 serves the same purpose.',
    why_ko: '시험은 Spot으로 "워크로드의 성격을 읽는 능력"을 봅니다. 내결함성·무상태·재시작 가능·배치라는 단어가 깔려 있고 최저 비용을 물으면 Spot이 정답이며, 반대로 사용자 대면 트랜잭션이나 데이터베이스에 Spot을 고르면 오답입니다. 비용만 보고 고르는 함정을 피하는지가 핵심입니다.',
    why_en: 'Spot tests whether you can read the nature of a workload. Words like fault-tolerant, stateless, restartable, and batch combined with lowest cost make Spot correct; choosing Spot for user-facing transactions or a database is wrong. The test is whether you resist picking on price alone.',
    traps: [
      { ko: 'RDS나 상태를 가진 데이터 계층을 Spot EC2에 올리는 선택지 — 회수 시 데이터 손실이나 장시간 복구가 발생합니다.',
        en: 'Putting a database or stateful data tier on Spot — reclamation means data loss or a long recovery.' },
      { ko: '마감이 정해진 단일 실행 작업에 Spot만 쓰는 것 — 용량을 확보하지 못하면 아예 시작하지 못할 수 있습니다. 기본 용량은 On-Demand로 깔고 초과분만 Spot으로 채우는 혼합 정책이 안전한 정답입니다.',
        en: 'Using only Spot for a single deadline-bound job — if capacity is unavailable it may never start. A mixed policy with an On-Demand baseline and Spot on top is the safe answer.' }
    ]
  },

  fargate: {
    how_ko: 'Fargate는 태스크마다 격리된 마이크로VM을 띄워 그 안에서 컨테이너를 실행합니다. 여러분에게는 호스트라는 개념이 없어지고, 태스크 정의에 적은 vCPU·메모리 조합만 존재합니다. 태스크마다 자기 ENI를 받으므로 보안 그룹을 태스크 단위로 적용할 수 있고, 이 점이 EC2 시작 유형(호스트 단위 공유)과 비교해 격리 수준이 높은 이유입니다.\n\n과금은 태스크가 살아 있는 동안의 vCPU·GB 단가입니다. 그래서 사용률이 낮고 간헐적인 워크로드에서는 저렴하지만, 사용률이 높고 24시간 돌아가는 워크로드에서는 같은 자원을 Spot이나 RI로 산 EC2보다 비쌉니다.',
    how_en: 'Fargate launches an isolated micro-VM per task and runs your container inside it. The notion of a host disappears; only the vCPU and memory combination in the task definition remains. Each task gets its own ENI, so security groups apply per task — a stronger isolation boundary than the EC2 launch type, where the host is shared.\n\nBilling is per vCPU and GB for as long as the task lives. That makes it cheap for low-utilisation intermittent work and more expensive than the same capacity bought as Spot or Reserved EC2 for steady round-the-clock workloads.',
    why_ko: '시험이 Fargate로 확인하는 것은 "운영 부담과 비용의 트레이드오프를 정확히 읽는가"입니다. 두 조건이 같이 나오면 문제에서 대문자로 강조된 쪽(LEAST operational overhead vs MOST cost-effective)이 승자를 결정합니다.',
    why_en: 'Fargate tests whether you read the overhead-versus-cost trade-off precisely. When both appear, the capitalised qualifier in the question — LEAST operational overhead versus MOST cost-effective — decides the winner.',
    traps: [
      { ko: '상시 높은 사용률 워크로드에 "가장 저렴"을 물었는데 Fargate를 고르는 것 — 이 조건에서는 EC2 시작 유형 + Spot/RI가 더 쌉니다.',
        en: 'Choosing Fargate when a steady high-utilisation workload asks for the cheapest option — EC2 launch type with Spot or RIs wins there.' },
      { ko: 'GPU나 특수 커널 파라미터, 데몬셋 성격의 워크로드에 Fargate를 고르는 것 — 호스트 접근이 필요한 요구는 Fargate로 충족되지 않습니다.',
        en: 'Choosing Fargate for GPU workloads, custom kernel parameters, or daemon-style agents — anything needing host access cannot run there.' }
    ]
  },

  ami: {
    how_ko: 'AMI는 하나 이상의 EBS 스냅샷과 부팅 메타데이터(루트 디바이스, 커널, 아키텍처, 가상화 방식)를 묶은 등록 정보입니다. 인스턴스를 시작하면 그 스냅샷에서 새 EBS 볼륨이 만들어지므로, AMI 자체는 복사되는 것이 아니라 볼륨의 원형으로 쓰입니다.\n\nAMI는 리전 스코프입니다. 다른 리전에서 쓰려면 복사해야 하고, 복사 과정에서 암호화 상태와 KMS 키를 바꿀 수 있습니다. 이 성질이 재해 복구 문제에서 "AMI를 대상 리전으로 복사"라는 단계로 자주 등장합니다.',
    how_en: 'An AMI is a registration record bundling one or more EBS snapshots with boot metadata: root device, kernel, architecture, and virtualisation type. Launching an instance creates fresh EBS volumes from those snapshots, so the AMI acts as a template for volumes rather than being copied itself.\n\nAMIs are Region-scoped. Using one elsewhere requires a copy, and the copy can change encryption state and KMS key. That property shows up in disaster-recovery questions as the step "copy the AMI to the target Region".',
    why_ko: '시험은 AMI를 확장 속도와 표준화의 도구로 봅니다. "확장이 너무 느려 트래픽 급증을 못 따라간다"는 문제에서, 부팅 스크립트로 매번 소프트웨어를 설치하는 구성을 골든 AMI로 바꾸는 것이 정답이 되는 패턴이 반복됩니다.',
    why_en: 'The exam frames AMIs as a tool for launch speed and standardisation. "Scaling is too slow to keep up with spikes" repeatedly resolves to replacing boot-time software installation with a pre-baked golden AMI.',
    traps: [
      { ko: '다른 리전의 AMI ID를 그대로 시작 템플릿에 쓰는 것 — AMI ID는 리전마다 다르므로 복사 후 새 ID를 써야 합니다.',
        en: 'Reusing an AMI ID from another Region in a launch template — AMI IDs differ per Region, so you must copy and use the new ID.' },
      { ko: '민감 정보를 담은 채 AMI를 공유하는 것 — AMI에 남은 키·자격 증명·로그가 함께 배포됩니다.',
        en: 'Sharing an AMI that still contains secrets — keys, credentials, and logs baked into it are distributed too.' }
    ]
  },

  reserved: {
    how_ko: 'Reserved Instance는 "이 조건의 인스턴스를 1년 또는 3년간 쓰겠다"는 약정에 대한 청구 할인입니다. 예약을 사도 인스턴스가 생기는 게 아니라, 조건에 맞는 실행 중 인스턴스에 할인이 자동 적용됩니다. Savings Plans는 이를 한 단계 추상화해 "시간당 얼마어치의 컴퓨팅을 쓰겠다"는 금액 약정으로 바꾼 것이며, 그래서 인스턴스 패밀리·리전·심지어 EC2/Fargate/Lambda 경계를 넘어 적용됩니다.\n\n할인은 조직 단위로 공유됩니다. 통합 결제를 쓰는 조직에서는 한 계정이 산 예약이 다른 계정의 일치하는 사용량에도 적용되므로, 다중 계정 비용 문제에서 이 사실이 정답 근거가 됩니다.',
    how_en: 'A Reserved Instance is a billing discount in exchange for committing to matching usage for one or three years. Buying one does not create an instance; the discount applies automatically to running instances that match. Savings Plans abstract this into a commitment to spend a certain amount per hour, which is why they apply across instance families, Regions, and even the EC2, Fargate, and Lambda boundary.\n\nDiscounts are shared organisation-wide. Under consolidated billing, a reservation bought by one account applies to matching usage in others — often the reasoning behind multi-account cost answers.',
    why_ko: '시험은 워크로드의 지속성을 읽는지 봅니다. "3년간 안정적으로 운영할 예정", "24시간 상시 가동", "기존 인스턴스 비용을 코드 변경 없이 줄여라"가 나오면 약정 할인입니다. 반대로 사용량이 들쭉날쭉하다면 약정은 낭비이므로 서버리스나 Spot으로 방향이 바뀝니다.',
    why_en: 'The exam checks whether you read workload persistence. "Will run steadily for three years", "runs 24/7", or "reduce the cost of existing instances without code changes" means a commitment discount. Erratic usage makes a commitment wasteful, pushing the answer toward serverless or Spot.',
    traps: [
      { ko: 'Standard RI를 고른 뒤 인스턴스 타입을 바꿔야 하는 시나리오 — Standard는 패밀리에 묶여 유연하지 않습니다. 변경 가능성이 있으면 Convertible RI나 Compute Savings Plans가 정답입니다.',
        en: 'Choosing a Standard RI in a scenario that will change instance type — Standard locks to a family. If change is likely, Convertible RIs or Compute Savings Plans are correct.' },
      { ko: '"선결제 없이 절감"이라는 조건에 All Upfront를 고르는 것 — No Upfront 옵션이 명시적 요구를 만족합니다.',
        en: 'Choosing All Upfront when the requirement says "save without an upfront payment" — the No Upfront option is what satisfies it.' }
    ],
    compare: [
      { left: 'Reserved Instances', right: 'Compute Savings Plans',
        rule_ko: '유연성이 필요한 정도로 갈립니다. 인스턴스 구성이 확정적이면 Standard RI가 할인율이 가장 높고, 리전·패밀리·서비스가 바뀔 수 있으면 Compute Savings Plans가 낭비 없이 적용됩니다.',
        rule_en: 'Decided by how much flexibility you need. A fixed configuration gets the deepest discount from a Standard RI; a changing Region, family, or service is covered without waste by Compute Savings Plans.' }
    ]
  },

  eks: {
    how_ko: 'EKS는 쿠버네티스 컨트롤 플레인(API 서버, etcd, 스케줄러)을 AWS가 다중 AZ로 운영해 주는 서비스입니다. 워커 노드는 관리형 노드 그룹(AWS가 EC2를 관리), 자체 관리 노드, 또는 Fargate 프로필 중에서 고릅니다. AWS와 쿠버네티스의 권한 체계를 잇는 것은 IRSA(서비스 어카운트용 IAM 역할)로, 파드가 노드 역할을 빌리지 않고 자기 IAM 역할로 AWS API를 호출하게 합니다.',
    how_en: 'EKS runs the Kubernetes control plane — API server, etcd, scheduler — across multiple AZs for you. Worker nodes come from managed node groups (AWS manages the EC2), self-managed nodes, or Fargate profiles. The bridge between AWS and Kubernetes permissions is IRSA (IAM Roles for Service Accounts), which lets a pod call AWS APIs under its own role instead of borrowing the node role.',
    why_ko: '시험에서 EKS는 조건부 정답입니다. 쿠버네티스를 명시하는 신호가 있어야 하고, 없으면 더 단순한 ECS/Fargate가 이깁니다. 즉 EKS 문제는 서비스 지식보다 "문제가 요구를 명시했는지 읽는 능력"을 봅니다.',
    why_en: 'EKS is a conditional answer: it needs an explicit Kubernetes signal, and without one the simpler ECS or Fargate wins. So EKS questions test reading the stated requirement more than service knowledge.',
    traps: [
      { ko: '단순히 "컨테이너 오케스트레이션이 필요하다"에 EKS를 고르는 것 — 운영 부담과 비용이 더 크므로 ECS가 정답일 가능성이 높습니다.',
        en: 'Choosing EKS for a plain "we need container orchestration" — it carries more overhead and cost, so ECS is usually correct.' },
      { ko: '파드에 노드 인스턴스 역할로 권한을 주는 것 — 그 노드의 모든 파드가 같은 권한을 갖게 되어 최소 권한을 위반합니다. IRSA를 써야 합니다.',
        en: 'Granting pod permissions through the node instance role — every pod on that node inherits them, violating least privilege. Use IRSA.' }
    ]
  },

  elasticbeanstalk: {
    how_ko: 'Elastic Beanstalk은 코드 번들을 받아 플랫폼(Node, Python, Java, Docker 등)을 판별하고, 그에 맞는 CloudFormation 스택을 생성합니다. 결과물인 EC2·ALB·ASG·CloudWatch 알람은 여러분 계정에 그대로 보이며 직접 수정할 수도 있습니다. 즉 Beanstalk은 인프라를 감추는 게 아니라 초기 구성을 대신 해 주는 오케스트레이터입니다.\n\n배포 정책이 무중단 여부를 결정합니다. Immutable은 새 인스턴스 세트를 병렬로 띄운 뒤 교체해 롤백이 가장 안전하고, Blue/Green은 별도 환경을 만든 뒤 CNAME을 교체합니다.',
    how_en: 'Elastic Beanstalk takes a code bundle, detects the platform (Node, Python, Java, Docker), and creates a matching CloudFormation stack. The resulting EC2, ALB, ASG, and CloudWatch alarms remain visible in your account and can be edited directly. Beanstalk does not hide infrastructure; it orchestrates the initial setup for you.\n\nThe deployment policy decides whether there is downtime. Immutable launches a parallel set of new instances then swaps, giving the safest rollback; Blue/Green builds a separate environment and swaps CNAMEs.',
    why_ko: '시험에서 Beanstalk은 "개발자가 인프라를 신경 쓰지 않고 웹앱을 올려야 한다"는 조건에 대응합니다. 다만 컨테이너 중심 문제에서는 ECS/Fargate가, 완전 서버리스 조건에서는 Lambda + API Gateway가 더 나은 정답이 되는 경우가 많습니다.',
    why_en: 'Beanstalk answers "developers must ship a web app without touching infrastructure". In container-centric questions ECS or Fargate usually wins, and under a fully serverless requirement Lambda with API Gateway is often the better answer.',
    traps: [
      { ko: '무중단 배포를 요구하는데 All at once를 고르는 것 — 모든 인스턴스를 동시에 교체해 다운타임이 발생합니다.',
        en: 'Choosing All at once when zero downtime is required — it replaces every instance simultaneously and causes an outage.' }
    ]
  },

  batch: {
    how_ko: 'AWS Batch는 잡 큐, 잡 정의, 컴퓨팅 환경으로 구성됩니다. 잡을 큐에 넣으면 스케줄러가 의존 관계와 우선순위를 보고, 컴퓨팅 환경(EC2 또는 Fargate, On-Demand 또는 Spot)에서 필요한 만큼 용량을 띄워 실행하고 끝나면 회수합니다. 배열 잡으로 수천 개의 인덱스 작업을 한 번에 제출할 수 있고, 잡 간 의존성으로 파이프라인도 구성됩니다.',
    how_en: 'AWS Batch is built from job queues, job definitions, and compute environments. Submitting a job lets the scheduler consider dependencies and priority, provision capacity in the compute environment (EC2 or Fargate, On-Demand or Spot), run the work, and tear the capacity down. Array jobs submit thousands of indexed tasks at once, and job dependencies form pipelines.',
    why_ko: '시험에서 Batch는 Lambda의 15분 제한 위, 상시 클러스터 아래의 빈칸을 채웁니다. "각 작업이 몇 시간 걸리고 야간에 수천 건을 처리한다"는 시나리오가 전형적이며, Spot 컴퓨팅 환경과 결합해 비용을 묻는 형태로 자주 나옵니다.',
    why_en: 'Batch fills the gap above Lambda\'s 15 minutes and below a standing cluster. The classic scenario is thousands of multi-hour jobs run overnight, often combined with a Spot compute environment when the question asks about cost.',
    traps: [
      { ko: '상시 EMR·ECS 클러스터를 띄워 배치를 돌리는 선택지 — 유휴 시간에도 비용이 나가므로 비용 문제에서 오답입니다.',
        en: 'Standing up a permanent EMR or ECS cluster for batch work — it bills while idle, so it loses cost questions.' }
    ]
  },

  placement: {
    how_ko: '배치 그룹은 EC2 배치기(placement engine)에 제약을 주는 힌트입니다. Cluster는 같은 랙 근처에 몰아 넣어 홉 수를 줄이고, Spread는 서로 다른 랙(별도 전원·네트워크)에 강제로 흩뿌리고, Partition은 인스턴스를 논리 파티션으로 나눠 파티션끼리 하드웨어를 공유하지 않게 합니다. 세 방식은 목적이 배타적이므로 하나만 고르게 됩니다.',
    how_en: 'A placement group constrains the EC2 placement engine. Cluster packs instances near the same rack to cut hops; Spread forces them onto distinct racks with separate power and network; Partition divides instances into logical partitions that share no hardware. The three purposes are mutually exclusive, so exactly one is correct.',
    why_ko: '시험은 배치 그룹으로 "지연시간과 내결함성은 상충한다"는 것을 이해하는지 봅니다. 몰아 넣으면 빠르지만 같이 죽고, 흩뿌리면 견고하지만 노드 간 통신이 느려집니다. 문제가 어느 쪽을 원하는지만 정확히 읽으면 됩니다.',
    why_en: 'Placement groups test whether you understand that latency and fault isolation trade off. Packing is fast but fails together; spreading is resilient but slower between nodes. You only need to read which side the question wants.',
    traps: [
      { ko: '고가용성을 요구하는데 Cluster를 고르는 것 — 단일 AZ에 밀집되므로 AZ 장애에 전멸합니다.',
        en: 'Choosing Cluster when high availability is required — packed into one AZ, it dies together with that AZ.' },
      { ko: 'Spread로 대규모 클러스터를 구성하려는 것 — AZ당 7개 인스턴스 제한이 있어 수십 대 규모에는 쓸 수 없습니다.',
        en: 'Trying to build a large cluster with Spread — the seven-instances-per-AZ limit makes it unusable at scale.' }
    ]
  },

  outposts: {
    how_ko: 'Outposts는 AWS가 조립·배송·운영하는 랙을 고객 시설에 설치하고, 해당 리전의 컨트롤 플레인에 전용 링크로 연결합니다. 그 결과 온프레미스 랙 위에서 EC2·EBS·S3 on Outposts·RDS 등을 동일한 API와 콘솔로 쓸 수 있습니다. 컨트롤 플레인은 리전에 있으므로 링크가 끊기면 신규 프로비저닝은 제한되지만 이미 뜬 워크로드는 계속 돕니다.',
    how_en: 'AWS builds, ships, installs, and operates an Outposts rack in your facility, linked to the parent Region\'s control plane. EC2, EBS, S3 on Outposts, and RDS then run on that local rack through the same APIs and console. Because the control plane lives in the Region, losing the link limits new provisioning while existing workloads keep running.',
    why_ko: '시험에서 Outposts는 마지막 수단입니다. 데이터가 물리적으로 시설을 떠날 수 없다거나, 로컬 설비와 밀리초 미만 통신이 필요하다는 명시적 제약이 있을 때만 정답이며, 단순한 "하이브리드"에는 과잉입니다.',
    why_en: 'Outposts is a last resort on the exam: correct only when data physically cannot leave the site or sub-millisecond links to local equipment are required. For plain "hybrid" it is over-engineering.',
    traps: [
      { ko: '"온프레미스와 연결"만 보고 Outposts를 고르는 것 — 연결이 목적이면 Direct Connect나 VPN이, 스토리지 확장이면 Storage Gateway가 정답입니다.',
        en: 'Choosing Outposts merely because on-premises is mentioned — connectivity means Direct Connect or VPN; storage extension means Storage Gateway.' }
    ]
  },

  /* ====================================================================== */
  s3: {
    how_ko: 'S3는 파일 시스템이 아니라 키-값 저장소입니다. 폴더처럼 보이는 것은 키에 들어간 슬래시일 뿐이고, 실제 계층 구조는 없습니다. 객체를 쓰면 여러 AZ에 걸쳐 중복 저장되어 11 nines 내구성을 얻습니다. 2020년 말부터 쓰기 후 읽기가 강한 일관성을 보장하므로, "방금 쓴 객체가 안 보인다"는 옛 시절의 함정은 더 이상 정답이 아닙니다.\n\n접근 제어는 여러 층이 겹칩니다 — IAM 정책(누가), 버킷 정책(리소스 쪽에서 누구를), 블록 퍼블릭 액세스(전체 차단 스위치), ACL(레거시). 평가 결과는 명시적 Deny 우선이며 나머지는 합집합입니다. 시험에서 "버킷을 퍼블릭으로 만든다"가 정답인 경우는 정적 웹사이트 호스팅을 명시할 때뿐이고, 그마저도 CloudFront + OAC가 더 나은 답으로 제시됩니다.',
    how_en: 'S3 is a key-value store, not a filesystem. What looks like folders is just slashes in the key; there is no real hierarchy. Writing an object replicates it across AZs for eleven-nines durability. Since late 2020 read-after-write is strongly consistent, so the old "the object I just wrote is missing" trap is no longer a correct answer.\n\nAccess control layers overlap: IAM policies (who), bucket policies (who, from the resource side), Block Public Access (a master off switch), and ACLs (legacy). Evaluation is explicit-Deny-first, union otherwise. "Make the bucket public" is only correct when static website hosting is explicit, and even then CloudFront with OAC is usually the better answer.',
    why_ko: 'S3는 274문제에 등장하는 최다 출제 서비스지만, 묻는 것은 사실상 네 가지로 압축됩니다 — 어느 스토리지 클래스인가, 언제 전환·삭제하는가, 누구에게 어떻게 열어 주는가, 어느 리전으로 복제하는가. 새 문제를 만나면 먼저 이 네 축 중 어디에 속하는지 분류하는 것이 가장 빠른 접근입니다.',
    why_en: 'S3 appears in 274 questions but the asks compress into four axes: which storage class, when to transition or expire, how to grant access, and where to replicate. Classifying a new question into one of those four is the fastest route to the answer.',
    traps: [
      { ko: '버킷 정책으로 열어 줬는데 여전히 접근이 안 되는 시나리오에서 정책을 더 넓히려는 선택지 — 원인은 대개 계정 수준 블록 퍼블릭 액세스나 KMS 키 정책입니다.',
        en: 'Widening the bucket policy when access still fails — the cause is usually account-level Block Public Access or the KMS key policy, not the bucket policy.' },
      { ko: '5GB를 넘는 객체를 단일 PUT으로 올리는 선택지 — API 한계로 실패합니다. Multipart Upload가 필수입니다.',
        en: 'Uploading an object larger than 5 GB with a single PUT — it fails on the API limit. Multipart Upload is mandatory.' },
      { ko: '리전 간 복제를 켜기만 하면 기존 객체도 복제된다고 가정하는 것 — 복제는 설정 이후의 신규 객체에만 적용되며, 기존 객체는 배치 복제가 필요합니다.',
        en: 'Assuming enabling replication also copies existing objects — replication applies to new objects only; existing ones need S3 Batch Replication.' }
    ],
    compare: [
      { left: '사전 서명 URL (Presigned URL)', right: 'CloudFront 서명된 URL',
        rule_ko: '누가 배포하는가로 갈립니다. 오리진인 S3가 직접 임시 접근을 허용하면 사전 서명 URL, 엣지 캐시를 통해 전 세계로 배포하면서 접근을 제한하면 CloudFront 서명된 URL입니다.',
        rule_en: 'Decided by who serves it. S3 granting temporary access directly → presigned URL. Restricting access while delivering globally through the edge cache → CloudFront signed URL.' },
      { left: 'Intelligent-Tiering', right: '수명주기 규칙',
        rule_ko: '접근 패턴을 아는가로 갈립니다. 안다면 수명주기 규칙이 모니터링 수수료 없이 더 저렴하고, 모르거나 변한다면 Intelligent-Tiering이 자동으로 맞춥니다.',
        rule_en: 'Decided by whether you know the access pattern. Known → lifecycle rules, cheaper with no monitoring fee. Unknown or shifting → Intelligent-Tiering adapts automatically.' }
    ]
  },

  ebs: {
    how_ko: 'EBS 볼륨은 인스턴스에 로컬 디스크처럼 보이지만 실제로는 네트워크 연결 스토리지입니다. 그래서 인스턴스를 종료해도 볼륨은 남고, 다른 인스턴스에 다시 붙일 수 있습니다. 다만 볼륨은 만들어진 AZ를 벗어나지 못합니다 — 다른 AZ로 옮기려면 스냅샷을 떠서 그 AZ에 복원해야 합니다.\n\n스냅샷은 S3에 증분 저장됩니다. 첫 스냅샷은 전체, 이후는 변경 블록만 저장하지만 각 스냅샷은 독립적으로 복원 가능합니다. 중간 스냅샷을 지워도 이후 스냅샷의 복원 능력은 유지됩니다. 스냅샷은 리전 스코프이므로 재해 복구를 위해 다른 리전으로 복사할 수 있습니다.',
    how_en: 'An EBS volume looks like a local disk to the instance but is network-attached storage. That is why the volume survives instance termination and can be re-attached elsewhere. It cannot leave the AZ it was created in — moving it means snapshotting and restoring into the target AZ.\n\nSnapshots are stored incrementally in S3: the first is full, later ones store only changed blocks, yet each restores independently. Deleting an intermediate snapshot does not break later ones. Snapshots are Region-scoped and can be copied to another Region for disaster recovery.',
    why_ko: '시험은 EBS로 두 가지를 봅니다. 하나는 AZ 종속성의 결과를 이해하는지 — 여러 인스턴스가 파일을 공유해야 하는데 EBS를 고르면 오답이고 EFS가 정답입니다. 다른 하나는 볼륨 타입 선택 — IOPS가 부족한가 처리량이 부족한가를 읽고 gp3 조정이냐 io2냐 st1이냐를 고릅니다.',
    why_en: 'EBS tests two things. First, whether you follow the consequences of AZ affinity — choosing EBS when several instances must share files is wrong; EFS is right. Second, volume type selection: read whether IOPS or throughput is short, then pick gp3 tuning, io2, or st1.',
    traps: [
      { ko: 'gp2 시절 습관으로 "IOPS를 늘리려면 볼륨 크기를 키운다"고 고르는 것 — gp3는 IOPS와 처리량을 용량과 독립적으로 설정하므로 크기를 키우지 않고 올릴 수 있습니다.',
        en: 'Carrying over the gp2 habit of "grow the volume to get IOPS" — gp3 sets IOPS and throughput independently of size.' },
      { ko: '기존 미암호화 볼륨을 바로 암호화하려는 선택지 — 제자리 암호화는 불가능하며 스냅샷 → 암호화 복사 → 복원 경로를 거쳐야 합니다.',
        en: 'Encrypting an existing unencrypted volume in place — not possible. The path is snapshot, copy with encryption, restore.' }
    ],
    compare: [
      { left: 'EBS Multi-Attach', right: 'EFS',
        rule_ko: '둘 다 여러 인스턴스가 붙지만 성격이 다릅니다. Multi-Attach는 io1/io2에서 같은 AZ의 소수 인스턴스에 블록 장치를 공유하는 것이라 클러스터 인식 파일 시스템이 별도로 필요합니다. 일반 애플리케이션이 파일을 공유해야 하면 EFS가 정답입니다.',
        rule_en: 'Both attach to several instances but differ in kind. Multi-Attach shares a raw block device among a few same-AZ instances on io1/io2 and still needs a cluster-aware filesystem. Ordinary applications sharing files need EFS.' }
    ]
  },

  efs: {
    how_ko: 'EFS는 NFSv4 엔드포인트를 각 AZ의 마운트 타깃(ENI)으로 노출하는 관리형 파일 시스템입니다. 인스턴스는 자기 AZ의 마운트 타깃에 붙고, 뒤쪽 스토리지는 여러 AZ에 걸쳐 복제되어 있습니다. 용량 개념이 없어 쓰는 만큼 늘고 지우는 만큼 줄며, 과금도 저장된 바이트에만 붙습니다.\n\n접근 제어는 두 층입니다 — 마운트 타깃의 보안 그룹이 NFS 포트(2049) 접근을 통제하고, 파일 시스템 정책과 POSIX 권한이 그 위에서 세부를 정합니다. EFS 접근 문제의 원인이 대개 보안 그룹인 이유입니다.',
    how_en: 'EFS exposes NFSv4 through a mount target (an ENI) in each AZ, backed by storage replicated across AZs. Instances mount the target in their own AZ. There is no provisioned size: it grows and shrinks with usage, and billing follows stored bytes.\n\nAccess control has two layers — the mount target\'s security group gates NFS port 2049, and file system policies plus POSIX permissions refine it above that. This is why EFS access failures usually trace back to a security group.',
    why_ko: 'EFS는 "여러 서버가 같은 파일을 봐야 한다"는 요구의 정답으로 반복 출제됩니다. 특히 로드 밸런서 뒤 여러 EC2가 각자 EBS에 업로드를 저장해 사용자가 파일을 반쯤만 보는 시나리오는 거의 고정 패턴입니다. 비용 문제에서는 수명주기로 IA 클래스에 옮기는 것이 답이 됩니다.',
    why_en: 'EFS recurs as the answer to "several servers must see the same files", most notably the fixed pattern where EC2 instances behind a load balancer each write uploads to their own EBS volume and users see only half their files. In cost questions the answer is a lifecycle policy moving files to the IA class.',
    traps: [
      { ko: '윈도우 서버의 파일 공유에 EFS를 고르는 것 — EFS는 NFS 전용입니다. SMB와 Active Directory가 필요하면 FSx for Windows File Server입니다.',
        en: 'Choosing EFS for Windows file shares — EFS is NFS only. SMB with Active Directory means FSx for Windows File Server.' },
      { ko: '지연시간이 극도로 중요한 단일 인스턴스 DB 볼륨에 EFS를 쓰는 것 — 네트워크 파일 시스템 오버헤드 때문에 EBS io2가 적합합니다.',
        en: 'Using EFS for a latency-critical single-instance database volume — network filesystem overhead makes EBS io2 the fit.' }
    ]
  },

  glacier: {
    how_ko: 'Glacier 계열은 S3의 스토리지 클래스로 통합되어 있어 같은 버킷 안에서 객체 단위로 적용됩니다. 저장 단가가 극도로 낮은 대가로 조회에 시간과 요금이 붙고, 최소 보관 기간이 걸립니다. Deep Archive는 표준 조회가 12시간 내외이며 최소 180일, Flexible Retrieval은 분~시간이며 최소 90일, Instant Retrieval은 밀리초지만 단가가 상대적으로 높습니다.\n\n조회 요금과 최소 보관 기간이 함께 걸린다는 점이 중요합니다. 30일 뒤 지울 데이터를 Deep Archive에 넣으면 180일 분량이 청구되어 오히려 비쌉니다.',
    how_en: 'The Glacier tiers are S3 storage classes applied per object inside the same bucket. Extremely low storage price is paid for with retrieval time, retrieval fees, and a minimum storage duration. Deep Archive retrieves in roughly 12 hours with a 180-day minimum; Flexible Retrieval takes minutes to hours with a 90-day minimum; Instant Retrieval is milliseconds at a higher unit price.\n\nThe combination of retrieval fees and minimum duration matters: putting data you will delete after 30 days into Deep Archive bills 180 days and costs more, not less.',
    why_ko: '시험은 보관 기간과 조회 요구를 대조시킵니다. "7년간 규제 보관, 감사 시에만 조회"는 Deep Archive, "분기별로 몇 번 조회"는 Instant Retrieval, "1년 보관 후 삭제, 조회는 드물지만 몇 시간은 기다릴 수 있다"는 Flexible Retrieval입니다. 함정은 보관 기간이 짧은 경우입니다.',
    why_en: 'The exam contrasts retention against retrieval need. Seven-year regulatory retention read only during audits → Deep Archive. A few reads per quarter → Instant Retrieval. One year then delete, rare reads that can wait hours → Flexible Retrieval. The trap is short retention.',
    traps: [
      { ko: '보관 기간이 최소 과금 기간보다 짧은데 Glacier를 고르는 것 — 조기 삭제 위약금으로 총비용이 올라갑니다.',
        en: 'Choosing Glacier when retention is shorter than the minimum duration — early-deletion charges raise the total.' },
      { ko: '즉시 복원이 필요한 재해 복구 대상을 Deep Archive에 두는 것 — RTO가 12시간을 넘게 되어 요구를 위반합니다.',
        en: 'Putting a disaster-recovery target that needs immediate restore into Deep Archive — the RTO exceeds 12 hours and violates the requirement.' }
    ]
  },

  lifecycle: {
    how_ko: '수명주기 규칙은 버킷 또는 접두사·태그로 좁힌 범위에 대해 "생성 후 N일이 지나면 이 클래스로 전환" 또는 "삭제"를 선언합니다. 규칙 평가는 매일 비동기로 일어나므로 정확히 N일째 자정에 즉시 바뀌지는 않습니다. 버전 관리가 켜진 버킷에서는 현재 버전과 이전 버전에 각각 다른 규칙을 걸 수 있고, 완료되지 않은 멀티파트 업로드를 정리하는 규칙도 별도로 있습니다.\n\n전환에는 순서와 최소 기간 제약이 있습니다. Standard에서 IA로 가려면 최소 30일이 필요하고, 더 저렴한 클래스에서 비싼 클래스로 되돌리는 전환은 규칙으로 표현할 수 없습니다(복사가 필요).',
    how_en: 'A lifecycle rule declares "after N days, transition to this class" or "expire", scoped to a bucket, prefix, or tag. Evaluation runs asynchronously each day, so the change does not land exactly at midnight on day N. On versioned buckets, current and noncurrent versions get separate rules, and a distinct rule cleans up incomplete multipart uploads.\n\nTransitions have ordering and minimum-duration constraints: Standard to IA requires at least 30 days, and moving from a cheaper class back to a pricier one cannot be expressed as a rule (it needs a copy).',
    why_ko: '"며칠 후에는 거의 접근하지 않는다"는 문장은 사실상 수명주기 규칙을 지목하는 신호입니다. 시험은 여기에 두 겹을 더합니다 — 최소 30일 제약을 아는지, 그리고 보관 후 삭제까지 요구되면 전환과 만료를 함께 걸어야 함을 아는지입니다.',
    why_en: '"Rarely accessed after N days" is effectively a pointer to a lifecycle rule. The exam adds two layers: whether you know the 30-day minimum, and whether you combine transition with expiration when retention-then-delete is required.',
    traps: [
      { ko: '업로드 직후 IA로 전환하는 규칙 — 30일 최소 대기 때문에 불가능합니다.',
        en: 'A rule transitioning to IA immediately on upload — impossible due to the 30-day minimum.' },
      { ko: '버전 관리 버킷에서 현재 버전만 정리하고 이전 버전을 방치하는 것 — 이전 버전이 쌓여 비용이 계속 증가합니다.',
        en: 'Cleaning only current versions on a versioned bucket — noncurrent versions accumulate and cost keeps rising.' }
    ]
  },

  fsx: {
    how_ko: 'FSx는 하나의 서비스가 아니라 목적별 파일 시스템 네 가지의 묶음입니다. Windows File Server는 SMB와 NTFS 권한, AD 통합을 그대로 제공하고, Lustre는 초당 수백 GB의 병렬 처리량을 내며 S3를 백엔드로 연결해 객체를 파일처럼 읽습니다. NetApp ONTAP은 NFS·SMB·iSCSI를 동시에 내고 스냅샷·중복 제거 같은 ONTAP 기능을 유지하며, OpenZFS는 ZFS 기반 워크로드를 옮길 때 씁니다.',
    how_en: 'FSx is not one service but four purpose-built filesystems. Windows File Server delivers SMB, NTFS permissions, and AD integration natively. Lustre reaches hundreds of GB/s in parallel and links to S3 so objects are read as files. NetApp ONTAP serves NFS, SMB, and iSCSI together while keeping ONTAP features such as snapshots and deduplication. OpenZFS targets lifting ZFS workloads.',
    why_ko: '시험은 프로토콜과 워크로드 두 단어로 변형을 결정하게 합니다. SMB·Active Directory·Windows가 보이면 Windows File Server, HPC·머신러닝 학습·유전체 분석·초고속 처리량이 보이면 Lustre입니다. 이 두 개만 확실히 구분하면 대부분 풀립니다.',
    why_en: 'The exam picks the variant from two words: protocol and workload. SMB, Active Directory, or Windows → Windows File Server. HPC, ML training, genomics, or extreme throughput → Lustre. Separating those two covers most questions.',
    traps: [
      { ko: '리눅스 NFS 공유에 FSx for Windows를 고르는 것 — 프로토콜이 맞지 않습니다. EFS가 정답입니다.',
        en: 'Choosing FSx for Windows for a Linux NFS share — wrong protocol. EFS is the answer.' }
    ]
  },

  s3class: {
    how_ko: '스토리지 클래스는 세 가지 축의 조합입니다 — 저장 단가, 조회 요금, 가용성(몇 개 AZ에 두는가). Standard는 조회 요금이 없고 여러 AZ에 두어 가장 비쌉니다. Standard-IA는 저장이 싸지만 GB당 조회 요금이 붙고, One Zone-IA는 여기서 AZ 하나로 줄여 20% 더 저렴하지만 그 AZ가 소실되면 데이터가 사라집니다. Intelligent-Tiering은 객체별 접근을 모니터링해 계층을 자동으로 옮기고 소액의 모니터링 수수료를 받습니다.',
    how_en: 'Storage classes combine three axes: storage price, retrieval fee, and availability (how many AZs). Standard has no retrieval fee and spans AZs, so it costs most. Standard-IA is cheaper to store but charges per GB retrieved. One Zone-IA drops to a single AZ for about 20% less, losing data if that AZ is lost. Intelligent-Tiering monitors per-object access and moves tiers automatically for a small monitoring fee.',
    why_ko: '시험은 "얼마나 자주 읽는가"와 "잃어도 되는가"를 조합해 하나를 고르게 합니다. 자주 읽는 데이터를 IA에 넣으면 조회 요금이 저장 절감을 넘어 오히려 비싸진다는 역전 관계를 이해하는지가 핵심입니다.',
    why_en: 'The exam combines "how often is it read" with "can it be lost". The key insight is the reversal: putting frequently read data in IA makes retrieval fees exceed the storage saving, so it costs more.',
    traps: [
      { ko: '중요한 원본 데이터를 One Zone-IA에 두는 것 — 단일 AZ 소실 시 복구 불가입니다. 재생성 가능한 파생 데이터에만 씁니다.',
        en: 'Putting irreplaceable primary data in One Zone-IA — a single AZ loss is unrecoverable. Use it only for reproducible derived data.' },
      { ko: '접근 패턴을 모른다고 명시했는데 수명주기 규칙으로 고정 전환하는 것 — Intelligent-Tiering이 요구에 맞는 답입니다.',
        en: 'Using fixed lifecycle transitions when the question says the access pattern is unknown — Intelligent-Tiering is what matches.' }
    ]
  },

  s3version: {
    how_ko: '버전 관리를 켜면 같은 키에 쓰기가 일어날 때 기존 객체를 덮어쓰지 않고 새 버전 ID를 부여합니다. 삭제 요청은 객체를 지우는 대신 삭제 마커를 최신 버전으로 올려 놓으므로, 마커를 제거하면 이전 버전이 다시 최신이 됩니다. 이것이 실수 삭제 복구의 원리입니다.\n\nObject Lock은 여기에 보존 기간을 얹습니다. Governance 모드는 특정 IAM 권한을 가진 주체가 해제할 수 있고, Compliance 모드는 보존 기간이 끝나기 전까지 루트 계정조차 삭제할 수 없습니다. 후자가 WORM(한 번 쓰고 여러 번 읽기) 규제 요구를 충족하는 근거입니다.',
    how_en: 'With versioning on, writing the same key assigns a new version ID instead of overwriting. A delete places a delete marker as the latest version rather than removing data, so removing the marker makes the prior version current again — the mechanism behind recovering accidental deletions.\n\nObject Lock adds retention on top. Governance mode can be overridden by a principal with a specific IAM permission; Compliance mode blocks deletion even by the root account until retention expires. The latter is what satisfies WORM regulatory requirements.',
    why_ko: '시험은 이 기능을 두 방향으로 씁니다 — 데이터 보호(실수 삭제, 악의적 삭제, 랜섬웨어)와 규정 준수(불변 보관). 또한 리전 간 복제의 전제 조건이라는 점이 별도 문항으로 나옵니다.',
    why_en: 'The exam uses this in two directions: data protection (accidental deletion, malicious deletion, ransomware) and compliance (immutable retention). It also appears as the prerequisite for cross-Region replication.',
    traps: [
      { ko: '버전 관리만 켜면 악의적 삭제를 완전히 막는다고 보는 것 — 권한이 있으면 버전을 영구 삭제할 수 있습니다. MFA Delete나 Object Lock이 추가로 필요합니다.',
        en: 'Believing versioning alone stops malicious deletion — a privileged principal can permanently delete versions. MFA Delete or Object Lock is also needed.' },
      { ko: '버전 관리를 켠 뒤 비용 증가를 방치하는 것 — 모든 이전 버전이 계속 과금되므로 이전 버전 만료 규칙이 필요합니다.',
        en: 'Ignoring the cost after enabling versioning — every noncurrent version keeps billing, so a noncurrent expiration rule is required.' }
    ]
  },

  /* ====================================================================== */
  rds: {
    how_ko: 'RDS는 여러분의 VPC 서브넷 안에 DB 인스턴스를 띄우고 엔진 설치·패치·백업·모니터링을 대신합니다. OS 접근권은 주지 않으므로 SSH로 들어가는 선택지는 항상 오답입니다. 연결은 엔드포인트 DNS 이름으로 하고, Multi-AZ 장애 조치는 이 DNS가 대기 인스턴스를 가리키도록 바뀌는 방식으로 일어납니다 — 그래서 애플리케이션이 DNS 캐시를 오래 붙들면 장애 조치 후에도 옛 주소로 붙으려 합니다.\n\nMulti-AZ와 읽기 전용 복제본은 복제 방식이 근본적으로 다릅니다. Multi-AZ는 동기 복제로 커밋이 대기 인스턴스에 반영될 때까지 기다리므로 데이터 손실이 없지만 쓰기 지연이 약간 늘고, 대기 인스턴스는 트래픽을 받지 않습니다. 읽기 복제본은 비동기라 쓰기 성능에 영향이 없지만 복제 지연이 생기고 읽기를 받습니다.',
    how_en: 'RDS launches a DB instance inside your VPC subnets and handles engine installation, patching, backup, and monitoring. You get no OS access, so any option involving SSH is wrong. Applications connect via an endpoint DNS name, and Multi-AZ failover works by repointing that DNS at the standby — which is why an application holding a stale DNS cache keeps dialling the old address after failover.\n\nMulti-AZ and read replicas replicate in fundamentally different ways. Multi-AZ is synchronous: a commit waits for the standby, so there is no data loss but write latency rises slightly, and the standby serves no traffic. Read replicas are asynchronous: no write-path cost, but replication lag exists and they do serve reads.',
    why_ko: 'RDS 137문제의 대부분은 "가용성인가 성능인가"를 구분하는 훈련입니다. 문제가 "AZ 장애에도 서비스 유지"를 원하면 Multi-AZ, "읽기가 너무 많아 느리다"를 원하면 읽기 복제본이며, 이 둘을 바꿔 놓은 선택지가 거의 모든 문항에 함정으로 들어갑니다. 세 번째 축은 자격 증명 관리입니다.',
    why_en: 'Most of the 137 RDS questions drill one distinction: availability versus performance. "Stay up through an AZ failure" → Multi-AZ. "Reads are overwhelming it" → read replicas. An option swapping the two appears as a distractor in nearly every question. The third axis is credential management.',
    traps: [
      { ko: '읽기 성능 개선을 Multi-AZ로 답하는 것 — 대기 인스턴스는 읽기를 받지 않습니다.',
        en: 'Answering a read-performance question with Multi-AZ — the standby serves no reads.' },
      { ko: '고가용성을 읽기 복제본으로 답하는 것 — 비동기라 데이터 손실 가능성이 있고 자동 장애 조치도 아닙니다.',
        en: 'Answering an availability question with read replicas — asynchronous means possible data loss, and failover is not automatic.' },
      { ko: 'DB 비밀번호를 환경 변수나 파라미터 그룹에 넣는 선택지 — Secrets Manager로 저장하고 자동 교체하는 것이 정답입니다.',
        en: 'Placing the DB password in environment variables or a parameter group — storing it in Secrets Manager with rotation is correct.' }
    ],
    compare: [
      { left: 'RDS', right: 'Aurora',
        rule_ko: '엔진 호환성을 유지하면서 성능·가용성을 크게 올려야 하면 Aurora입니다. Aurora는 6중 복제, 최대 15개 저지연 복제본, 1분 내 리전 승격(Global Database)을 제공합니다. Oracle·SQL Server가 필요하면 Aurora가 지원하지 않으므로 RDS입니다.',
        rule_en: 'Aurora when you must keep engine compatibility while sharply raising performance and availability: six-way replication, up to 15 low-lag replicas, and about one-minute Region promotion via Global Database. If Oracle or SQL Server is required, Aurora does not support them, so RDS.' }
    ]
  },

  dynamodb: {
    how_ko: 'DynamoDB는 파티션 키의 해시로 데이터를 물리 파티션에 분산합니다. 이 구조 때문에 파티션 키를 알고 하는 조회는 항상 한 자릿수 밀리초이지만, 키를 모르고 전체를 훑는 Scan은 느리고 비쌉니다. 즉 DynamoDB 설계는 "어떤 질의를 할지 먼저 정하고 그에 맞춰 키를 정하는" 순서이며, 관계형처럼 나중에 임의 조건으로 조회하는 유연성은 없습니다.\n\n보조 인덱스가 이 제약을 완화합니다. LSI는 같은 파티션 키에 다른 정렬 키를 주고, GSI는 완전히 다른 파티션 키로 별도 테이블을 자동 유지합니다. GSI는 비동기로 갱신되므로 최종 일관성만 보장합니다.',
    how_en: 'DynamoDB distributes items across physical partitions by hashing the partition key. That is why lookups that know the key are always single-digit milliseconds while a Scan, which reads everything, is slow and expensive. Design therefore runs in the order "decide the queries first, then choose keys" — there is no relational-style freedom to query arbitrarily later.\n\nSecondary indexes soften this. An LSI adds a different sort key under the same partition key; a GSI maintains a separate table keyed differently. GSIs update asynchronously, so they are only eventually consistent.',
    why_ko: '시험은 DynamoDB를 "서버리스이고 무한 확장하는 키-값 저장소"로 다루며, RDS와의 경계를 계속 시험합니다. 밀리초 응답·수백만 사용자·유연한 스키마·용량 계획 불필요가 나오면 DynamoDB, 복잡한 조인·집계 리포팅·트랜잭션 무결성이 나오면 관계형입니다. 용량 모드 선택(On-Demand vs Provisioned)이 비용 문항으로 자주 붙습니다.',
    why_en: 'The exam treats DynamoDB as the serverless, infinitely scalable key-value store and keeps probing its boundary with RDS. Millisecond response, millions of users, flexible schema, and no capacity planning → DynamoDB. Complex joins, aggregate reporting, and transactional integrity → relational. Capacity-mode choice frequently rides along as the cost question.',
    traps: [
      { ko: 'Scan으로 조건 조회를 설계하는 선택지 — 테이블 전체를 읽어 비용과 지연이 폭증합니다. GSI를 만들어 Query로 바꾸는 것이 정답입니다.',
        en: 'Designing conditional lookups with Scan — it reads the whole table, exploding cost and latency. Creating a GSI and using Query is correct.' },
      { ko: '꾸준한 부하에 On-Demand를 고르는 것 — 예측 가능한 상시 트래픽에서는 Provisioned + Auto Scaling이 훨씬 저렴합니다.',
        en: 'Choosing On-Demand for steady load — predictable continuous traffic is much cheaper on Provisioned with auto scaling.' }
    ],
    compare: [
      { left: 'DAX', right: 'ElastiCache',
        rule_ko: '캐싱 대상이 DynamoDB뿐이면 DAX가 API 호환이라 코드 변경이 거의 없습니다. RDS나 여러 소스를 캐싱해야 하거나 캐시 자료구조를 직접 다뤄야 하면 ElastiCache입니다.',
        rule_en: 'If only DynamoDB needs caching, DAX is API-compatible and needs almost no code change. Caching RDS or multiple sources, or needing rich cache data structures, means ElastiCache.' }
    ]
  },

  aurora: {
    how_ko: 'Aurora는 데이터베이스 엔진과 스토리지를 분리한 구조입니다. 스토리지는 3개 AZ에 6개 사본을 두는 분산 로그 계층이고, 컴퓨팅 노드(라이터 1개 + 리더 최대 15개)는 그 위에 얹혀 같은 스토리지를 공유합니다. 그래서 리더를 추가해도 데이터 복사가 일어나지 않아 복제 지연이 밀리초 수준이고, 라이터가 죽어도 스토리지는 온전하므로 승격이 빠릅니다.\n\nServerless v2는 이 컴퓨팅 계층을 ACU 단위로 초 단위 확장·축소합니다. 간헐적 워크로드에서 유휴 비용을 없애는 것이 목적입니다. Global Database는 스토리지 계층 복제를 다른 리전으로 확장해 1초 미만 지연과 1분 내외 승격을 제공합니다.',
    how_en: 'Aurora separates engine from storage. Storage is a distributed log layer holding six copies across three AZs; compute nodes (one writer plus up to 15 readers) sit on top and share that storage. Adding a reader therefore copies no data, keeping replication lag in milliseconds, and losing the writer leaves storage intact so promotion is fast.\n\nServerless v2 scales that compute layer in ACU units within seconds to remove idle cost on intermittent workloads. Global Database extends storage-layer replication to other Regions with sub-second lag and roughly one-minute promotion.',
    why_ko: '시험은 Aurora를 "RDS로는 부족할 때의 상위 선택지"로 씁니다. 낮은 RPO·RTO를 요구하는 다중 리전 DR, 읽기 확장이 큰 규모, 사용량이 들쭉날쭉한 개발 환경 비용 절감이 대표적 신호입니다.',
    why_en: 'The exam uses Aurora as the step up when RDS is not enough. Typical signals: multi-Region DR with low RPO and RTO, large read scale-out, and cutting cost on dev environments with erratic usage.',
    traps: [
      { ko: 'Oracle이나 SQL Server 워크로드에 Aurora를 고르는 것 — Aurora는 MySQL·PostgreSQL 호환만 지원합니다.',
        en: 'Choosing Aurora for Oracle or SQL Server — Aurora is MySQL and PostgreSQL compatible only.' },
      { ko: '지속적으로 높은 부하에 Serverless v2를 비용 절감안으로 고르는 것 — 상시 최대치로 확장되면 프로비저닝된 인스턴스보다 비쌀 수 있습니다.',
        en: 'Choosing Serverless v2 as a saving for constantly high load — pinned near maximum capacity it can cost more than a provisioned instance.' }
    ]
  },

  readreplica: {
    how_ko: '읽기 전용 복제본은 원본의 트랜잭션 로그를 비동기로 재생하는 별도 인스턴스입니다. 비동기이므로 원본의 쓰기 성능에 영향이 없고, 대신 복제 지연이 생겨 방금 쓴 데이터를 복제본에서 즉시 못 볼 수 있습니다. 복제본은 자체 엔드포인트를 가지므로 애플리케이션이 읽기 질의를 그쪽으로 보내야 효과가 납니다.\n\n복제본은 수동으로 승격해 독립 데이터베이스로 만들 수 있습니다. 이 성질 때문에 리전 간 복제본이 저비용 DR 수단이 되지만, 승격이 자동이 아니므로 RTO가 수 분 이상 걸립니다.',
    how_en: 'A read replica is a separate instance asynchronously replaying the primary\'s transaction log. Being asynchronous, it costs the primary no write performance but introduces lag, so freshly written data may not be visible on it yet. It has its own endpoint, so the application must direct read queries there for any benefit.\n\nA replica can be manually promoted into an independent database. That makes cross-Region replicas a low-cost DR option, though promotion is not automatic so the RTO runs to minutes.',
    why_ko: '시험은 이 개념으로 "복제의 방향성"을 확인합니다. 읽기 확장은 복제본, 쓰기 확장은 샤딩이나 다른 데이터 모델, 가용성은 Multi-AZ입니다. 세 요구를 각각 다른 도구에 매핑하는지 봅니다.',
    why_en: 'This concept checks that you map three requirements to three different tools: read scale-out to replicas, write scale-out to sharding or a different data model, and availability to Multi-AZ.',
    traps: [
      { ko: '복제본을 만들었는데 애플리케이션이 여전히 원본 엔드포인트만 쓰는 구성 — 부하가 전혀 분산되지 않습니다.',
        en: 'Creating a replica while the application still uses only the primary endpoint — no load is offloaded at all.' },
      { ko: '강한 일관성이 필요한 읽기를 복제본으로 보내는 것 — 복제 지연으로 오래된 데이터를 읽게 됩니다.',
        en: 'Sending strongly consistent reads to a replica — lag means stale data.' }
    ]
  },

  elasticache: {
    how_ko: 'ElastiCache는 Redis 또는 Memcached 노드를 VPC 안에 띄워 줍니다. 캐시는 데이터베이스 앞에 놓여 같은 조회의 반복을 흡수하는데, 이 흡수를 애플리케이션 코드가 직접 구현해야 합니다 — 캐시를 먼저 보고, 없으면 DB에서 읽어 캐시에 채우고(Lazy Loading), TTL로 오래된 항목을 버리는 흐름입니다.\n\nRedis는 단일 스레드로 동작하지만 복제와 자동 장애 조치(Multi-AZ), 영속성(AOF·스냅샷), 정렬 집합 같은 자료구조를 지원합니다. Memcached는 멀티스레드로 단순 캐시를 수평 확장하지만 복제도 영속성도 없어 노드가 죽으면 그 몫의 캐시가 사라집니다.',
    how_en: 'ElastiCache runs Redis or Memcached nodes inside your VPC. A cache sits in front of the database absorbing repeated reads, but the application must implement that absorption: check the cache, on a miss read the database and populate (lazy loading), and let TTLs evict staleness.\n\nRedis is single-threaded yet supports replication with automatic failover (Multi-AZ), persistence (AOF and snapshots), and rich structures such as sorted sets. Memcached is multi-threaded and scales a simple cache horizontally but has neither replication nor persistence, so a dead node loses its share of the cache.',
    why_ko: '시험은 ElastiCache로 두 가지를 봅니다. 하나는 "지연시간 문제의 원인이 반복 조회인지" 진단하는 능력, 다른 하나는 Redis와 Memcached 중 어느 쪽인지 고르는 능력입니다. 고가용성·영속성·리더보드·세션 유지가 나오면 Redis입니다.',
    why_en: 'ElastiCache tests diagnosing whether a latency problem is repeated reads, then choosing Redis or Memcached. High availability, persistence, leaderboards, or session durability all mean Redis.',
    traps: [
      { ko: '고가용성이 필요한 세션 저장소에 Memcached를 고르는 것 — 복제가 없어 노드 장애 시 세션이 날아갑니다.',
        en: 'Choosing Memcached for a session store that needs high availability — without replication, a node failure loses sessions.' },
      { ko: '쓰기가 지배적인 워크로드에 캐시를 추가하는 것 — 무효화 비용이 이점을 상쇄합니다.',
        en: 'Adding a cache to a write-dominated workload — invalidation overhead cancels the benefit.' }
    ]
  },

  dax: {
    how_ko: 'DAX는 DynamoDB 앞에 놓이는 클러스터로, DynamoDB SDK와 호환되는 엔드포인트를 제공합니다. 애플리케이션은 클라이언트를 DAX 엔드포인트로 바꾸기만 하면 되고 캐싱 로직을 짜지 않습니다. 내부적으로 항목 캐시(GetItem 결과)와 질의 캐시(Query·Scan 결과)를 따로 두며, 쓰기는 write-through로 DynamoDB에 반영하면서 캐시도 갱신합니다.',
    how_en: 'DAX is a cluster in front of DynamoDB exposing an endpoint compatible with the DynamoDB SDK. The application only repoints its client — no caching logic to write. Internally it keeps an item cache (GetItem results) and a query cache (Query and Scan results), and writes go write-through, updating DynamoDB and the cache together.',
    why_ko: '시험에서 DAX는 "DynamoDB인데도 여전히 느리다" 또는 "마이크로초가 필요하다"는 조건에 대응합니다. ElastiCache와의 구분(대상이 DynamoDB뿐인가)과 읽기 위주인가가 판단 기준입니다.',
    why_en: 'DAX answers "still too slow even on DynamoDB" or "we need microseconds". The deciding factors are whether the target is only DynamoDB and whether the workload is read-heavy.',
    traps: [
      { ko: 'RDS 조회를 DAX로 캐싱하려는 선택지 — DAX는 DynamoDB 전용입니다.',
        en: 'Caching RDS queries with DAX — DAX works only with DynamoDB.' }
    ]
  },

  documentdb: {
    how_ko: 'DocumentDB는 MongoDB 와이어 프로토콜을 구현한 관리형 문서 데이터베이스로, 스토리지는 Aurora와 같은 분산 계층을 씁니다. 기존 MongoDB 드라이버와 도구가 대부분 그대로 동작하지만 완전한 기능 동등성은 아니므로, 특정 MongoDB 기능 의존성이 있으면 검증이 필요합니다.',
    how_en: 'DocumentDB is a managed document database implementing the MongoDB wire protocol on the same distributed storage layer as Aurora. Most existing MongoDB drivers and tools work unchanged, though feature parity is not complete, so dependencies on specific MongoDB features need validation.',
    why_ko: '시험에서 DocumentDB는 조건부 정답입니다. "기존 MongoDB 워크로드", "MongoDB 드라이버를 그대로 쓴다", "코드 변경 없이 관리형으로 옮겨라" 같은 명시적 신호가 있어야 하고, 그 신호가 없이 단순히 "NoSQL"이나 "유연한 스키마"만 나오면 DynamoDB가 더 흔한 정답입니다. 즉 이 문항은 서비스 지식보다 문제가 요구를 명시했는지 읽는 능력을 봅니다.',
    why_en: 'DocumentDB is a conditional answer needing explicit signals: an existing MongoDB workload, keeping MongoDB drivers, or migrating to a managed service without code changes. Absent those, plain "NoSQL" or "flexible schema" points to DynamoDB. The question tests reading the stated requirement more than service knowledge.',
    traps: [
      { ko: '단순히 "JSON 문서를 저장한다"에 DocumentDB를 고르는 것 — DynamoDB도 문서를 저장하며 운영 부담이 더 낮습니다.',
        en: 'Choosing DocumentDB merely for "stores JSON documents" — DynamoDB stores documents too, with lower overhead.' }
    ]
  },

  neptune: {
    how_ko: 'Neptune은 정점과 간선을 1급 시민으로 저장하고 Gremlin·SPARQL·openCypher로 질의하는 그래프 데이터베이스입니다. 관계형에서 여러 번의 자기 조인이 필요한 "N단계 떨어진 연결 찾기"가 그래프에서는 단일 순회로 끝나기 때문에, 관계 탐색이 핵심인 워크로드에서만 의미가 있습니다.',
    how_en: 'Neptune stores vertices and edges as first-class entities and queries them with Gremlin, SPARQL, or openCypher. Finding connections N hops away, which needs repeated self-joins in a relational database, becomes a single traversal — so it only pays off when relationship traversal is the core workload.',
    why_ko: '시험에서 Neptune은 신호가 매우 분명한 경우에만 정답입니다 — 소셜 그래프의 "친구의 친구", 추천 엔진의 "이 상품을 산 사람이 함께 본 것", 부정 거래의 연결망 추적, 지식 그래프가 그 신호입니다. 이런 표현이 없는데 Neptune이 선택지에 있다면 대개 오답을 유도하는 미끼이며, 계층 구조나 단순 관계는 DynamoDB나 관계형으로 충분합니다.',
    why_en: 'Neptune is correct only on very explicit signals: "friends of friends" in a social graph, "people who bought this also viewed" in a recommendation engine, tracing fraud rings, or a knowledge graph. Without such phrasing, Neptune in the options is usually bait — hierarchies and simple relationships fit DynamoDB or a relational database.',
    traps: [
      { ko: '계층 구조 데이터라는 이유만으로 Neptune을 고르는 것 — 단순 계층은 DynamoDB나 관계형으로 충분합니다.',
        en: 'Choosing Neptune just because data is hierarchical — simple hierarchies fit DynamoDB or a relational database.' },
      { ko: '"관계형 조인이 느리다"는 이유로 Neptune을 고르는 것 — 조인이 한두 단계라면 인덱스 추가나 읽기 복제본, 캐시가 정답입니다. Neptune은 순회 깊이가 가변적이고 깊을 때만 이깁니다.',
        en: 'Choosing Neptune because "relational joins are slow" — for one or two hops the answer is an index, a read replica, or a cache. Neptune wins only when traversal depth is variable and deep.' }
    ],
    compare: [
      { left: 'Neptune', right: 'DynamoDB',
        rule_ko: '질의의 모양으로 갈립니다. 키를 알고 항목을 꺼내는 접근이면 DynamoDB가 훨씬 싸고 빠릅니다. 시작점만 알고 거기서 임의 깊이로 연결을 따라가야 하면 Neptune입니다. "몇 단계 떨어져 있는지 미리 알 수 없다"가 결정적 신호입니다.',
        rule_en: 'Decided by query shape. Fetching items by known key is far cheaper and faster on DynamoDB. Knowing only a starting point and following links to arbitrary depth is Neptune. "We cannot know in advance how many hops away" is the decisive signal.' }
    ]
  },

  /* ====================================================================== */
  alb: {
    how_ko: 'ALB는 리스너(포트·프로토콜)와 규칙, 대상 그룹으로 구성됩니다. 요청이 오면 리스너 규칙이 호스트 헤더·경로·HTTP 헤더·쿼리스트링·소스 IP를 보고 어느 대상 그룹으로 보낼지 결정하고, 대상 그룹은 상태 확인을 통과한 대상에만 라우팅합니다. HTTP 계층까지 파싱하기 때문에 경로별 마이크로서비스 분기, 리다이렉트, 고정 응답 같은 일을 로드 밸런서 자체가 처리할 수 있습니다.\n\nALB는 최소 2개 AZ의 서브넷을 요구하고, 각 AZ에 노드를 두며 DNS 이름 하나로 노출됩니다. 노드의 IP는 바뀔 수 있으므로 IP를 고정해 화이트리스트에 넣어야 하는 요구는 ALB로 충족되지 않습니다.',
    how_en: 'An ALB is built from listeners (port and protocol), rules, and target groups. Incoming requests are matched by host header, path, HTTP headers, query string, or source IP to pick a target group, which routes only to targets passing health checks. Because it parses the HTTP layer, the load balancer itself can split microservices by path and issue redirects or fixed responses.\n\nAn ALB requires subnets in at least two AZs, places a node in each, and is exposed as a single DNS name. Those node IPs can change, so a requirement to whitelist a fixed IP cannot be met by an ALB.',
    why_ko: '시험에서 ALB는 웹 계층 문제의 기본값이며, 대개 ASG와 짝을 이룹니다. 별도로 물어보는 것은 ALB인지 NLB인지, 그리고 SSL을 어디서 종료하는지입니다. 101문제에 등장하는 만큼 "고정 IP", "TCP/UDP", "초저지연" 같은 NLB 신호를 놓치지 않는 것이 중요합니다.',
    why_en: 'The ALB is the default for web-tier questions and usually pairs with an ASG. The separate asks are ALB versus NLB and where TLS terminates. Appearing in 101 questions, the thing to catch is NLB signals: static IP, TCP/UDP, ultra-low latency.',
    traps: [
      { ko: '고정 IP 화이트리스트 요구에 ALB를 고르는 것 — ALB의 IP는 변동합니다. NLB에 Elastic IP를 붙이는 것이 정답입니다.',
        en: 'Choosing an ALB when a static IP must be whitelisted — ALB IPs change. Attaching Elastic IPs to an NLB is correct.' },
      { ko: '단일 AZ 서브넷만 지정하려는 선택지 — ALB는 2개 이상 AZ를 요구하며, 고가용성 관점에서도 오답입니다.',
        en: 'Specifying subnets in only one AZ — an ALB requires two or more, and it fails the availability requirement anyway.' },
      { ko: '스티키 세션으로 세션 문제를 푸는 것 — 인스턴스가 죽으면 세션이 사라집니다. ElastiCache나 DynamoDB로 세션을 외부화하는 편이 정답입니다.',
        en: 'Solving session state with sticky sessions — losing the instance loses the session. Externalising to ElastiCache or DynamoDB is the answer.' }
    ],
    compare: [
      { left: 'ALB', right: 'NLB',
        rule_ko: '계층이 다릅니다. HTTP/HTTPS를 이해해야 하는 일(경로 라우팅, WAF 연동, 리다이렉트)은 ALB, 프로토콜 무관·초고성능·고정 IP·클라이언트 IP 보존은 NLB입니다.',
        rule_en: 'Different layers. Anything needing HTTP awareness — path routing, WAF, redirects — is ALB. Protocol-agnostic, extreme throughput, static IPs, or client-IP preservation is NLB.' }
    ]
  },

  vpc: {
    how_ko: 'VPC는 여러분에게 할당된 사설 IP 대역과 그 안의 라우팅 규칙 묶음입니다. 서브넷은 대역을 AZ 단위로 쪼갠 조각이고, 각 서브넷은 정확히 하나의 라우팅 테이블에 연결됩니다. "퍼블릭 서브넷"이라는 별도 설정은 존재하지 않습니다 — 그 서브넷의 라우팅 테이블에 0.0.0.0/0 → 인터넷 게이트웨이 경로가 있으면 퍼블릭입니다. 이 한 줄이 VPC 문제의 절반을 설명합니다.\n\n트래픽은 두 겹의 방화벽을 통과합니다. 서브넷 경계에서 NACL(무상태, 허용·거부), 인스턴스 ENI에서 보안 그룹(상태 저장, 허용만)입니다. 그리고 VPC 안에서 AWS 서비스로 나가는 경로는 세 가지뿐입니다 — 인터넷 게이트웨이(퍼블릭), NAT 게이트웨이(프라이빗의 아웃바운드), VPC 엔드포인트(사설 직결).',
    how_en: 'A VPC is a private IP range plus the routing rules inside it. Subnets slice that range per AZ, and each subnet attaches to exactly one route table. There is no "public subnet" setting — a subnet is public if its route table has 0.0.0.0/0 pointing at an internet gateway. That single line explains half of all VPC questions.\n\nTraffic crosses two firewalls: NACLs at the subnet boundary (stateless, allow and deny) and security groups at the instance ENI (stateful, allow only). And there are exactly three ways out to AWS services: an internet gateway (public), a NAT gateway (private egress), or a VPC endpoint (private direct).',
    why_ko: 'VPC 79문제는 대체로 "어떤 경로로 나가야 하는가"를 묻습니다. 인터넷 없이 S3에 접근, 프라이빗 서브넷에서 패치 받기, 온프레미스와 연결, 데이터베이스를 어디에 둘지 — 모두 라우팅과 경로의 문제입니다. 서브넷을 여러 AZ에 두는 것은 고가용성의 전제라 거의 모든 정답에 깔려 있습니다.',
    why_en: 'The 79 VPC questions mostly ask which path traffic should take: reaching S3 without internet, patching from a private subnet, connecting on-premises, where the database belongs. All are routing questions. Spreading subnets across AZs underlies nearly every correct answer as a precondition for availability.',
    traps: [
      { ko: 'VPC CIDR을 나중에 줄이려는 계획 — CIDR은 확장만 가능하고 축소는 불가능합니다.',
        en: 'Planning to shrink a VPC CIDR later — CIDRs can only be extended, never reduced.' },
      { ko: '데이터베이스를 퍼블릭 서브넷에 두는 선택지 — 최소 권한과 보안 원칙 위반으로 거의 항상 오답입니다.',
        en: 'Placing a database in a public subnet — almost always wrong on least-privilege and security grounds.' },
      { ko: '/28 서브넷에 16개 IP를 쓸 수 있다고 계산하는 것 — AWS가 5개를 예약하므로 11개만 사용 가능합니다.',
        en: 'Counting 16 usable IPs in a /28 — AWS reserves five, leaving 11.' }
    ]
  },

  cloudfront: {
    how_ko: 'CloudFront는 전 세계 엣지 로케이션에 배포(distribution)를 두고, 사용자를 가장 가까운 엣지로 보냅니다. 엣지에 캐시가 있으면 즉시 응답하고, 없으면 리전 엣지 캐시를 거쳐 오리진에서 가져오면서 캐시에 채웁니다. 중요한 점은 캐시 미스에서도 오리진까지 AWS 백본망을 타기 때문에, 캐싱 불가능한 동적 요청도 공용 인터넷보다 빠르다는 것입니다.\n\n캐시 키는 URL과 여러분이 지정한 헤더·쿠키·쿼리스트링 조합으로 만들어집니다. 캐시 키에 불필요한 값(예: 모든 쿠키)을 넣으면 캐시가 잘게 쪼개져 적중률이 떨어집니다 — 캐시 히트율 문제의 흔한 원인입니다.',
    how_en: 'CloudFront places a distribution across global edge locations and steers each user to the nearest one. A cache hit answers immediately; a miss goes through a regional edge cache to the origin and populates on the way back. Crucially, even a miss travels the AWS backbone to the origin, so uncacheable dynamic requests still beat the public internet.\n\nThe cache key is built from the URL plus whichever headers, cookies, and query strings you include. Putting unnecessary values in the key (all cookies, say) fragments the cache and drops the hit rate — the usual cause of poor cache-hit questions.',
    why_ko: '시험은 CloudFront를 두 목적으로 씁니다 — 전 세계 지연시간 감소와 오리진 보호(부하·비용·보안). 특히 S3를 비공개로 두고 OAC로만 읽게 하는 패턴은 거의 고정 정답이며, WAF·지리적 제한·서명된 URL이 여기에 얹힙니다.',
    why_en: 'The exam uses CloudFront for two purposes: cutting global latency and protecting the origin (load, cost, security). The pattern of keeping S3 private and readable only through OAC is almost a fixed answer, with WAF, geo restriction, and signed URLs layered on.',
    traps: [
      { ko: 'CloudFront를 붙이면서 S3 버킷을 퍼블릭으로 여는 선택지 — OAC를 쓰면 비공개를 유지할 수 있으므로 오답입니다.',
        en: 'Fronting S3 with CloudFront while making the bucket public — OAC keeps it private, so this is wrong.' },
      { ko: 'CloudFront용 ACM 인증서를 서비스 리전에서 발급하는 것 — 반드시 us-east-1이어야 합니다.',
        en: 'Issuing the ACM certificate for CloudFront in the service Region — it must be us-east-1.' },
      { ko: '"정적 파일만 가속된다"고 판단해 동적 API에 CloudFront를 배제하는 것 — 백본 경유만으로도 이득이 있습니다.',
        en: 'Excluding CloudFront from a dynamic API because "it only accelerates static files" — the backbone path alone helps.' }
    ],
    compare: [
      { left: 'CloudFront', right: 'Global Accelerator',
        rule_ko: '캐싱 여부와 프로토콜로 갈립니다. HTTP 콘텐츠를 캐싱해 지연을 줄이면 CloudFront, 캐싱 없이 TCP/UDP 트래픽을 백본으로 태우고 고정 IP·빠른 리전 장애 조치가 필요하면 Global Accelerator입니다.',
        rule_en: 'Decided by caching and protocol. Caching HTTP content to cut latency → CloudFront. Carrying uncacheable TCP/UDP over the backbone with static IPs and fast regional failover → Global Accelerator.' }
    ]
  },

  sgnacl: {
    how_ko: '보안 그룹은 ENI에 붙는 상태 저장 방화벽입니다. 인바운드를 허용하면 그 연결의 응답 트래픽은 아웃바운드 규칙과 무관하게 자동으로 나갑니다. 규칙은 허용만 존재하고, 모든 규칙의 합집합이 적용되며, 소스로 CIDR 대신 다른 보안 그룹을 지정할 수 있습니다.\n\nNACL은 서브넷 경계의 무상태 방화벽입니다. 상태를 기억하지 않으므로 인바운드와 아웃바운드를 각각 열어야 하고, 응답 트래픽을 위해 임시 포트 범위(1024-65535) 아웃바운드가 필요합니다. 규칙은 번호 순서로 평가되어 처음 일치하는 규칙이 결정하며, 거부 규칙을 쓸 수 있는 유일한 계층입니다.',
    how_en: 'A security group is a stateful firewall on the ENI. Allowing inbound automatically permits that connection\'s return traffic regardless of outbound rules. Only allow rules exist, all rules union together, and a source can be another security group instead of a CIDR.\n\nA NACL is a stateless firewall at the subnet boundary. Keeping no state, it needs inbound and outbound opened separately, including outbound ephemeral ports 1024–65535 for replies. Rules evaluate in number order, first match wins, and it is the only layer with deny rules.',
    why_ko: '시험은 이 둘의 차이를 직접 묻거나, 접근 실패의 원인을 진단하게 합니다. "인바운드는 열었는데 응답이 안 온다"는 NACL의 임시 포트 문제이고, "특정 IP만 차단하라"는 보안 그룹으로 불가능해 NACL이 정답입니다. 계층 간 통신은 보안 그룹을 소스로 참조하는 것이 최소 권한 정답입니다.',
    why_en: 'The exam asks the difference directly or makes you diagnose a failure. "Inbound is open but replies never arrive" is a NACL ephemeral-port problem. "Block one specific IP" is impossible with security groups, so NACL is the answer. Tier-to-tier traffic is best expressed by referencing the source security group.',
    traps: [
      { ko: '보안 그룹에 거부 규칙을 추가하는 선택지 — 존재하지 않는 기능입니다.',
        en: 'Adding a deny rule to a security group — no such feature exists.' },
      { ko: 'NACL에서 인바운드만 열고 아웃바운드 임시 포트를 잊는 것 — 요청은 들어오지만 응답이 나가지 못합니다.',
        en: 'Opening only inbound on a NACL and forgetting outbound ephemeral ports — requests arrive but replies cannot leave.' }
    ]
  },

  subnet: {
    how_ko: '서브넷은 VPC CIDR의 부분 집합이며 정확히 하나의 AZ에 존재합니다. 이 두 성질이 아키텍처를 결정합니다 — AZ에 묶이므로 고가용성은 반드시 여러 서브넷을 의미하고, CIDR의 부분 집합이므로 미리 대역을 나눠 두어야 나중에 서브넷을 추가할 수 있습니다. AWS는 각 서브넷에서 5개 주소(네트워크, VPC 라우터, DNS, 예약, 브로드캐스트)를 가져갑니다.\n\n표준 3계층 배치는 AZ당 세 개의 서브넷입니다 — 퍼블릭(ALB, NAT), 프라이빗 앱(EC2·컨테이너), 프라이빗 데이터(RDS·ElastiCache). 데이터 계층을 별도 서브넷으로 분리하는 이유는 라우팅과 NACL을 독립적으로 잠글 수 있기 때문입니다.',
    how_en: 'A subnet is a subset of the VPC CIDR living in exactly one AZ. Those two properties drive the architecture: AZ affinity makes high availability necessarily mean multiple subnets, and being a CIDR subset means you must plan address space to add subnets later. AWS reserves five addresses per subnet (network, VPC router, DNS, future use, broadcast).\n\nThe standard three-tier layout is three subnets per AZ: public (ALB, NAT), private app (EC2, containers), and private data (RDS, ElastiCache). Separating the data tier lets you lock its routing and NACLs independently.',
    why_ko: '서브넷 자체를 묻는 문제는 드물지만, 41문제에서 배경으로 등장합니다. 실질적 출제 포인트는 RDS Multi-AZ에 DB 서브넷 그룹이 두 AZ를 요구한다는 점, 그리고 주소 계산입니다.',
    why_en: 'Subnets are rarely the direct subject but form the background of 41 questions. The practical asks are that RDS Multi-AZ needs a DB subnet group spanning two AZs, and address arithmetic.',
    traps: [
      { ko: '서브넷 하나를 여러 AZ에 걸치게 설계하려는 것 — 불가능합니다.',
        en: 'Designing one subnet to span several AZs — impossible.' },
      { ko: '서브넷을 빠듯하게 잘라 놓고 나중에 확장하려는 계획 — 서브넷 CIDR은 생성 후 변경할 수 없습니다.',
        en: 'Cutting subnets tight and planning to grow them later — a subnet CIDR cannot be changed after creation.' }
    ]
  },

  route53: {
    how_ko: 'Route 53은 권한 있는 DNS 서버입니다. 호스팅 영역에 레코드를 두고, 질의가 오면 라우팅 정책에 따라 어떤 값을 돌려줄지 결정합니다. 상태 확인을 붙이면 비정상 대상을 응답에서 제외할 수 있어, DNS가 곧 장애 조치 장치가 됩니다.\n\nAlias 레코드는 AWS 전용 확장으로, ALB·CloudFront·S3 웹사이트 엔드포인트를 가리킵니다. CNAME과 달리 영역 정점(example.com)에 쓸 수 있고 조회 요금이 무료입니다. 장애 조치의 속도 한계는 DNS TTL이며, 클라이언트가 TTL 동안 옛 응답을 캐시하므로 즉각적인 전환이 필요하면 Global Accelerator가 더 낫습니다.',
    how_en: 'Route 53 is an authoritative DNS server. Records live in a hosted zone, and routing policies decide which value a query receives. Attaching health checks removes unhealthy targets from responses, which turns DNS itself into a failover mechanism.\n\nAlias records are an AWS extension pointing at ALBs, CloudFront, or S3 website endpoints. Unlike CNAMEs they work at the zone apex and queries are free. Failover speed is bounded by DNS TTL, since clients cache the old answer for its duration — so when the switch must be immediate, Global Accelerator fits better.',
    why_ko: '시험에서 Route 53 문제는 거의 항상 "어떤 라우팅 정책인가"입니다. 가장 빠른 리전으로는 Latency, 사용자 위치 기준 규정 준수·현지화는 Geolocation, 점진적 배포는 Weighted, 대기 사이트 전환은 Failover입니다. 다중 리전 아키텍처의 트래픽 전환 담당이라는 역할을 이해하는 것이 핵심입니다.',
    why_en: 'Route 53 questions almost always reduce to which routing policy. Fastest Region → Latency. Compliance or localisation by user location → Geolocation. Gradual rollout → Weighted. Swinging to a standby → Failover. The core insight is its role as the traffic-shifting half of multi-Region designs.',
    traps: [
      { ko: '영역 정점(example.com)에 CNAME을 쓰려는 선택지 — DNS 표준상 불가능하며 Alias를 써야 합니다.',
        en: 'Using a CNAME at the zone apex — not allowed by DNS; use an Alias record.' },
      { ko: '데이터 복제 없이 Route 53 장애 조치만으로 DR을 구성하는 것 — 트래픽은 넘어가지만 데이터가 없습니다.',
        en: 'Building DR with Route 53 failover but no data replication — traffic moves to a Region with no data.' }
    ],
    compare: [
      { left: 'Latency 라우팅', right: 'Geolocation 라우팅',
        rule_ko: '목적이 다릅니다. Latency는 실측 지연시간이 가장 낮은 리전으로 보내 성능을 최적화하고, Geolocation은 사용자가 어느 나라인지로 보내 규정 준수나 언어별 콘텐츠를 만족시킵니다. "데이터가 국경을 넘으면 안 된다"는 Geolocation입니다.',
        rule_en: 'Different goals. Latency sends users to the Region with the lowest measured latency (performance). Geolocation sends by the user\'s country (compliance or localised content). "Data must not cross borders" means Geolocation.' }
    ]
  },

  vpcendpoint: {
    how_ko: '게이트웨이 엔드포인트는 라우팅 테이블에 접두사 목록(prefix list) 항목을 추가하는 방식으로 동작합니다. S3나 DynamoDB로 향하는 트래픽이 인터넷 게이트웨이나 NAT를 거치지 않고 AWS 내부로 빠집니다. 요금이 없고 S3·DynamoDB에만 존재합니다.\n\n인터페이스 엔드포인트(PrivateLink)는 여러분의 서브넷에 실제 ENI를 만들고 사설 IP를 부여합니다. 그 서비스의 DNS 이름이 이 사설 IP로 해석되도록 프라이빗 DNS가 켜지므로, 애플리케이션 코드를 바꾸지 않고도 트래픽이 사설 경로를 탑니다. ENI가 생기므로 보안 그룹을 붙일 수 있고 시간당 요금과 데이터 처리 요금이 붙습니다.',
    how_en: 'A gateway endpoint works by adding a prefix-list entry to your route table, so traffic bound for S3 or DynamoDB leaves through AWS internals instead of an internet or NAT gateway. It is free and exists only for S3 and DynamoDB.\n\nAn interface endpoint (PrivateLink) creates real ENIs with private IPs in your subnets. Private DNS makes the service\'s hostname resolve to those private IPs, so traffic takes the private path with no application change. Because ENIs exist, security groups apply, and it bills hourly plus per GB.',
    why_ko: '"인터넷 연결 없이 접근"이라는 문구는 사실상 엔드포인트를 지목합니다. 두 번째 출제 각도는 비용입니다 — S3로 대량 데이터를 보내면서 NAT 데이터 처리 요금이 커지는 문제에서, 게이트웨이 엔드포인트로 바꾸면 그 비용이 완전히 사라집니다.',
    why_en: '"Access without internet connectivity" effectively points at an endpoint. The second angle is cost: when heavy S3 traffic runs up NAT data-processing charges, switching to a gateway endpoint removes them entirely.',
    traps: [
      { ko: 'S3 접근을 위해 인터페이스 엔드포인트를 고르는 것 — 게이트웨이 엔드포인트가 무료이므로 비용 문제에서는 오답입니다.',
        en: 'Choosing an interface endpoint for S3 access — the gateway endpoint is free, so this loses cost questions.' },
      { ko: '엔드포인트를 만들었는데 라우팅 테이블 연결을 빠뜨리는 것 — 게이트웨이 엔드포인트는 연결된 라우팅 테이블에서만 동작합니다.',
        en: 'Creating a gateway endpoint but not associating the route tables — it only works on associated tables.' }
    ]
  },

  nlb: {
    how_ko: 'NLB는 계층 4에서 동작해 TCP·UDP·TLS 연결을 대상으로 전달합니다. HTTP를 파싱하지 않으므로 오버헤드가 거의 없고 초당 수백만 연결을 처리하며 지연시간이 가장 낮습니다. AZ마다 하나의 고정 IP(원하면 Elastic IP)를 가지므로 방화벽 화이트리스트에 등록할 수 있습니다.\n\n기본적으로 클라이언트 IP를 그대로 보존해 대상에 전달하므로, 애플리케이션이 X-Forwarded-For 없이도 실제 소스 IP를 봅니다. 대신 이 때문에 대상의 보안 그룹은 클라이언트 IP 대역을 허용해야 합니다.',
    how_en: 'An NLB operates at layer 4, forwarding TCP, UDP, and TLS connections. Not parsing HTTP means almost no overhead, millions of connections per second, and the lowest latency. It holds one static IP per AZ (optionally an Elastic IP), so it can be whitelisted in a firewall.\n\nBy default it preserves the client IP through to the target, so applications see the real source without X-Forwarded-For. The consequence is that target security groups must allow the client IP ranges.',
    why_ko: 'NLB는 신호가 명확합니다 — 고정 IP, 비-HTTP 프로토콜, 극한의 성능·지연시간. 이 셋 중 하나라도 명시되면 ALB 선택지를 제거합니다.',
    why_en: 'NLB signals are explicit: static IP, non-HTTP protocol, or extreme performance and latency. Any one of them eliminates the ALB option.',
    traps: [
      { ko: '경로 기반 라우팅이나 WAF 연동을 NLB로 하려는 것 — 계층 4라 HTTP를 보지 못합니다.',
        en: 'Expecting path-based routing or WAF integration from an NLB — at layer 4 it cannot see HTTP.' }
    ]
  },

  natgw: {
    how_ko: 'NAT 게이트웨이는 퍼블릭 서브넷에 놓이고 Elastic IP를 갖습니다. 프라이빗 서브넷의 라우팅 테이블이 0.0.0.0/0을 이 NAT로 보내면, 나가는 연결은 NAT의 공인 IP로 주소 변환되어 인터넷에 도달합니다. 반대 방향 신규 연결은 불가능해 아웃바운드 전용 통로가 됩니다.\n\n비용 구조가 중요합니다 — 시간당 요금과 처리한 GB당 요금이 모두 붙습니다. 그래서 S3로 테라바이트 단위 데이터를 보내면 NAT 데이터 처리 요금이 예상 밖으로 커지고, 게이트웨이 VPC 엔드포인트로 우회하는 것이 정답이 됩니다. 또한 NAT는 AZ에 종속되므로 AZ마다 하나씩 두어야 단일 장애점이 사라집니다.',
    how_en: 'A NAT gateway sits in a public subnet with an Elastic IP. When a private subnet\'s route table sends 0.0.0.0/0 to it, outbound connections are translated to the NAT\'s public address and reach the internet. Inbound connections cannot be initiated, making it egress-only.\n\nIts cost structure matters: hourly plus per GB processed. Sending terabytes to S3 therefore runs up surprising NAT charges, and routing around it with a gateway VPC endpoint becomes the answer. A NAT is also AZ-bound, so one per AZ is needed to remove the single point of failure.',
    why_ko: '시험은 NAT를 두 방향에서 씁니다 — 고가용성(AZ마다 하나인가)과 비용(엔드포인트로 우회할 수 있는가). 또한 "관리 부담 최소화" 조건에서 NAT 인스턴스는 항상 오답이고 NAT 게이트웨이가 정답입니다.',
    why_en: 'The exam approaches NAT from two sides: availability (one per AZ?) and cost (can an endpoint bypass it?). And under "minimise operational overhead", a NAT instance is always wrong while the NAT gateway is right.',
    traps: [
      { ko: 'NAT 게이트웨이 하나로 모든 AZ의 프라이빗 서브넷을 라우팅하는 것 — 그 AZ가 죽으면 전 AZ의 아웃바운드가 끊깁니다.',
        en: 'Routing every AZ\'s private subnets through one NAT gateway — losing that AZ kills egress for all of them.' },
      { ko: 'NAT 게이트웨이를 프라이빗 서브넷에 두는 것 — 인터넷 게이트웨이 경로가 없어 동작하지 않습니다.',
        en: 'Placing the NAT gateway in a private subnet — with no route to an internet gateway it cannot work.' }
    ]
  },

  sitevpn: {
    how_ko: 'Site-to-Site VPN은 여러분의 고객 게이트웨이(온프레미스 라우터)와 AWS의 가상 프라이빗 게이트웨이 또는 Transit Gateway 사이에 IPsec 터널을 만듭니다. AWS는 이중화를 위해 항상 두 개의 터널 엔드포인트를 제공하므로, 고객 측에서 두 터널을 모두 구성해야 진짜 이중화가 됩니다.\n\n트래픽이 공용 인터넷을 타기 때문에 대역폭과 지연시간이 인터넷 상태에 따라 변동합니다. 그래서 "일관된 성능"을 요구하는 문제에서는 Direct Connect가 정답이 되고, VPN은 빠른 구축이나 백업 경로로 등장합니다.',
    how_en: 'Site-to-Site VPN builds IPsec tunnels between your customer gateway (on-premises router) and an AWS virtual private gateway or Transit Gateway. AWS always provides two tunnel endpoints for redundancy, so real redundancy requires configuring both on your side.\n\nBecause traffic rides the public internet, bandwidth and latency vary with internet conditions. That is why questions demanding consistent performance answer Direct Connect, with VPN appearing as the fast-to-build option or the backup path.',
    why_ko: '시험의 판단 기준은 시간과 일관성입니다. "며칠 안에 연결"은 VPN, "예측 가능한 대역폭"은 Direct Connect, "전용선이 끊겼을 때 대비"는 둘을 함께 쓰는 구성입니다.',
    why_en: 'The deciding factors are time and consistency. "Connect within days" → VPN. "Predictable bandwidth" → Direct Connect. "Cover the dedicated link failing" → both together.',
    traps: [
      { ko: '터널 하나만 구성하고 이중화가 됐다고 보는 것 — 두 터널을 모두 활성화해야 합니다.',
        en: 'Configuring one tunnel and calling it redundant — both tunnels must be active.' }
    ]
  },

  directconnect: {
    how_ko: 'Direct Connect는 AWS Direct Connect 로케이션에서 여러분의 네트워크와 AWS를 물리 회선으로 잇습니다. 회선 위에 가상 인터페이스(VIF)를 만들어 용도를 나눕니다 — Private VIF는 VPC의 사설 IP로, Public VIF는 S3 같은 퍼블릭 엔드포인트로, Transit VIF는 Transit Gateway로 연결됩니다.\n\n장점은 일관된 대역폭·낮은 지연시간·저렴한 데이터 전송 요금이고, 대가는 물리 회선 프로비저닝 기간(수 주~수 개월)입니다. 이 기간이 시험의 주된 함정이며, 회선 하나는 단일 장애점이라 두 번째 회선이나 VPN 백업이 고가용성 정답에 포함됩니다.',
    how_en: 'Direct Connect links your network to AWS with a physical circuit at a Direct Connect location. Virtual interfaces divide its use: a private VIF reaches VPC private IPs, a public VIF reaches public endpoints such as S3, and a transit VIF attaches to a Transit Gateway.\n\nThe benefits are consistent bandwidth, low latency, and cheaper data transfer; the cost is provisioning time for a physical circuit, weeks to months. That lead time is the main exam trap, and since one circuit is a single point of failure, a second circuit or VPN backup belongs in any high-availability answer.',
    why_ko: '시험은 Direct Connect를 시간 제약과 이중화 두 각도로 묻습니다. "즉시 필요"면 오답, "대용량을 상시 안정적으로"면 정답, 그리고 "고가용성"이 붙으면 반드시 백업 경로가 함께 있어야 합니다.',
    why_en: 'The exam probes Direct Connect from two angles: lead time and redundancy. "Needed immediately" makes it wrong; "large, sustained, and stable" makes it right; and once availability is mentioned, a backup path must accompany it.',
    traps: [
      { ko: '단일 Direct Connect 회선으로 고가용성을 주장하는 선택지 — 회선·로케이션·라우터 모두 단일 장애점입니다.',
        en: 'Claiming high availability from a single Direct Connect circuit — the circuit, location, and router are all single points of failure.' },
      { ko: '긴급한 마이그레이션 일정에 Direct Connect를 제안하는 것 — 프로비저닝 기간을 맞출 수 없습니다.',
        en: 'Proposing Direct Connect for an urgent migration deadline — provisioning cannot meet it.' }
    ]
  },

  globalaccel: {
    how_ko: 'Global Accelerator는 두 개의 애니캐스트 고정 IP를 발급합니다. 애니캐스트라 전 세계 어디서 접속해도 같은 IP가 가장 가까운 AWS 엣지로 라우팅되고, 거기서부터 목적지 리전까지는 공용 인터넷 대신 AWS 백본망을 탑니다. 캐싱은 하지 않으므로 모든 요청이 오리진에 도달합니다.\n\n엔드포인트 그룹의 상태를 지속적으로 확인해 비정상 리전을 빼고, DNS TTL에 의존하지 않으므로 전환이 수십 초 단위로 빠릅니다. 트래픽 다이얼로 리전별 비중을 조절해 점진적 전환도 가능합니다.',
    how_en: 'Global Accelerator issues two static anycast IPs. Being anycast, the same IP routes to the nearest AWS edge from anywhere, and from there to the destination Region over the AWS backbone rather than the public internet. It does not cache, so every request reaches the origin.\n\nIt continuously health-checks endpoint groups to drop unhealthy Regions, and because it does not depend on DNS TTL the switch happens within seconds. A traffic dial adjusts per-Region weighting for gradual shifts.',
    why_ko: '시험 신호는 세 가지입니다 — 고정 IP가 필요한 비-HTTP 워크로드(게임, IoT, VoIP), 캐싱이 무의미한 동적 트래픽의 전역 가속, DNS보다 빠른 리전 장애 조치.',
    why_en: 'Three exam signals: non-HTTP workloads needing static IPs (gaming, IoT, VoIP), global acceleration of dynamic traffic where caching is pointless, and regional failover faster than DNS.',
    traps: [
      { ko: '정적 웹 콘텐츠 배포에 Global Accelerator를 고르는 것 — 캐싱이 없어 CloudFront보다 비효율적입니다.',
        en: 'Choosing Global Accelerator to deliver static web content — with no caching it is less efficient than CloudFront.' }
    ]
  },

  vpcpeering: {
    how_ko: '피어링은 두 VPC의 라우팅 테이블에 서로의 CIDR을 향하는 경로를 추가해 사설 통신을 가능하게 합니다. AWS 백본을 쓰므로 대역폭 병목이나 단일 장애점이 없고, 계정과 리전을 넘어 맺을 수 있습니다.\n\n두 가지 결정적 제약이 있습니다. 첫째, 전이적 라우팅이 불가능합니다 — A-B와 B-C가 있어도 A는 C에 닿지 못합니다. 둘째, CIDR이 겹치면 아예 맺을 수 없습니다. VPC 수가 늘면 필요한 연결이 n(n-1)/2로 증가해 관리가 무너지므로, 규모가 커지면 Transit Gateway가 정답이 됩니다.',
    how_en: 'Peering adds routes for each other\'s CIDR to both VPCs\' route tables, enabling private traffic. It uses the AWS backbone, so there is no bandwidth bottleneck or single point of failure, and it works across accounts and Regions.\n\nTwo constraints decide questions. First, routing is never transitive: with A-B and B-C, A still cannot reach C. Second, overlapping CIDRs make peering impossible. Required connections grow as n(n-1)/2, so at scale Transit Gateway becomes the answer.',
    why_ko: '시험은 VPC 개수로 답을 가릅니다. 두세 개면 피어링이 단순하고 저렴하며, 수십 개면 Transit Gateway입니다. 전이적 라우팅 불가라는 사실 자체를 묻는 문항도 나옵니다.',
    why_en: 'The exam decides by VPC count: two or three favours peering as simpler and cheaper; dozens favours Transit Gateway. Some questions test the non-transitivity fact directly.',
    traps: [
      { ko: '허브 VPC를 통해 스포크끼리 통신하게 설계하는 것 — 피어링은 전이적이지 않아 동작하지 않습니다.',
        en: 'Designing spokes to talk through a hub VPC — peering is not transitive, so it does not work.' }
    ]
  },

  transitgw: {
    how_ko: 'Transit Gateway는 리전 단위 라우터입니다. VPC, VPN, Direct Connect 게이트웨이, 다른 리전의 Transit Gateway를 어태치먼트로 붙이면 중앙에서 라우팅합니다. 각 어태치먼트를 어떤 라우팅 테이블에 연결하느냐로 통신 가능 범위를 정하므로, 개발·운영 격리 같은 세분화된 정책을 표현할 수 있습니다.\n\n피어링과 달리 전이적이므로 스포크끼리, 그리고 스포크와 온프레미스가 허브를 거쳐 통신합니다. 이것이 대규모 네트워크에서 피어링 메시를 대체하는 이유입니다.',
    how_en: 'Transit Gateway is a Region-scale router. Attach VPCs, VPNs, Direct Connect gateways, and Transit Gateways in other Regions, and it routes centrally. Which route table an attachment associates with defines what it can reach, so fine-grained policies such as dev/prod isolation are expressible.\n\nUnlike peering it is transitive, so spokes talk to each other and to on-premises through the hub — the reason it replaces peering meshes at scale.',
    why_ko: '시험 신호는 규모와 격리입니다. "수십 개 VPC", "온프레미스와 모든 VPC 연결", "환경별로 통신을 분리"가 나오면 Transit Gateway입니다.',
    why_en: 'The signals are scale and isolation: dozens of VPCs, connecting on-premises to all VPCs, or separating communication per environment.',
    traps: [
      { ko: 'VPC 두 개만 연결하는데 Transit Gateway를 고르는 것 — 시간당 어태치먼트 요금이 붙어 피어링보다 비쌉니다.',
        en: 'Choosing Transit Gateway to connect just two VPCs — per-attachment hourly charges make it pricier than peering.' }
    ]
  },

  /* ====================================================================== */
  iam: {
    how_ko: 'IAM 요청이 들어오면 AWS는 항상 같은 순서로 평가합니다 — 기본은 거부(implicit deny), 어디든 명시적 Deny가 있으면 즉시 거부, 그렇지 않고 Allow가 있으면 허용입니다. 여기에 SCP(조직 상한), 권한 경계(위임 상한), 리소스 정책(리소스 쪽 허용), 세션 정책이 겹치면 최종 권한은 이들의 교집합입니다. 그래서 "정책을 더 넓혔는데도 안 된다"는 문제의 원인은 대개 상위 경계입니다.\n\n역할은 신뢰 정책(누가 이 역할을 맡을 수 있는가)과 권한 정책(맡으면 무엇을 할 수 있는가) 두 장으로 이루어집니다. AssumeRole을 호출하면 STS가 만료 시간이 있는 임시 자격 증명을 발급하고, 이 만료성이 장기 액세스 키보다 안전한 근본 이유입니다.',
    how_en: 'Every IAM request is evaluated in the same order: implicit deny by default, immediate denial if any explicit Deny applies, otherwise allowed if an Allow applies. Layer on SCPs (organisation ceiling), permission boundaries (delegation ceiling), resource policies (allow from the resource side), and session policies, and the effective permission is their intersection. That is why "I widened the policy and it still fails" usually traces to a higher boundary.\n\nA role has two documents: a trust policy (who may assume it) and permission policies (what they can do once assumed). Calling AssumeRole makes STS issue credentials with an expiry, and that expiry is the fundamental reason roles beat long-lived access keys.',
    why_ko: 'IAM 76문제의 공통 패턴은 "장기 자격 증명을 어딘가에 저장하는 선택지를 골라내 버리기"입니다. 그다음이 범위 좁히기 — 리소스 ARN 지정, 조건 키(PrincipalOrgID, SourceIp, MFA), 교차 계정은 역할 수임입니다. 기능이 같아 보이는 선택지가 여럿이면 권한 범위가 가장 좁은 쪽이 정답입니다.',
    why_en: 'The shared pattern across 76 IAM questions is discarding any option that stores long-lived credentials. Next comes narrowing: specific resource ARNs, condition keys (PrincipalOrgID, SourceIp, MFA), and AssumeRole for cross-account. Among functionally equal options, the narrowest scope wins.',
    traps: [
      { ko: '계정마다 IAM 사용자를 만들어 교차 계정 접근을 푸는 선택지 — 역할 수임이 정답입니다.',
        en: 'Solving cross-account access by creating IAM users in each account — AssumeRole is the answer.' },
      { ko: 'SCP가 권한을 부여한다고 보는 것 — SCP는 상한만 정하며 실제 부여는 IAM 정책이 합니다.',
        en: 'Treating an SCP as granting permission — it only sets a ceiling; IAM policies grant.' },
      { ko: 'AdministratorAccess나 Action:*/Resource:* 를 붙이는 선택지 — 최소 권한 위반으로 거의 항상 오답입니다.',
        en: 'Attaching AdministratorAccess or Action:* on Resource:* — almost always wrong on least privilege.' }
    ]
  },

  kms: {
    how_ko: 'KMS의 핵심 개념은 봉투 암호화입니다. KMS 키(CMK)는 절대 서비스를 떠나지 않고, 대신 데이터 키를 발급합니다. 서비스는 이 데이터 키로 실제 데이터를 암호화하고, 데이터 키 자체는 CMK로 암호화해 데이터 옆에 저장합니다. 복호화할 때는 암호화된 데이터 키를 KMS에 보내 풀어 달라고 요청합니다. 이 구조 때문에 KMS 직접 암호화는 4KB로 제한되지만 실질적으로는 크기 제한이 없습니다.\n\n접근 통제는 키 정책과 IAM 정책 두 층입니다. 키 정책은 키 자체에 붙는 리소스 정책으로, 여기에 허용되지 않은 주체는 IAM에서 아무리 허용해도 쓸 수 없습니다 — "S3 접근 권한은 있는데 객체를 못 읽는다"는 문제의 흔한 원인입니다.',
    how_en: 'The central idea is envelope encryption. The KMS key never leaves the service; instead it issues a data key. The service encrypts your payload with that data key, then stores the data key encrypted under the KMS key alongside the data. Decryption sends the wrapped data key back to KMS to unwrap. This is why direct KMS encryption is capped at 4 KB yet there is effectively no size limit.\n\nAccess has two layers: the key policy and IAM policies. The key policy is a resource policy on the key itself, and a principal it does not admit cannot use the key no matter what IAM allows — a common cause of "I have S3 permissions but cannot read the object".',
    why_ko: '시험은 KMS로 "키를 누가 통제하는가"를 묻습니다. AWS 관리형 키로 충분한가, 고객 관리형 키가 필요한가(정책 통제·교체 주기·감사·비활성화), 아니면 CloudHSM까지 가야 하는가(전용 하드웨어, AWS도 접근 불가, FIPS 140-2 레벨 3)입니다.',
    why_en: 'KMS questions ask who controls the key: is an AWS-managed key enough, is a customer-managed key needed (policy control, rotation, audit, disable), or must it be CloudHSM (dedicated hardware, inaccessible to AWS, FIPS 140-2 Level 3)?',
    traps: [
      { ko: '키 정책을 무시하고 IAM 정책만 넓히는 선택지 — 키 정책에 주체가 없으면 여전히 실패합니다.',
        en: 'Widening only the IAM policy while ignoring the key policy — without the principal in the key policy it still fails.' },
      { ko: '리전 간 복제 시 대상 리전의 키를 준비하지 않는 것 — KMS 키는 리전 스코프이므로 대상 리전 키가 필요합니다(또는 다중 리전 키).',
        en: 'Replicating cross-Region without a key in the destination — KMS keys are Region-scoped, so the target Region needs its own key (or a multi-Region key).' }
    ]
  },

  iamrole: {
    how_ko: '역할은 소유자가 없는 자격 증명 컨테이너입니다. 신뢰 정책이 허용한 주체가 sts:AssumeRole을 호출하면 STS가 임시 액세스 키·시크릿·세션 토큰을 발급하고, 기본 1시간 후 만료됩니다. EC2에서는 인스턴스 프로파일이 이 과정을 자동화해 SDK가 메타데이터 서비스에서 자격 증명을 계속 갱신해 가져갑니다.\n\n서드파티가 여러분 계정에 접근할 때는 신뢰 정책에 External ID 조건을 넣습니다. 이것이 없으면 그 서드파티의 다른 고객이 여러분 계정을 지목해 접근을 유도할 수 있는 혼동된 대리인 문제가 생깁니다.',
    how_en: 'A role is an ownerless credential container. A principal permitted by the trust policy calls sts:AssumeRole, and STS issues a temporary access key, secret, and session token expiring after an hour by default. On EC2 the instance profile automates this, with the SDK continuously refreshing credentials from the metadata service.\n\nWhen a third party accesses your account, put an External ID condition in the trust policy. Without it, another customer of that third party could induce access to your account — the confused-deputy problem.',
    why_ko: '시험은 역할을 "액세스 키의 대안"으로 반복 제시합니다. EC2·Lambda·ECS가 AWS API를 호출하는 모든 시나리오, 교차 계정 접근, 사내 디렉터리 연동(SAML·IAM Identity Center)이 모두 역할로 수렴합니다.',
    why_en: 'The exam repeatedly presents roles as the alternative to access keys. Every scenario where EC2, Lambda, or ECS calls an AWS API, plus cross-account access and corporate directory federation via SAML or IAM Identity Center, converges on roles.',
    traps: [
      { ko: '서드파티 접근 역할에 External ID를 생략하는 것 — 혼동된 대리인 공격에 노출됩니다.',
        en: 'Omitting the External ID on a third-party access role — it exposes you to confused-deputy attacks.' },
      { ko: '역할을 붙였는데도 코드가 하드코딩된 키를 먼저 쓰는 구성 — 자격 증명 우선순위 때문에 역할이 무시됩니다.',
        en: 'Attaching a role while the code still prefers hardcoded keys — the credential precedence chain ignores the role.' }
    ]
  },

  waf: {
    how_ko: 'WAF는 웹 ACL을 만들어 CloudFront 배포, ALB, API Gateway, AppSync에 연결합니다. 웹 ACL 안에는 규칙이 우선순위 순으로 들어가고, 각 규칙은 요청의 URI·헤더·본문·쿼리스트링을 검사해 허용·차단·카운트를 결정합니다. AWS 관리형 규칙 그룹(공통 취약점, SQL 인젝션, 알려진 악성 IP, 봇 제어)을 얹으면 직접 규칙을 짜지 않고도 즉시 방어가 붙습니다.\n\n속도 기반 규칙은 5분 창에서 소스 IP별 요청 수를 세어 임계값을 넘으면 차단합니다. 무차별 로그인이나 스크래핑 방어의 표준 답입니다.',
    how_en: 'WAF creates a web ACL attached to a CloudFront distribution, ALB, API Gateway, or AppSync. The ACL holds prioritised rules that inspect URI, headers, body, and query string to allow, block, or count. Adding AWS managed rule groups — common vulnerabilities, SQL injection, known bad IPs, bot control — gives immediate protection with no hand-written rules.\n\nRate-based rules count requests per source IP in a five-minute window and block above a threshold, the standard answer for brute-force logins and scraping.',
    why_ko: '시험 신호는 애플리케이션 계층 공격 이름입니다 — SQL 인젝션, XSS, 봇, 스크래핑, 국가 차단, 속도 제한. Shield(L3/L4 DDoS)와 역할이 다르다는 점을 구분하는 문항이 함께 나옵니다.',
    why_en: 'The signals are application-layer attack names: SQL injection, XSS, bots, scraping, country blocking, rate limiting. Paired questions test that its role differs from Shield (L3/L4 DDoS).',
    traps: [
      { ko: 'L3/L4 규모의 DDoS 방어를 WAF로 답하는 것 — 그 계층은 Shield의 영역입니다.',
        en: 'Answering an L3/L4 DDoS question with WAF — that layer belongs to Shield.' },
      { ko: 'WAF를 EC2에 직접 붙이려는 선택지 — 지원 대상은 CloudFront·ALB·API Gateway·AppSync입니다.',
        en: 'Attaching WAF directly to EC2 — supported targets are CloudFront, ALB, API Gateway, and AppSync.' }
    ]
  },

  acm: {
    how_ko: 'ACM은 도메인 소유를 DNS 또는 이메일로 검증한 뒤 공인 인증서를 무료로 발급하고, 만료 전에 자동 갱신합니다. DNS 검증을 쓰고 Route 53에 CNAME을 남겨 두면 갱신이 완전 무인으로 이뤄집니다.\n\n제약이 두 가지 있습니다. 첫째, ACM 인증서의 사설 키는 추출할 수 없으므로 EC2나 온프레미스 서버에 직접 설치할 수 없습니다 — 통합 지점(ALB, CloudFront, API Gateway)에서만 씁니다. 둘째, CloudFront에 붙일 인증서는 us-east-1에서 발급해야 합니다.',
    how_en: 'ACM validates domain ownership by DNS or email, issues public certificates free, and renews them before expiry. Using DNS validation with the CNAME left in Route 53 makes renewal completely hands-off.\n\nTwo constraints: the private key cannot be exported, so an ACM certificate cannot be installed on EC2 or an on-premises server — only on integration points (ALB, CloudFront, API Gateway). And a certificate for CloudFront must be issued in us-east-1.',
    why_ko: '시험은 "인증서 만료로 장애가 났다", "갱신을 자동화하라"에 ACM을 정답으로 둡니다. 함정은 us-east-1 리전 제약과 EC2 직접 설치 불가입니다.',
    why_en: 'The exam answers "an expired certificate caused an outage" and "automate renewal" with ACM. The traps are the us-east-1 requirement and the impossibility of installing on EC2.',
    traps: [
      { ko: 'EC2에서 TLS를 종료하는 구성에 ACM 인증서를 쓰려는 것 — 키를 내보낼 수 없습니다. ALB에서 종료하도록 바꾸는 것이 정답입니다.',
        en: 'Using an ACM certificate to terminate TLS on EC2 — the key cannot be exported. Terminating at the ALB is the answer.' }
    ]
  },

  secretsmanager: {
    how_ko: 'Secrets Manager는 시크릿을 KMS로 암호화해 저장하고, Lambda 회전 함수를 통해 주기적으로 값을 바꿉니다. RDS·Aurora·Redshift·DocumentDB는 회전 템플릿이 제공되어 클릭 몇 번으로 자동 교체가 붙습니다. 회전 시 새 값을 만들고 데이터베이스에 반영한 뒤 버전 라벨(AWSCURRENT, AWSPREVIOUS)을 옮기는 방식이라, 교체 순간에도 진행 중인 연결이 끊기지 않습니다.\n\n애플리케이션은 시크릿을 코드에 두지 않고 실행 시점에 API로 가져옵니다. IAM으로 접근을 통제하고 CloudTrail에 조회 기록이 남습니다.',
    how_en: 'Secrets Manager stores secrets encrypted with KMS and rotates them on a schedule through a Lambda rotation function. RDS, Aurora, Redshift, and DocumentDB ship rotation templates, so automatic rotation is a few clicks. Rotation creates the new value, applies it to the database, then moves version labels (AWSCURRENT, AWSPREVIOUS), so in-flight connections survive the switch.\n\nApplications fetch secrets by API at runtime instead of embedding them. IAM controls access and CloudTrail records each retrieval.',
    why_ko: '시험은 "비밀번호를 코드·환경 변수·설정 파일에서 제거하라", "90일마다 교체하라"에 Secrets Manager를 둡니다. Parameter Store와의 갈림길은 자동 회전 필요성과 비용입니다.',
    why_en: 'The exam answers "remove the password from code, environment variables, or config" and "rotate every 90 days" with Secrets Manager. The fork with Parameter Store is automatic rotation and cost.',
    traps: [
      { ko: '자동 회전이 필요한데 Parameter Store SecureString을 고르는 것 — 회전 기능이 없습니다.',
        en: 'Choosing Parameter Store SecureString when automatic rotation is required — it has none.' }
    ],
    compare: [
      { left: 'Secrets Manager', right: 'SSM Parameter Store',
        rule_ko: '자동 회전과 교차 계정 공유가 필요하면 Secrets Manager, 단순 설정값이고 비용을 아끼려면 Parameter Store입니다. Parameter Store 표준 파라미터는 무료입니다.',
        rule_en: 'Automatic rotation or cross-account sharing → Secrets Manager. Plain configuration values at lower cost → Parameter Store, whose standard parameters are free.' }
    ]
  },

  guardduty: {
    how_ko: 'GuardDuty는 CloudTrail 관리·데이터 이벤트, VPC 플로우 로그, Route 53 DNS 로그를 계정 밖에서 읽어 기계학습과 위협 인텔리전스로 분석합니다. 에이전트를 설치하지 않고 로그 수집을 켜지 않아도 동작하는 것이 특징이며, 켜는 순간부터 결과(finding)를 냅니다.\n\n결과는 EventBridge 이벤트로 나가므로 Lambda나 Step Functions로 자동 대응을 붙일 수 있습니다 — 손상된 인스턴스를 격리 보안 그룹으로 옮기거나, 유출된 키를 비활성화하는 식입니다.',
    how_en: 'GuardDuty reads CloudTrail management and data events, VPC flow logs, and Route 53 DNS logs from outside your account and analyses them with machine learning and threat intelligence. It needs no agents and no log collection setup, producing findings from the moment it is enabled.\n\nFindings emit as EventBridge events, so automated response can be attached via Lambda or Step Functions — moving a compromised instance into a quarantine security group, or disabling a leaked key.',
    why_ko: '시험은 보안 서비스 넷을 구분시킵니다 — 위협 탐지는 GuardDuty, S3 민감 데이터 식별은 Macie, 취약점 스캔은 Inspector, 구성 규정 준수는 Config. 이 매핑만 확실하면 대부분 풀립니다.',
    why_en: 'The exam separates four security services: threats → GuardDuty, sensitive data in S3 → Macie, vulnerability scanning → Inspector, configuration compliance → Config. That mapping answers most of them.',
    traps: [
      { ko: 'GuardDuty가 공격을 차단한다고 보는 것 — 탐지만 하며 차단은 별도 자동화가 필요합니다.',
        en: 'Believing GuardDuty blocks attacks — it only detects; blocking requires separate automation.' }
    ]
  },

  macie: {
    how_ko: 'Macie는 S3 버킷을 샘플링·스캔해 신용카드 번호, 주민등록번호류 식별자, 여권 번호, 자격 증명 같은 패턴을 찾아내고 민감도와 함께 보고합니다. 동시에 버킷의 공개 여부·암호화 여부·공유 상태를 인벤토리로 관리해 노출 위험을 알립니다.',
    how_en: 'Macie samples and scans S3 buckets for patterns such as credit-card numbers, national identifiers, passport numbers, and credentials, reporting them with a sensitivity score. It also inventories bucket public access, encryption, and sharing status to flag exposure risk.',
    why_ko: '시험 신호는 "S3에 PII가 있는지 확인", "개인정보가 저장된 버킷을 찾아라"입니다. 대상이 S3로 한정된다는 점이 다른 서비스와의 구분점입니다.',
    why_en: 'The signals are "identify PII in S3" and "find buckets holding personal data". Its restriction to S3 is what separates it from the others.',
    traps: [
      { ko: 'RDS나 EBS의 민감 데이터 탐지에 Macie를 고르는 것 — S3만 지원합니다.',
        en: 'Choosing Macie to find sensitive data in RDS or EBS — it supports S3 only.' }
    ]
  },

  inspector: {
    how_ko: 'Amazon Inspector는 EC2 인스턴스(SSM 에이전트 경유), ECR 컨테이너 이미지, Lambda 함수를 지속적으로 스캔해 알려진 소프트웨어 취약점(CVE)과 의도치 않은 네트워크 노출을 찾습니다. 스캔은 스케줄이 아니라 변화 감지 기반이라 새 패키지가 설치되거나 새 CVE가 공개되면 자동으로 재평가합니다.',
    how_en: 'Amazon Inspector continuously scans EC2 instances (through the SSM agent), ECR container images, and Lambda functions for known software CVEs and unintended network exposure. Scanning is change-driven rather than scheduled, so it re-evaluates when a package is installed or a new CVE is published.',
    why_ko: '시험은 "패치되지 않은 취약점을 찾아라", "컨테이너 이미지의 CVE를 확인하라"에 Inspector를 둡니다. Config와의 구분이 반복 출제됩니다 — 소프트웨어 취약점은 Inspector, 리소스 설정 규칙은 Config입니다.',
    why_en: 'The exam answers "find unpatched vulnerabilities" and "check CVEs in container images" with Inspector. The recurring distinction is against Config: software vulnerabilities are Inspector, resource configuration rules are Config.',
    traps: [
      { ko: '"S3 버킷이 암호화되어 있는가" 같은 구성 점검에 Inspector를 고르는 것 — AWS Config의 영역입니다.',
        en: 'Choosing Inspector for a configuration check like "is this bucket encrypted" — that is AWS Config.' }
    ]
  },

  shield: {
    how_ko: 'Shield Standard는 모든 AWS 고객에게 자동 적용되는 L3/L4 DDoS 방어로, SYN 플러드나 UDP 반사 공격 같은 흔한 볼륨 공격을 엣지에서 흡수합니다. 별도 설정도 요금도 없습니다.\n\nShield Advanced는 월 정액에 대응 팀(SRT) 지원, 공격 중 상세 진단, 그리고 공격으로 인해 발생한 확장 비용 환급(cost protection)을 추가합니다. WAF 요금이 포함되고 Route 53·CloudFront·ALB·NLB·Elastic IP에 적용됩니다.',
    how_en: 'Shield Standard is automatic L3/L4 DDoS protection for every AWS customer, absorbing common volumetric attacks such as SYN floods and UDP reflection at the edge, with no configuration and no charge.\n\nShield Advanced adds, for a monthly fee, Shield Response Team support, detailed diagnostics during an attack, and cost protection reimbursing scaling charges caused by an attack. It includes WAF fees and covers Route 53, CloudFront, ALB, NLB, and Elastic IPs.',
    why_ko: '시험은 Advanced가 필요한 조건을 명시로 판단하게 합니다 — "전문가 지원", "공격 비용 환급", "24시간 대응"이 나오면 Advanced이고, 그냥 "DDoS 방어"면 Standard가 이미 적용 중이라 추가 조치가 불필요합니다.',
    why_en: 'The exam decides Advanced by explicit wording: "expert support", "reimbursement for attack costs", or "24/7 response". Plain "DDoS protection" is already covered by Standard, so no action is needed.',
    traps: [
      { ko: '기본 DDoS 방어를 위해 Shield Advanced를 구매하는 선택지 — Standard가 무료로 이미 적용됩니다.',
        en: 'Buying Shield Advanced for basic DDoS protection — Standard already applies for free.' }
    ]
  },

  cognito: {
    how_ko: 'Cognito는 두 부분입니다. 사용자 풀은 회원 디렉터리로 가입·로그인·MFA·비밀번호 정책을 처리하고 성공 시 JWT(ID·액세스·리프레시 토큰)를 발급합니다. 자격 증명 풀은 그 토큰이나 소셜 IdP 토큰을 받아 STS로 임시 AWS 자격 증명으로 교환해, 모바일 앱이 자기 몫의 S3 접두사에만 접근하는 식의 세분화된 권한을 가능하게 합니다.\n\n사용자 풀은 API Gateway 권한 부여자로 직접 연결할 수 있어, 토큰 검증 코드를 짜지 않고도 API를 보호할 수 있습니다.',
    how_en: 'Cognito has two halves. A user pool is the member directory handling sign-up, sign-in, MFA, and password policy, issuing JWTs (ID, access, refresh) on success. An identity pool exchanges those tokens — or social IdP tokens — for temporary AWS credentials via STS, enabling fine-grained access such as a mobile app reaching only its own S3 prefix.\n\nA user pool can attach directly as an API Gateway authorizer, protecting an API with no token-validation code of your own.',
    why_ko: '시험은 IAM과 Cognito의 경계를 묻습니다. AWS 리소스를 쓰는 직원·서비스는 IAM, 애플리케이션의 최종 사용자는 Cognito입니다. "수백만 모바일 사용자 로그인", "구글 계정으로 로그인"이 Cognito 신호입니다.',
    why_en: 'The exam probes the IAM/Cognito boundary: employees and services using AWS resources are IAM; end users of your application are Cognito. "Millions of mobile users signing in" or "sign in with Google" signals Cognito.',
    traps: [
      { ko: '앱 사용자마다 IAM 사용자를 만드는 선택지 — 확장되지 않으며 IAM 사용자 수 제한에 걸립니다.',
        en: 'Creating an IAM user per application user — it does not scale and hits IAM user limits.' }
    ]
  },

  organizations: {
    how_ko: 'Organizations는 관리 계정 아래 멤버 계정을 OU 트리로 묶습니다. SCP를 OU나 계정에 붙이면 그 하위에서 사용 가능한 API의 최대 범위가 정해지는데, SCP는 권한을 주지 않고 상한만 정합니다 — 관리 계정 자신에게는 적용되지 않는다는 점도 시험에 나옵니다.\n\n통합 결제는 조직 전체 사용량을 합산해 볼륨 할인 구간에 빨리 도달하게 하고, RI·Savings Plans 혜택을 계정 간에 공유합니다. 그리고 aws:PrincipalOrgID 조건 키로 "우리 조직 구성원만"이라는 정책을 계정 목록 관리 없이 표현할 수 있습니다.',
    how_en: 'Organizations groups member accounts into an OU tree under a management account. Attaching an SCP to an OU or account caps which APIs are usable beneath it — SCPs grant nothing, only limit, and notably do not apply to the management account itself.\n\nConsolidated billing aggregates usage to reach volume-discount tiers sooner and shares RI and Savings Plans benefits across accounts. And the aws:PrincipalOrgID condition key expresses "only members of our organization" without maintaining an account list.',
    why_ko: '시험 신호는 다중 계정 거버넌스입니다 — 부서별 계정 분리, 특정 리전 사용 금지, 조직 내부만 S3 접근 허용, 계정 전체 CloudTrail 강제. SCP가 상한이라는 성질을 이해하는지가 반복해서 나옵니다.',
    why_en: 'The signals are multi-account governance: separate accounts per department, forbidding certain Regions, admitting only organization members to a bucket, enforcing CloudTrail account-wide. Understanding that an SCP is a ceiling recurs throughout.',
    traps: [
      { ko: 'S3 버킷 정책에 계정 ID를 하나씩 나열하는 선택지 — 계정이 늘 때마다 수정해야 합니다. aws:PrincipalOrgID가 정답입니다.',
        en: 'Listing account IDs one by one in a bucket policy — it needs editing whenever an account is added. aws:PrincipalOrgID is the answer.' },
      { ko: 'SCP로 권한을 부여하려는 선택지 — 실제 부여는 여전히 IAM 정책이 해야 합니다.',
        en: 'Trying to grant permissions with an SCP — IAM policies must still do the granting.' }
    ]
  },

  /* ====================================================================== */
  apigw: {
    how_ko: 'API Gateway는 클라이언트와 백엔드 사이에 서는 관리형 프록시입니다. 요청이 오면 권한 부여자로 인증하고, 사용 계획으로 속도를 제한하고, 스테이지 캐시를 확인한 뒤 백엔드(Lambda, HTTP 엔드포인트, AWS 서비스 직접 통합)로 넘깁니다. 이 파이프라인 덕에 인증·스로틀링·캐싱·로깅을 애플리케이션 코드 밖으로 뺄 수 있습니다.\n\nREST API와 HTTP API는 다른 제품입니다. REST API는 기능이 풍부하지만(사용 계획, API 키, 요청 검증, WAF 연동) 비싸고, HTTP API는 기능을 덜어내 지연시간과 비용을 크게 낮춥니다. 단순 Lambda 프록시라면 HTTP API가 비용 정답이 됩니다.',
    how_en: 'API Gateway is a managed proxy between clients and backends. A request is authenticated by an authorizer, rate-limited by a usage plan, checked against the stage cache, then forwarded to the backend (Lambda, an HTTP endpoint, or a direct AWS service integration). That pipeline moves authentication, throttling, caching, and logging out of application code.\n\nREST APIs and HTTP APIs are different products. REST is feature-rich (usage plans, API keys, request validation, WAF) but pricier; HTTP APIs strip features to cut latency and cost sharply. For a plain Lambda proxy, HTTP API is the cost answer.',
    why_ko: '시험은 API Gateway를 서버리스 3종 세트(API Gateway + Lambda + DynamoDB)의 입구로 씁니다. 별도로 묻는 것은 인증 방식(Cognito·Lambda 권한 부여자·IAM), 특정 클라이언트의 과다 호출 제어(사용 계획), 백엔드 부하 경감(스테이지 캐시)입니다.',
    why_en: 'The exam uses API Gateway as the entrance to the serverless trio (API Gateway, Lambda, DynamoDB). The separate asks are the authentication mechanism (Cognito, Lambda authorizer, IAM), throttling one noisy client (usage plans), and offloading the backend (stage caching).',
    traps: [
      { ko: 'EC2에 API 서버를 직접 세워 인증·스로틀링을 구현하는 선택지 — 운영 부담이 크므로 관리형 조건에서 오답입니다.',
        en: 'Standing up an API server on EC2 to implement auth and throttling — the overhead loses managed-service questions.' },
      { ko: '앱 사용자 로그인에 IAM 인증을 고르는 것 — 최종 사용자는 Cognito 권한 부여자가 정답입니다.',
        en: 'Choosing IAM authentication for application user login — end users need a Cognito authorizer.' }
    ]
  },

  sqs: {
    how_ko: 'SQS는 메시지를 여러 서버에 중복 저장해 두고, 소비자가 폴링으로 가져가는 큐입니다. 메시지를 받아 가면 즉시 지워지지 않고 가시성 제한 시간 동안 다른 소비자에게 숨겨집니다. 소비자가 처리를 끝내고 명시적으로 삭제해야 사라지고, 실패하거나 죽으면 제한 시간이 지나 다시 보이게 되어 다른 소비자가 집어갑니다. 이 "빌려주고 확인받는" 구조가 작업 유실을 막는 원리입니다.\n\nStandard 큐는 이 구조를 분산 저장 위에 올려 거의 무제한 처리량을 내지만, 그 대가로 순서를 보장하지 않고 드물게 중복 전달이 일어납니다. FIFO 큐는 메시지 그룹 단위로 순서와 정확히 한 번 처리를 보장하지만 처리량 상한이 낮습니다.',
    how_en: 'SQS stores each message redundantly across servers and consumers poll for it. Receiving a message does not delete it; it hides it from other consumers for the visibility timeout. It disappears only when the consumer explicitly deletes it after finishing, and a failure or crash lets the timeout expire so another consumer picks it up. This lease-and-acknowledge structure is what prevents lost work.\n\nStandard queues put that on distributed storage for near-unlimited throughput, at the cost of no ordering guarantee and occasional duplicate delivery. FIFO queues guarantee ordering and exactly-once processing per message group, with a lower throughput ceiling.',
    why_ko: 'SQS는 디커플링 문제의 중심입니다. "한 구성 요소가 죽으면 전체가 멈춘다", "트래픽 급증에 뒷단이 무너진다", "작업이 유실되면 안 된다"는 모두 큐를 삽입하는 것이 정답입니다. 두 번째 출제 각도는 큐 깊이로 ASG를 조정하는 것이고, 세 번째는 Standard와 FIFO 중 어느 쪽인지입니다.',
    why_en: 'SQS sits at the centre of decoupling questions. "A failure in one component stops everything", "spikes overwhelm the backend", and "work must not be lost" all answer with inserting a queue. The second angle is scaling an ASG on queue depth; the third is Standard versus FIFO.',
    traps: [
      { ko: '가시성 제한 시간을 처리 시간보다 짧게 두는 구성 — 같은 메시지가 중복 처리됩니다.',
        en: 'Setting the visibility timeout shorter than processing time — the same message gets processed twice.' },
      { ko: '순서가 중요한 주문 처리에 Standard 큐를 고르는 것 — FIFO가 정답입니다.',
        en: 'Choosing a Standard queue for order processing where sequence matters — FIFO is the answer.' },
      { ko: '실패 메시지 격리 없이 무한 재시도하는 구성 — 독성 메시지가 큐를 막습니다. 데드레터 큐가 필요합니다.',
        en: 'Retrying forever with no isolation for failures — a poison message blocks the queue. A dead-letter queue is needed.' }
    ],
    compare: [
      { left: 'SQS', right: 'SNS',
        rule_ko: '메시지 한 건을 한 소비자가 처리하면 SQS(큐), 여러 구독자가 각자 받아야 하면 SNS(브로드캐스트)입니다. 둘을 겹쳐 SNS 토픽에 여러 SQS 큐를 구독시키는 팬아웃이 시험의 대표 정답 구조입니다.',
        rule_en: 'One message handled by one consumer → SQS (queue). Every subscriber receiving it → SNS (broadcast). Layering them — several SQS queues subscribed to one SNS topic — is the signature exam answer.' }
    ]
  },

  eventbridge: {
    how_ko: 'EventBridge는 이벤트 버스입니다. AWS 서비스, 여러분의 애플리케이션, SaaS 파트너가 JSON 이벤트를 버스에 올리면, 규칙이 이벤트 패턴(어떤 소스·타입·필드 값인가)을 매칭해 대상으로 보냅니다. 하나의 이벤트가 여러 규칙에 매칭될 수 있고 규칙마다 대상이 여러 개일 수 있어, 내용 기반 라우팅과 팬아웃을 동시에 합니다.\n\n스케줄 규칙은 cron 또는 rate 표현식으로 시각을 지정합니다. 이것이 "EC2에 cron을 띄우는" 구성을 대체하는 표준 정답이며, 서버 없이 정기 작업을 돌리는 방법입니다.',
    how_en: 'EventBridge is an event bus. AWS services, your applications, and SaaS partners put JSON events on it, and rules match an event pattern (which source, type, or field values) to route them to targets. One event can match several rules and each rule can have several targets, giving content-based routing and fan-out at once.\n\nSchedule rules take cron or rate expressions. That is the standard replacement for running cron on an EC2 box, and the way to run periodic work with no server.',
    why_ko: '시험 신호는 두 가지입니다 — "매일/매시간 정기 실행"(스케줄 규칙 + Lambda)과 "AWS 리소스 상태 변화에 자동 대응"(EC2 상태 변경, Spot 중단 경고, GuardDuty 결과). SNS와의 구분은 이벤트 내용으로 필터링·변환이 필요한지입니다.',
    why_en: 'Two signals: "run daily or hourly" (schedule rule plus Lambda) and "react automatically to AWS resource state changes" (EC2 state, Spot interruption, GuardDuty findings). The SNS distinction is whether you need filtering or transformation on event content.',
    traps: [
      { ko: '정기 작업을 위해 EC2에 cron을 설치하는 선택지 — 운영 부담과 단일 장애점 때문에 오답입니다.',
        en: 'Installing cron on EC2 for periodic work — wrong on overhead and single point of failure.' },
      { ko: '단순 알림 팬아웃에 EventBridge를 고집하는 것 — SNS가 더 단순하고 저렴한 경우가 있습니다.',
        en: 'Insisting on EventBridge for plain notification fan-out — SNS can be simpler and cheaper.' }
    ]
  },

  sns: {
    how_ko: 'SNS는 발행-구독 모델입니다. 발행자가 토픽에 메시지를 올리면 모든 구독자에게 밀어 보냅니다(푸시). 구독자는 SQS 큐, Lambda, HTTP/S 엔드포인트, 이메일, SMS, 모바일 푸시가 될 수 있습니다. 구독별 필터 정책을 걸면 관심 있는 메시지만 받게 해 불필요한 호출을 줄입니다.\n\n푸시 모델이라 구독자가 느리면 재시도가 일어나고, 최종적으로 실패하면 유실될 수 있습니다. 그래서 신뢰성이 필요하면 SNS 토픽에 SQS 큐를 구독시켜 큐가 버퍼 역할을 하게 합니다 — 이것이 팬아웃 패턴이 SNS 단독보다 자주 정답인 이유입니다.',
    how_en: 'SNS is publish-subscribe: a publisher posts to a topic and SNS pushes to every subscriber. Subscribers can be SQS queues, Lambda, HTTP/S endpoints, email, SMS, or mobile push. Per-subscription filter policies deliver only relevant messages, cutting wasted invocations.\n\nBecause it pushes, a slow subscriber triggers retries and an ultimate failure can lose the message. So when reliability matters, subscribe SQS queues to the topic and let them buffer — the reason the fan-out pattern beats bare SNS in most correct answers.',
    why_ko: '시험 신호는 "하나의 이벤트를 여러 시스템이 각자 처리해야 한다"입니다. 여기에 "유실되면 안 된다"가 붙으면 SNS + SQS 팬아웃이 정답이 됩니다.',
    why_en: 'The signal is "several systems must each handle the same event". Add "must not be lost" and the answer becomes SNS with SQS fan-out.',
    traps: [
      { ko: '고객에게 보내는 대량 서식 메일에 SNS를 고르는 것 — SES가 정답입니다. SNS 이메일은 운영 알림용입니다.',
        en: 'Choosing SNS for bulk formatted customer email — SES is the answer; SNS email is for operational alerts.' }
    ]
  },

  stepfunctions: {
    how_ko: 'Step Functions는 워크플로를 상태 기계로 정의합니다. Task(작업 실행), Choice(분기), Parallel(병렬), Map(반복), Wait(대기), Retry·Catch(오류 처리)를 JSON으로 선언하면, 서비스가 각 단계의 입출력과 실행 이력을 관리합니다. 즉 오류 처리와 재시도 로직이 코드에서 사라져 선언으로 바뀝니다.\n\nStandard 워크플로는 최대 1년까지 실행되며 정확히 한 번 실행을 보장하고 전체 이력을 남깁니다. Express 워크플로는 5분 이내의 고빈도 흐름용으로 훨씬 저렴하지만 이력이 CloudWatch Logs로만 남습니다.',
    how_en: 'Step Functions defines a workflow as a state machine. Declaring Task, Choice, Parallel, Map, Wait, plus Retry and Catch in JSON hands input/output plumbing and execution history to the service, so error handling and retry logic leave your code and become declarations.\n\nStandard workflows run up to a year, guarantee exactly-once execution, and keep full history. Express workflows target high-volume flows under five minutes at far lower cost, with history only in CloudWatch Logs.',
    why_ko: '시험 신호는 "여러 단계", "단계별 오류 처리와 재시도", "사람의 승인 대기", "Lambda 15분 초과를 단계로 쪼개기"입니다. Lambda가 다른 Lambda를 직접 호출하는 선택지보다 관측성과 신뢰성이 높아 정답이 됩니다.',
    why_en: 'The signals are multiple steps, per-step error handling and retries, waiting for human approval, and splitting work that exceeds Lambda\'s 15 minutes. It beats options where Lambdas invoke each other on observability and reliability.',
    traps: [
      { ko: '단일 단계 작업에 Step Functions를 도입하는 것 — 불필요한 복잡도와 비용입니다.',
        en: 'Introducing Step Functions for single-step work — unnecessary complexity and cost.' }
    ]
  },

  ses: {
    how_ko: 'SES는 SMTP 인터페이스와 API로 이메일을 보내고 받는 서비스입니다. 발신 도메인을 DKIM·SPF로 검증해 스팸 처리를 줄이고, 바운스·불만 알림을 SNS로 받아 목록을 관리하게 합니다. 새 계정은 샌드박스에서 시작해 검증된 주소로만 보낼 수 있고, 프로덕션 접근을 별도로 요청해야 합니다.',
    how_en: 'SES sends and receives email through an SMTP interface and an API. Verifying the sending domain with DKIM and SPF reduces spam filtering, and bounce and complaint notifications arrive via SNS for list hygiene. New accounts start in a sandbox that only sends to verified addresses until production access is granted.',
    why_ko: '시험에서 SES와 SNS를 가르는 기준은 수신자와 형식입니다. 운영자 몇 명에게 "장애가 났다"를 알리면 SNS이고, 고객 수만 명에게 주문 확인서·뉴스레터처럼 서식 있는 메일을 보내면 SES입니다. SES 문항은 대체로 "EC2에 메일 서버를 직접 세운다"는 선택지를 함께 제시해 운영 부담과 발신 평판 관리를 판단하게 합니다.',
    why_en: 'SES and SNS are separated by recipient and format. Telling a handful of operators "something broke" is SNS; sending tens of thousands of customers formatted order confirmations or newsletters is SES. SES questions usually pair with a "run our own mail server on EC2" option to test judgement on operational overhead and sender reputation.',
    traps: [
      { ko: 'EC2에 자체 메일 서버를 세우는 선택지 — 25번 포트 제한과 평판 관리 부담 때문에 오답입니다.',
        en: 'Running your own mail server on EC2 — port 25 restrictions and reputation management make it wrong.' }
    ]
  },

  mq: {
    how_ko: 'Amazon MQ는 ActiveMQ 또는 RabbitMQ 브로커를 관리형으로 띄웁니다. 핵심 가치는 표준 프로토콜(JMS, AMQP, MQTT, STOMP, OpenWire)을 그대로 말한다는 점이라, 기존 애플리케이션이 코드 변경 없이 붙을 수 있습니다. 대신 브로커 인스턴스 단위로 프로비저닝되므로 SQS처럼 무한히 확장되지는 않습니다.',
    how_en: 'Amazon MQ runs a managed ActiveMQ or RabbitMQ broker. Its value is speaking standard protocols — JMS, AMQP, MQTT, STOMP, OpenWire — so existing applications connect without code changes. In exchange it is provisioned per broker instance and does not scale limitlessly like SQS.',
    why_ko: '시험에서 MQ는 조건부입니다 — "기존 애플리케이션을 코드 변경 없이 옮겨라"와 프로토콜 이름이 함께 나올 때만 정답이고, 그 외에는 SQS/SNS가 이깁니다.',
    why_en: 'MQ is conditional: correct only when "migrate the existing application without code changes" appears together with a protocol name. Otherwise SQS and SNS win.',
    traps: [
      { ko: '새로 만드는 시스템의 메시징에 MQ를 고르는 것 — SQS가 더 확장성 있고 저렴합니다.',
        en: 'Choosing MQ for messaging in a greenfield system — SQS scales better and costs less.' }
    ]
  },

  /* ====================================================================== */
  kinesis: {
    how_ko: 'Kinesis Data Streams는 데이터를 샤드로 쪼개 저장합니다. 레코드의 파티션 키를 해시해 샤드를 정하므로, 같은 키의 레코드는 같은 샤드에 순서대로 쌓입니다. 소비자는 샤드별로 순서대로 읽으며, 데이터는 기본 24시간(최대 365일) 보관되어 여러 소비자가 각자 속도로 재생할 수 있습니다. 처리량은 샤드 수에 비례해 늘어납니다.\n\nData Firehose는 소비자를 직접 만들지 않아도 되는 완전 관리형 적재 파이프라인입니다. 버퍼가 크기나 시간 조건을 만족하면 S3·Redshift·OpenSearch·Splunk로 자동 전송하고, 변환이 필요하면 Lambda를 끼울 수 있습니다. 대신 버퍼링 때문에 최소 지연이 수십 초 이상입니다.',
    how_en: 'Kinesis Data Streams shards the data. A record\'s partition key is hashed to pick a shard, so records sharing a key accumulate in order on one shard. Consumers read each shard in order, and data is retained 24 hours by default (up to 365 days) so several consumers can replay at their own pace. Throughput scales with shard count.\n\nData Firehose is a fully managed delivery pipeline needing no consumer of your own. When its buffer hits a size or time threshold it delivers to S3, Redshift, OpenSearch, or Splunk, optionally transforming through Lambda. The buffering means a minimum latency of tens of seconds.',
    why_ko: '시험은 Streams와 Firehose의 구분을 반복해서 묻습니다. "실시간으로 처리해 즉시 반응"은 Streams, "그냥 S3에 모아 두면 된다"는 Firehose입니다. 두 번째 축은 샤드 수와 파티션 키 설계 — 처리량이 부족하거나 특정 샤드가 뜨거워지는 문제입니다.',
    why_en: 'The exam repeatedly asks Streams versus Firehose: "process in real time and react immediately" → Streams; "just land it in S3" → Firehose. The second axis is shard count and partition-key design — insufficient throughput or a hot shard.',
    traps: [
      { ko: '초당 수만 건에 단일 샤드를 고르는 것 — 샤드당 쓰기 한도(1MB/s, 1000 레코드/s)를 초과합니다.',
        en: 'Choosing a single shard for tens of thousands of records per second — it exceeds the per-shard write limit (1 MB/s, 1000 records/s).' },
      { ko: '초 단위 실시간 반응이 필요한데 Firehose를 고르는 것 — 버퍼링 지연 때문에 요구를 못 맞춥니다.',
        en: 'Choosing Firehose when sub-second reaction is required — buffering latency cannot meet it.' },
      { ko: 'SQS로 대체할 수 있는지 검토하지 않는 것 — 순서 재생과 다중 소비자가 필요 없다면 SQS가 더 단순합니다.',
        en: 'Not checking whether SQS suffices — without replay and multiple consumers, SQS is simpler.' }
    ]
  },

  athena: {
    how_ko: 'Athena는 Presto 기반 서버리스 질의 엔진입니다. 데이터를 옮기거나 적재하지 않고 S3의 파일을 그 자리에서 읽으며, Glue 데이터 카탈로그의 테이블 정의로 스키마를 얻습니다. 과금은 질의가 스캔한 바이트 수이므로, 비용 최적화는 곧 스캔량 줄이기입니다 — 열 기반 형식(Parquet·ORC)으로 바꾸면 필요한 열만 읽고, 날짜 등으로 파티셔닝하면 필요한 파티션만 읽습니다. 압축까지 하면 스캔량이 한 자릿수 퍼센트로 줄기도 합니다.',
    how_en: 'Athena is a serverless Presto-based query engine. It reads files in S3 in place, without loading or moving them, taking schema from Glue Data Catalog table definitions. Billing is per byte scanned, so cost optimisation is scan reduction: columnar formats (Parquet, ORC) read only needed columns, and partitioning by date reads only needed partitions. Adding compression can cut scanned bytes to single-digit percentages.',
    why_ko: '시험 신호는 "가끔", "즉석", "인프라 변경 최소화", "S3의 로그를 SQL로"입니다. Redshift와의 갈림길은 워크로드의 지속성 — 상시 대규모 BI는 Redshift, 간헐적 조회는 Athena입니다. 비용 문제에서는 Parquet 변환과 파티셔닝이 정답입니다.',
    why_en: 'The signals are occasional, ad-hoc, minimal architectural change, and SQL over logs in S3. The Redshift fork is workload persistence: sustained large-scale BI → Redshift; intermittent queries → Athena. Cost questions answer with Parquet conversion and partitioning.',
    traps: [
      { ko: '비용 절감을 위해 인스턴스 크기를 줄이는 선택지 — Athena에는 인스턴스가 없습니다. 스캔량을 줄여야 합니다.',
        en: 'Reducing instance size to save cost — Athena has no instances; reduce scanned bytes.' },
      { ko: '초당 수천 건의 짧은 조회에 Athena를 쓰는 것 — 질의당 오버헤드가 있어 OLTP에는 부적합합니다.',
        en: 'Using Athena for thousands of short lookups per second — per-query overhead makes it unfit for OLTP.' }
    ]
  },

  glue: {
    how_ko: 'Glue는 세 부분입니다. 크롤러는 S3·JDBC 소스를 훑어 스키마를 추론하고 데이터 카탈로그에 테이블로 등록합니다. 카탈로그는 Athena·Redshift Spectrum·EMR이 공유하는 메타데이터 저장소입니다. ETL 작업은 서버리스 Spark에서 변환 스크립트를 실행하며 워커 수만 지정하면 클러스터 관리가 없습니다.\n\n크롤러가 만든 테이블 덕분에 Athena가 즉시 질의할 수 있다는 연결이 시험에서 자주 쓰입니다 — "스키마를 자동 발견해 SQL로 조회"가 그 신호입니다.',
    how_en: 'Glue has three parts. Crawlers scan S3 and JDBC sources, infer schema, and register tables in the Data Catalog. The Catalog is shared metadata for Athena, Redshift Spectrum, and EMR. ETL jobs run transformation scripts on serverless Spark, where you set worker count and manage no cluster.\n\nThe link the exam leans on is that crawler-created tables let Athena query immediately — signalled by "automatically discover the schema and query with SQL".',
    why_ko: '시험은 Glue를 "클러스터 없는 ETL"과 "카탈로그"로 나눠 묻습니다. EMR과의 갈림길은 Spark·Hadoop을 세밀히 통제할 필요가 있는지이며, 운영 부담 최소화 조건이면 Glue입니다.',
    why_en: 'The exam splits Glue into cluster-free ETL and the catalog. The EMR fork is whether you need fine control of Spark or Hadoop; under minimise-overhead, Glue wins.',
    traps: [
      { ko: '스키마 발견을 위해 Lambda로 직접 파싱 스크립트를 짜는 선택지 — 크롤러가 이미 하는 일입니다.',
        en: 'Writing a parsing script in Lambda to discover schema — a crawler already does that.' }
    ]
  },

  redshift: {
    how_ko: 'Redshift는 리더 노드와 컴퓨팅 노드로 이루어진 MPP 데이터 웨어하우스입니다. 데이터를 열 단위로 저장·압축하고 노드 간에 분산해, 수십억 행 집계와 조인을 병렬로 처리합니다. 분산 키와 정렬 키를 어떻게 정하느냐가 성능을 좌우하며, 조인 키로 분산하면 노드 간 데이터 이동이 줄어듭니다.\n\nRedshift Spectrum은 S3의 데이터를 클러스터에 적재하지 않고 직접 질의합니다. 자주 쓰는 최근 데이터는 클러스터에, 과거 데이터는 S3에 두고 함께 조회하는 구성이 저장 비용을 크게 낮춥니다.',
    how_en: 'Redshift is an MPP data warehouse of a leader node and compute nodes. It stores and compresses data by column and distributes it across nodes to run billion-row aggregations and joins in parallel. Distribution and sort key choices dominate performance; distributing on the join key reduces inter-node data movement.\n\nRedshift Spectrum queries S3 data without loading it into the cluster. Keeping recent hot data in the cluster and history in S3, queried together, sharply cuts storage cost.',
    why_ko: '시험 신호는 "BI 대시보드", "복잡한 조인과 집계", "페타바이트급 과거 데이터 분석"입니다. 반대로 짧은 트랜잭션이 많으면 오답이며 RDS/DynamoDB입니다. Athena와의 갈림길은 상시성입니다.',
    why_en: 'The signals are BI dashboards, complex joins and aggregations, and petabyte-scale historical analysis. High-rate short transactions make it wrong (RDS or DynamoDB instead). The Athena fork is whether the workload is continuous.',
    traps: [
      { ko: '웹 애플리케이션의 주 데이터베이스로 Redshift를 고르는 것 — OLTP에 부적합합니다.',
        en: 'Choosing Redshift as a web application\'s primary database — unfit for OLTP.' }
    ]
  },

  emr: {
    how_ko: 'EMR은 Spark·Hadoop·Hive·Presto·HBase 클러스터를 프로비저닝하고 관리합니다. 노드는 세 종류입니다 — 마스터(조정), 코어(HDFS 데이터 보유 + 계산), 태스크(계산만). 태스크 노드는 데이터를 갖지 않으므로 Spot으로 띄워도 안전하고, 코어 노드는 On-Demand로 두는 것이 표준 비용 패턴입니다.\n\nEMRFS로 S3를 스토리지로 쓰면 데이터가 클러스터 수명과 분리됩니다. 그러면 작업이 끝난 뒤 클러스터를 종료해도 데이터가 남아, 일시적(transient) 클러스터로 유휴 비용을 없앨 수 있습니다.',
    how_en: 'EMR provisions and manages Spark, Hadoop, Hive, Presto, and HBase clusters. Nodes come in three kinds: master (coordination), core (holds HDFS data and computes), and task (computes only). Task nodes hold no data, so running them on Spot is safe while keeping core nodes On-Demand — the standard cost pattern.\n\nUsing S3 through EMRFS decouples data from cluster lifetime, so the cluster can be terminated after the job and the data survives — a transient cluster with no idle cost.',
    why_ko: '시험 신호는 기존 빅데이터 도구 이름(Spark, Hadoop, Hive, HBase)과 세밀한 튜닝 요구입니다. 비용 문제에서는 태스크 노드 Spot + 일시적 클러스터가 정답 조합입니다.',
    why_en: 'The signals are named big-data tools (Spark, Hadoop, Hive, HBase) and a need for fine tuning. In cost questions the answer pairs Spot task nodes with a transient cluster.',
    traps: [
      { ko: '코어 노드를 Spot으로 구성하는 선택지 — HDFS 데이터가 소실될 수 있습니다.',
        en: 'Running core nodes on Spot — HDFS data can be lost.' }
    ]
  },

  quicksight: {
    how_ko: 'QuickSight는 S3·Athena·Redshift·RDS 등에 연결해 대시보드를 만드는 서버리스 BI 도구입니다. SPICE라는 인메모리 엔진에 데이터를 적재하면 원본에 부하를 주지 않고 빠르게 조회할 수 있고, 직접 질의 모드로 최신 데이터를 볼 수도 있습니다. 사용자·그룹 단위 권한과 행 수준 보안을 지원합니다.',
    how_en: 'QuickSight is serverless BI connecting to S3, Athena, Redshift, RDS, and more to build dashboards. Loading data into its in-memory SPICE engine gives fast queries without loading the source, while direct query mode shows live data. It supports user and group permissions plus row-level security.',
    why_ko: '시험 신호는 "시각화", "대시보드", "비즈니스 사용자가 직접 탐색"입니다. 데이터 처리 자체는 Athena·Redshift가 하고 QuickSight는 표현 계층이라는 역할 분담을 이해하면 됩니다.',
    why_en: 'The signals are visualisation, dashboards, and business users exploring for themselves. The division of labour is that Athena or Redshift processes while QuickSight presents.',
    traps: [
      { ko: 'EC2에 BI 도구를 설치하는 선택지 — 관리형 조건에서 오답입니다.',
        en: 'Installing a BI tool on EC2 — wrong under managed-service requirements.' }
    ]
  },

  opensearch: {
    how_ko: 'OpenSearch Service는 문서를 역인덱스로 색인해 전문 검색과 집계를 빠르게 수행합니다. 로그를 넣으면 필드별 검색·필터·시각화(OpenSearch Dashboards)가 즉시 가능해집니다. 클러스터가 상시 돌아가므로 비용은 인스턴스 시간 기준이고, 색인 크기와 샤드 설계가 성능을 좌우합니다.\n\n적재는 Kinesis Data Firehose를 대상으로 지정하는 것이 가장 단순한 경로입니다.',
    how_en: 'OpenSearch Service indexes documents into an inverted index for fast full-text search and aggregation. Feeding logs in makes per-field search, filtering, and visualisation (OpenSearch Dashboards) immediately available. The cluster runs continuously, so cost is instance-hours, and index size and shard design drive performance.\n\nThe simplest ingestion path is pointing Kinesis Data Firehose at it as a delivery target.',
    why_ko: '시험 신호는 "로그를 검색 가능하게", "전문 검색", "실시간 로그 분석 대시보드"입니다. Athena와의 갈림길은 상시 색인이 필요한지 — 가끔 SQL로 조회하면 Athena가 훨씬 저렴합니다.',
    why_en: 'The signals are making logs searchable, full-text search, and real-time log dashboards. The Athena fork is whether continuous indexing is needed — occasional SQL is far cheaper on Athena.',
    traps: [
      { ko: '가끔 조회하는 로그 분석에 OpenSearch 클러스터를 세우는 것 — 유휴 비용 때문에 Athena가 정답입니다.',
        en: 'Standing up an OpenSearch cluster for occasionally queried logs — idle cost makes Athena the answer.' }
    ]
  },

  /* ====================================================================== */
  cloudwatch: {
    how_ko: 'CloudWatch는 지표(숫자 시계열), 로그(텍스트 스트림), 알람(지표 임계값 감시), 이벤트(EventBridge로 이관)를 다룹니다. AWS 서비스는 기본 지표를 자동으로 보내지만, 하이퍼바이저 밖에서 볼 수 없는 값(메모리 사용률, 디스크 여유 공간, 프로세스 상태)은 인스턴스 안의 CloudWatch 에이전트가 사용자 지정 지표로 올려야 합니다. 이 경계가 시험의 단골 함정입니다.\n\n알람은 임계값을 넘으면 SNS 알림, Auto Scaling 정책 실행, EC2 작업(재부팅·종료·복구)을 트리거할 수 있습니다. 로그 그룹의 기본 보존 기간은 무기한이라, 비용 문제에서는 보존 정책 설정과 S3 내보내기가 정답이 됩니다.',
    how_en: 'CloudWatch handles metrics (numeric time series), logs (text streams), alarms (thresholds on metrics), and events (now EventBridge). AWS services publish base metrics automatically, but anything invisible from outside the hypervisor — memory utilisation, free disk space, process state — must be pushed as a custom metric by the CloudWatch agent inside the instance. That boundary is a recurring trap.\n\nAlarms can notify SNS, execute an Auto Scaling policy, or take EC2 actions (reboot, terminate, recover). Log group retention defaults to never expire, so cost questions answer with setting retention and exporting to S3.',
    why_ko: '시험은 CloudWatch를 두 방향으로 씁니다 — 무엇을 관측할 수 있는가(에이전트 필요 여부)와 관측 결과로 무엇을 자동화하는가(알람 → SNS·ASG·Lambda). CloudTrail과의 역할 구분(성능 vs 감사)도 반복 출제됩니다.',
    why_en: 'The exam uses CloudWatch two ways: what can be observed (does it need the agent?) and what the observation automates (alarm to SNS, ASG, or Lambda). The CloudTrail distinction — performance versus audit — also recurs.',
    traps: [
      { ko: '메모리 사용률 알람을 에이전트 없이 만들려는 선택지 — 기본 지표에 메모리는 없습니다.',
        en: 'Creating a memory-utilisation alarm without the agent — memory is not a default metric.' },
      { ko: '"누가 이 리소스를 삭제했는가"를 CloudWatch로 답하는 것 — API 호출 기록은 CloudTrail입니다.',
        en: 'Answering "who deleted this resource" with CloudWatch — API call history is CloudTrail.' }
    ]
  },

  ssm: {
    how_ko: 'Systems Manager는 SSM 에이전트가 깔린 인스턴스를 관리 대상으로 삼습니다. 에이전트가 아웃바운드로 SSM 엔드포인트에 연결해 명령을 받아 가는 구조라, 인바운드 포트를 열지 않아도 됩니다. Session Manager가 SSH 없이 셸을 제공하는 원리가 이것이며, 그래서 배스천 호스트와 22번 포트, SSH 키 관리가 모두 사라집니다. 접근 권한은 IAM으로 통제하고 세션 로그는 S3·CloudWatch에 남습니다.\n\nPatch Manager는 패치 기준선과 유지 관리 기간으로 패치를 자동화하고 준수 보고서를 만듭니다. Parameter Store는 설정값을 계층 구조로 저장하며 SecureString은 KMS로 암호화됩니다.',
    how_en: 'Systems Manager manages instances running the SSM agent. The agent connects outbound to SSM endpoints and pulls commands, so no inbound port is needed. That is how Session Manager provides a shell without SSH, eliminating bastion hosts, port 22, and SSH key management. Access is controlled by IAM and session logs go to S3 or CloudWatch.\n\nPatch Manager automates patching against a baseline during maintenance windows and reports compliance. Parameter Store holds configuration hierarchically, with SecureString encrypted by KMS.',
    why_ko: '시험 신호는 "SSH 키와 배스천을 없애라", "인바운드 포트를 열지 않고 접속", "수백 대 인스턴스를 일괄 패치", "설정값을 안전하게 보관"입니다. 프라이빗 서브넷의 인스턴스는 VPC 엔드포인트를 통해 SSM에 닿게 하는 구성이 함께 나옵니다.',
    why_en: 'The signals are eliminating SSH keys and bastions, connecting with no inbound ports, patching hundreds of instances at once, and storing configuration safely. Instances in private subnets pair this with VPC endpoints to reach SSM.',
    traps: [
      { ko: '접속 감사를 위해 배스천 호스트에 로깅을 붙이는 선택지 — Session Manager가 감사 로그를 기본 제공하며 배스천 자체가 불필요합니다.',
        en: 'Adding logging to a bastion host for access auditing — Session Manager provides audit logs natively and removes the bastion.' }
    ]
  },

  cloudtrail: {
    how_ko: 'CloudTrail은 계정에서 발생한 API 호출을 이벤트로 기록합니다. 관리 이벤트(리소스 생성·삭제·설정 변경)는 기본으로 90일간 이벤트 기록에 남고, 더 길게 보관하거나 데이터 이벤트(S3 객체 수준 읽기·쓰기, Lambda 호출)를 남기려면 추적(trail)을 만들어 S3로 보내야 합니다.\n\n감사 로그의 신뢰성을 지키는 방법이 시험에 나옵니다 — 조직 추적으로 모든 계정을 강제 포함하고, 로그를 별도 보안 계정의 S3로 보내고, Object Lock과 로그 파일 검증을 켭니다. 그러면 침입자가 자기 흔적을 지울 수 없습니다.',
    how_en: 'CloudTrail records API calls in the account as events. Management events (creating, deleting, and reconfiguring resources) stay in Event history for 90 days by default; retaining longer, or capturing data events (S3 object-level reads and writes, Lambda invocations), requires a trail delivering to S3.\n\nThe exam asks how to keep that audit log trustworthy: an organization trail covering every account, delivery to S3 in a separate security account, plus Object Lock and log-file validation — so an intruder cannot erase their tracks.',
    why_ko: '"누가 무엇을 언제 했는가"는 언제나 CloudTrail입니다. CloudWatch(성능·지표), Config(구성 규정 준수)와의 삼각 구분이 반복 출제됩니다.',
    why_en: '"Who did what, when" is always CloudTrail. The three-way distinction against CloudWatch (performance) and Config (configuration compliance) recurs throughout.',
    traps: [
      { ko: 'S3 객체 접근 기록이 기본으로 남는다고 가정하는 것 — 데이터 이벤트는 별도로 켜야 합니다.',
        en: 'Assuming S3 object access is logged by default — data events must be enabled explicitly.' },
      { ko: '로그를 같은 계정에 두고 무결성을 주장하는 것 — 계정이 침해되면 로그도 위험합니다.',
        en: 'Claiming integrity while keeping logs in the same account — a compromised account endangers the logs too.' }
    ]
  },

  backup: {
    how_ko: 'AWS Backup은 백업 계획(빈도, 보존, 리전·계정 간 복사)을 정의하고 태그나 리소스 목록으로 대상을 묶습니다. EBS, RDS, Aurora, DynamoDB, EFS, FSx, Storage Gateway, EC2 등을 하나의 정책으로 관리하고, 백업 볼트에 저장합니다. 볼트 락을 걸면 보존 기간 내 삭제를 차단해 랜섬웨어와 내부자 삭제에 대비합니다.',
    how_en: 'AWS Backup defines a backup plan (frequency, retention, cross-Region and cross-account copy) and selects resources by tag or list. It manages EBS, RDS, Aurora, DynamoDB, EFS, FSx, Storage Gateway, and EC2 under one policy, storing recovery points in a backup vault. Vault Lock blocks deletion within the retention period, defending against ransomware and insider deletion.',
    why_ko: '시험 신호는 "여러 서비스의 백업을 중앙에서", "백업 정책 준수를 감사", "리전 간 백업 복사"입니다. Lambda로 서비스마다 스냅샷 스크립트를 짜는 선택지보다 운영 부담이 낮아 정답이 됩니다.',
    why_en: 'The signals are centralising backups across services, auditing backup compliance, and copying backups cross-Region. It beats per-service snapshot scripts in Lambda on operational overhead.',
    traps: [
      { ko: '서비스별로 별도 스냅샷 자동화를 구성하는 선택지 — 중앙 정책과 준수 보고가 없어 관리형 조건에서 밀립니다.',
        en: 'Building separate snapshot automation per service — no central policy or compliance reporting, so it loses managed-service questions.' }
    ]
  },

  config: {
    how_ko: 'AWS Config는 지원 리소스의 설정 스냅샷을 지속적으로 기록해 변경 이력을 만듭니다. 그 위에 규칙(관리형 또는 사용자 정의 Lambda)을 얹으면 "모든 EBS 볼륨은 암호화되어야 한다" 같은 조건을 평가해 준수·미준수를 판정합니다. 미준수 발견 시 SSM Automation 문서를 연결해 자동 교정도 가능합니다.\n\nConformance Pack으로 규칙 묶음을 배포하고 조직 전체에 적용할 수 있어, 규정 준수 프레임워크(PCI, HIPAA 등) 대응에 쓰입니다.',
    how_en: 'AWS Config continuously records configuration snapshots of supported resources, building a change history. Rules on top — managed or custom Lambda — evaluate conditions such as "every EBS volume must be encrypted" and mark resources compliant or not. Findings can trigger automatic remediation through an SSM Automation document.\n\nConformance packs bundle rules for organisation-wide deployment, which is how compliance frameworks such as PCI and HIPAA are addressed.',
    why_ko: '시험은 Config를 "구성 규정 준수" 전담으로 씁니다. "규칙을 위반한 리소스를 찾아라", "설정이 언제 어떻게 바뀌었나", "위반 시 자동으로 되돌려라"가 신호입니다. Inspector(소프트웨어 취약점), CloudTrail(API 호출)과 구분하는 것이 핵심입니다.',
    why_en: 'The exam assigns Config to configuration compliance: find non-compliant resources, see when and how a setting changed, and revert violations automatically. The key is separating it from Inspector (software vulnerabilities) and CloudTrail (API calls).',
    traps: [
      { ko: 'CVE 스캔을 Config로 답하는 것 — Inspector의 영역입니다.',
        en: 'Answering a CVE scan question with Config — that is Inspector.' }
    ]
  },

  cloudformation: {
    how_ko: 'CloudFormation은 템플릿(JSON·YAML)에 선언한 리소스를 스택 단위로 생성·갱신·삭제합니다. 갱신 시 변경 세트로 무엇이 바뀔지 미리 볼 수 있고, 실패하면 자동 롤백합니다. 스택을 삭제하면 그 스택이 만든 리소스가 함께 사라져 임시 환경 정리가 간단합니다.\n\nStackSets는 하나의 템플릿을 여러 계정과 리전에 한 번에 배포하며, Organizations와 연동해 새 계정이 생기면 자동 적용되게 할 수 있습니다. 드리프트 감지는 콘솔에서 수동으로 바뀐 부분을 찾아냅니다.',
    how_en: 'CloudFormation creates, updates, and deletes the resources declared in a template (JSON or YAML) as a stack. Updates preview through change sets and roll back automatically on failure. Deleting a stack removes the resources it created, making temporary environments easy to clean up.\n\nStackSets deploy one template across many accounts and Regions at once, and integrate with Organizations so new accounts get it automatically. Drift detection finds resources changed manually in the console.',
    why_ko: '시험 신호는 "동일한 환경을 반복 생성", "수동 설정을 없애라", "조직 전체에 표준 구성 적용"(StackSets)입니다. 임시 개발 환경을 만들고 지우는 비용 절감 문항에도 나옵니다.',
    why_en: 'The signals are reproducing identical environments, eliminating manual setup, and applying a standard baseline organisation-wide (StackSets). It also appears in cost questions about spinning temporary environments up and down.',
    traps: [
      { ko: '재현성을 요구하는데 콘솔 수동 구성이나 문서화된 절차를 고르는 것 — 드리프트가 발생합니다.',
        en: 'Choosing manual console setup or a documented runbook when reproducibility is required — drift follows.' }
    ]
  },

  costmgmt: {
    how_ko: 'Cost Explorer는 과거 지출을 차원(서비스·계정·태그·리전)별로 쪼개 보고 향후 12개월을 예측합니다. AWS Budgets는 금액·사용량·RI 활용률에 예산을 걸어 초과 시 또는 초과 예측 시 알림을 보내고, 작업(SCP 적용, 인스턴스 중지)까지 연결할 수 있습니다. Cost and Usage Report는 시간 단위 원시 청구 데이터를 S3에 내려 Athena·QuickSight로 직접 분석하게 합니다.\n\n비용 배분 태그를 활성화하면 이 모든 도구에서 부서·프로젝트별 분해가 가능해집니다.',
    how_en: 'Cost Explorer breaks historical spend down by dimension (service, account, tag, Region) and forecasts twelve months ahead. AWS Budgets sets budgets on amount, usage, or RI utilisation, alerting when exceeded or forecast to exceed, and can trigger actions such as applying an SCP or stopping instances. The Cost and Usage Report delivers hourly raw billing data to S3 for direct analysis in Athena or QuickSight.\n\nActivating cost allocation tags makes per-department and per-project breakdowns available across all of them.',
    why_ko: '시험은 세 도구를 용도로 구분시킵니다 — 분석·예측은 Cost Explorer, 임계값 알림은 Budgets, 원시 데이터 분석은 CUR. "어느 팀이 얼마 썼는지"는 비용 배분 태그입니다.',
    why_en: 'The exam separates the three by purpose: analysis and forecasting → Cost Explorer, threshold alerts → Budgets, raw data analysis → CUR. "Which team spent what" is cost allocation tags.',
    traps: [
      { ko: '예산 초과 알림을 Cost Explorer로 답하는 것 — 알림 기능은 Budgets에 있습니다.',
        en: 'Answering a budget-alert question with Cost Explorer — alerting belongs to Budgets.' }
    ]
  },

  trustedadvisor: {
    how_ko: 'Trusted Advisor는 계정을 다섯 범주(비용 최적화, 성능, 보안, 내결함성, 서비스 한도)로 점검해 권고를 냅니다. 유휴 로드 밸런서, 저사용률 EC2, 공개된 보안 그룹 포트, 다중 AZ 미구성 RDS, 한도에 임박한 리소스 같은 항목을 찾아냅니다. 무료로는 일부 보안·서비스 한도 검사만 열리고, 전체 검사는 Business 이상 지원 플랜이 필요합니다.',
    how_en: 'Trusted Advisor checks the account across five categories — cost optimisation, performance, security, fault tolerance, and service limits — and issues recommendations: idle load balancers, underutilised EC2, open security group ports, RDS without Multi-AZ, resources near a limit. Only some security and service-limit checks are free; the full set requires Business support or higher.',
    why_ko: '시험은 Trusted Advisor를 두 방식으로 씁니다. 하나는 "아무 설정 없이 즉시 계정 전반의 개선점을 받아라"는 요구에 대한 답이고, 다른 하나는 지원 플랜 제약을 조건으로 거는 것입니다 — 무료 플랜에서 전체 검사를 기대하는 선택지를 오답으로 만드는 식입니다. Config(구성 규칙 평가)나 Cost Explorer(지출 분석)와 달리 규칙을 직접 정의하지 않고 AWS의 모범 사례를 그대로 받아온다는 점이 구분점입니다.',
    why_en: 'The exam uses Trusted Advisor two ways: as the answer to "get account-wide improvement recommendations with no setup", and as a support-plan constraint that makes "expect the full check set on the free plan" wrong. Unlike Config (which evaluates rules you define) or Cost Explorer (which analyses spend), it simply delivers AWS best practices as-is.',
    traps: [
      { ko: '무료 플랜에서 전체 검사를 기대하는 선택지 — 제한이 있습니다.',
        en: 'Expecting the full check set on the free plan — it is limited.' }
    ]
  },

  /* ====================================================================== */
  storagegw: {
    how_ko: 'Storage Gateway는 온프레미스에 가상 어플라이언스(VM 또는 하드웨어)를 두고, 로컬 네트워크에는 익숙한 프로토콜로 노출하면서 실제 데이터는 AWS에 저장합니다. 어플라이언스는 로컬 디스크를 캐시로 써서 자주 접근하는 데이터를 저지연으로 제공하고, 나머지는 S3나 Glacier에 둡니다. 즉 "무한한 용량 + 로컬 속도"의 절충입니다.\n\nFile Gateway는 NFS·SMB로 노출하고 파일을 S3 객체로 저장합니다. Volume Gateway는 iSCSI 블록 볼륨을 제공하며 캐시형(주 데이터는 AWS)과 저장형(주 데이터는 로컬, 백업만 AWS)으로 나뉩니다. Tape Gateway는 가상 테이프 라이브러리로 보여 기존 백업 소프트웨어를 그대로 쓰게 합니다.',
    how_en: 'Storage Gateway places a virtual appliance (VM or hardware) on-premises, exposing familiar protocols to the local network while data actually lives in AWS. The appliance uses local disk as a cache to serve hot data with low latency and keeps the rest in S3 or Glacier — a compromise of unlimited capacity at local speed.\n\nFile Gateway exposes NFS and SMB, storing files as S3 objects. Volume Gateway presents iSCSI block volumes in cached mode (primary data in AWS) or stored mode (primary data local, backups in AWS). Tape Gateway appears as a virtual tape library so existing backup software works unchanged.',
    why_ko: '시험 신호는 "온프레미스 저장 공간이 부족한데 최근 파일은 빠르게 접근해야 한다"와 "물리 테이프를 없애되 백업 소프트웨어는 유지"입니다. DataSync와의 구분은 일회성 이전인지 상시 하이브리드인지입니다.',
    why_en: 'The signals are "out of local capacity but recent files must stay fast" and "remove physical tape while keeping the backup software". The DataSync distinction is one-time migration versus ongoing hybrid operation.',
    traps: [
      { ko: '단순 데이터 마이그레이션에 Storage Gateway를 고르는 것 — 전송이 목적이면 DataSync가 정답입니다.',
        en: 'Choosing Storage Gateway for a plain data migration — if the goal is transfer, DataSync is the answer.' }
    ]
  },

  datasync: {
    how_ko: 'DataSync는 온프레미스에 에이전트를 두고 소스(NFS·SMB·HDFS·자체 관리 객체 스토리지)와 대상(S3·EFS·FSx) 사이를 병렬 다중 스레드로 전송합니다. 전송 후 체크섬으로 무결성을 검증하고, 이후 실행에서는 변경분만 옮깁니다. 대역폭 상한을 걸어 업무 시간에 회선을 잠식하지 않게 조절할 수 있습니다.\n\n일회성 마이그레이션과 주기적 동기화 모두 같은 메커니즘으로 처리하며, AWS 내부(S3 → EFS 등) 전송도 지원합니다.',
    how_en: 'DataSync runs an agent on-premises and transfers between a source (NFS, SMB, HDFS, self-managed object storage) and a destination (S3, EFS, FSx) using parallel multi-threaded copies. It verifies integrity with checksums and moves only changes on later runs. A bandwidth cap keeps it from saturating the link during business hours.\n\nThe same mechanism serves one-time migrations and scheduled sync, and it also transfers between AWS locations such as S3 to EFS.',
    why_ko: '시험의 판단은 대역폭입니다. 회선이 충분하면 DataSync, 부족하거나 데이터가 수십 TB 이상이어서 몇 주가 걸리면 Snowball입니다. "네트워크 대역폭을 최소한으로 사용"이라는 문구가 Snowball의 결정적 신호입니다.',
    why_en: 'The decision is bandwidth. Adequate link → DataSync. Insufficient link, or tens of TB that would take weeks → Snowball. The phrase "using the least network bandwidth" decisively signals Snowball.',
    traps: [
      { ko: '스크립트와 AWS CLI로 직접 복사하는 선택지 — 재시도·검증·증분 처리를 직접 만들어야 해 관리형 조건에서 밀립니다.',
        en: 'Copying with scripts and the AWS CLI — you must build retry, verification, and incremental logic yourself, losing managed-service questions.' }
    ]
  },

  dms: {
    how_ko: 'DMS는 복제 인스턴스를 띄워 소스 DB에서 읽고 대상 DB에 씁니다. 전체 로드로 기존 데이터를 옮긴 뒤 CDC(변경 데이터 캡처)로 그 사이 발생한 변경을 계속 따라가므로, 소스는 마이그레이션 중에도 계속 서비스할 수 있습니다. 최종 전환 시점에만 애플리케이션을 새 DB로 돌리면 되어 다운타임이 몇 분 수준으로 줄어듭니다.\n\n엔진이 다르면 스키마와 저장 프로시저를 변환해야 하므로 Schema Conversion Tool(SCT)을 먼저 씁니다. DMS는 데이터를 옮기고 SCT는 구조를 옮긴다는 분업입니다.',
    how_en: 'DMS runs a replication instance that reads from the source database and writes to the target. A full load moves existing data, then change data capture follows subsequent changes, so the source keeps serving throughout. Only at cutover does the application repoint, shrinking downtime to minutes.\n\nDifferent engines need schema and stored procedures converted, so the Schema Conversion Tool comes first. The division is that SCT moves structure and DMS moves data.',
    why_ko: '시험 신호는 "최소 다운타임으로 데이터베이스를 옮겨라"이며, 여기서 두 갈래가 갈립니다. 소스와 대상 엔진이 같으면 DMS만으로 충분하고, 다르면(Oracle → Aurora PostgreSQL 등) Schema Conversion Tool로 스키마·저장 프로시저를 먼저 변환해야 합니다. 이 SCT 단계를 빠뜨린 선택지가 이기종 문항의 대표적 오답이며, 반대로 덤프·복원을 제안하는 선택지는 다운타임 요구를 위반해 탈락합니다.',
    why_en: 'The signal is "migrate the database with minimal downtime", and it forks twice. Matching engines need only DMS; differing engines (Oracle to Aurora PostgreSQL, say) need the Schema Conversion Tool first for schema and stored procedures. Options omitting that SCT step are the classic heterogeneous distractor, while dump-and-restore options fail the downtime requirement outright.',
    traps: [
      { ko: '이기종 이전에 DMS만 쓰려는 선택지 — 스키마 변환이 빠져 있습니다.',
        en: 'Using only DMS for a heterogeneous migration — schema conversion is missing.' },
      { ko: '덤프·복원으로 이전하려는 선택지 — 다운타임 요구를 만족하지 못합니다.',
        en: 'Migrating by dump and restore — it cannot meet the downtime requirement.' }
    ]
  },

  snowball: {
    how_ko: 'Snow 제품군은 데이터를 물리적으로 운반합니다. 주문하면 암호화된 장비가 배송되고, 로컬 네트워크에서 데이터를 채워 반송하면 AWS가 S3로 적재한 뒤 장비를 안전 소거합니다. 전송 속도는 회선이 아니라 배송 시간에 지배되므로, 대역폭이 병목인 대용량 이전에서 네트워크보다 빠릅니다.\n\n용량대별로 Snowcone(수 TB, 엣지·소형), Snowball Edge(수십 TB, 표준 선택, 컴퓨팅 옵션 포함), Snowmobile(수십 PB, 트레일러 단위)로 나뉩니다.',
    how_en: 'The Snow family moves data physically. You order a device, it ships encrypted, you fill it over the local network, ship it back, and AWS loads it into S3 then securely erases it. Throughput is governed by shipping time rather than link speed, so for bandwidth-bound bulk migrations it beats the network.\n\nBy capacity: Snowcone (a few TB, edge and small form factor), Snowball Edge (tens of TB, the standard choice, with compute options), and Snowmobile (tens of PB, a shipping container).',
    why_ko: '시험은 대역폭과 기간으로 판단하게 합니다. "제한된 대역폭", "네트워크를 최소한으로", "전송에 수 주가 걸린다"가 Snowball 신호이고, 그런 언급이 없으면 DataSync가 더 단순합니다.',
    why_en: 'The exam decides on bandwidth and duration. "Limited bandwidth", "use the least network", or "would take weeks" signal Snowball; without them DataSync is simpler.',
    traps: [
      { ko: '고속 회선이 있는데 Snowball을 고르는 것 — 배송 시간 때문에 오히려 느립니다.',
        en: 'Choosing Snowball when a fast link exists — shipping time makes it slower.' }
    ]
  },

  transferfamily: {
    how_ko: 'Transfer Family는 관리형 SFTP·FTPS·FTP 엔드포인트를 제공하고, 업로드된 파일을 S3나 EFS에 바로 씁니다. 사용자 인증은 서비스 관리형 사용자, Active Directory, 또는 사용자 지정 자격 증명 공급자(Lambda + API Gateway)로 처리합니다. 파트너가 쓰던 SFTP 클라이언트와 스크립트를 그대로 두면서 서버 운영만 없애는 것이 목적입니다.',
    how_en: 'Transfer Family provides managed SFTP, FTPS, and FTP endpoints that write uploads straight into S3 or EFS. Authentication uses service-managed users, Active Directory, or a custom identity provider (Lambda behind API Gateway). The point is removing server operations while partners keep their existing SFTP clients and scripts.',
    why_ko: '시험 신호는 "파트너가 SFTP로 파일을 보낸다"와 "FTP 서버 운영을 없애라"입니다. EC2에 SFTP 서버를 세우는 선택지보다 운영 부담이 낮아 정답이 됩니다.',
    why_en: 'The signals are "partners upload over SFTP" and "stop operating FTP servers". It beats standing up an SFTP server on EC2 on operational overhead.',
    traps: [
      { ko: '고가용성을 위해 EC2 SFTP 서버를 다중 AZ로 구성하는 선택지 — 관리형 서비스가 이미 그것을 제공합니다.',
        en: 'Building a multi-AZ EC2 SFTP tier for availability — the managed service already provides it.' }
    ]
  },

  /* ======================================================================
     EXAM INTENT — these are not services. They are the judgement criteria
     the exam repeatedly hides inside a scenario, and they decide which of
     two functionally similar options is correct.
     ====================================================================== */
  opex: {
    how_ko: '"운영 부담"은 사람이 반복해서 해야 하는 일의 총량입니다 — 서버 패치, 용량 증설, 백업 스크립트 유지, 장애 대응 대기, 버전 업그레이드. AWS 서비스를 이 축으로 세우면 뚜렷한 서열이 나옵니다. 서버리스(Lambda, Fargate, DynamoDB, S3, Athena, SQS)는 인프라가 존재하지 않는 것처럼 보이고, 관리형(RDS, ElastiCache, OpenSearch, MSK)은 인스턴스는 보이지만 패치·백업·장애 조치를 AWS가 하고, 자체 운영(EC2에 직접 설치)은 전부 사람 몫입니다.\n\n134문제에 등장하는 이 조건은 사실상 "서열이 낮은 쪽을 고르라"는 지시입니다. 기능이 같아 보이는 두 선택지가 남으면, 사람이 손댈 일이 적은 쪽이 정답입니다.',
    how_en: '"Operational overhead" is the total amount of work humans must repeat: patching servers, adding capacity, maintaining backup scripts, being on call, upgrading versions. Ranking AWS services on that axis gives a clear order. Serverless (Lambda, Fargate, DynamoDB, S3, Athena, SQS) looks as if no infrastructure exists; managed (RDS, ElastiCache, OpenSearch, MSK) shows instances but AWS patches, backs up, and fails them over; self-hosted (installed on EC2) is all yours.\n\nAppearing in 134 questions, this qualifier is effectively an instruction to pick the lower rung. When two options look functionally equal, the one needing less human attention is correct.',
    why_ko: '이 조건은 단독으로 오지 않고 다른 요구와 함께 옵니다. 비용과 충돌할 때는 문제의 대문자 강조(LEAST vs MOST)가 어느 쪽이 진짜 기준인지 알려 줍니다. 그리고 이 조건이 있으면 "EC2에 무언가를 설치한다", "cron을 띄운다", "직접 스크립트를 짠다"는 선택지를 가장 먼저 지우는 것이 시간을 아끼는 방법입니다.',
    why_en: 'This qualifier never arrives alone. When it conflicts with cost, the capitalised word in the question (LEAST versus MOST) tells you which one actually decides. And when it is present, the fastest route is eliminating "install it on EC2", "run cron", and "write our own script" first.',
    traps: [
      { ko: '기능적으로 더 강력하다는 이유로 자체 운영 선택지를 고르는 것 — 이 조건이 명시되면 기능 과잉은 오답 근거가 됩니다.',
        en: 'Choosing the self-hosted option because it is more capable — with this qualifier stated, extra capability is a reason it is wrong.' },
      { ko: '"관리형"과 "서버리스"를 같은 것으로 보는 것 — RDS는 관리형이지만 인스턴스 크기와 스토리지를 여전히 사람이 정합니다. 완전한 무관리가 요구되면 Aurora Serverless나 DynamoDB입니다.',
        en: 'Treating "managed" and "serverless" as the same — RDS is managed but you still size instances and storage. If truly hands-off is required, that is Aurora Serverless or DynamoDB.' }
    ],
    compare: [
      { left: '운영 부담 최소화', right: '비용 최적화',
        rule_ko: '두 조건이 함께 나오면 서로 반대 방향을 가리키는 경우가 많습니다(서버리스는 편하지만 고사용률에서 비싸고, EC2 Spot은 싸지만 손이 갑니다). 문제에서 대문자로 강조된 조건이 우선이며, 강조가 없으면 "요구를 만족하는 가장 단순한 것"이 안전한 선택입니다.',
        rule_en: 'When both appear they often point opposite ways (serverless is easy but pricey at high utilisation; EC2 Spot is cheap but hands-on). The capitalised qualifier wins, and absent emphasis, the simplest option that meets the requirement is the safe pick.' }
    ]
  },

  latency: {
    how_ko: '지연시간 문제는 원인이 어디인지에 따라 해법이 완전히 달라집니다. 크게 네 곳입니다. 첫째, 사용자와 서버의 물리적 거리 — 빛의 속도는 바꿀 수 없으므로 콘텐츠를 사용자 쪽으로 옮기거나(CloudFront) 경로를 백본으로 바꿉니다(Global Accelerator). 둘째, 반복되는 동일 조회 — 데이터베이스까지 가지 않도록 캐시를 앞에 둡니다(ElastiCache, DAX, API Gateway 캐시). 셋째, 스토리지 I/O — IOPS나 처리량이 부족하면 볼륨 타입을 바꿉니다(gp3 조정, io2, FSx for Lustre). 넷째, 컴퓨팅 자체 — 콜드 스타트(Provisioned Concurrency)나 CPU 부족(메모리 상향, 인스턴스 타입)입니다.\n\n108문제에서 이 조건이 나오는데, 문제 문장에 원인이 거의 항상 명시되어 있습니다. "전 세계 사용자", "같은 쿼리가 반복", "디스크가 병목", "첫 요청이 느리다" 같은 표현이 어느 곳인지 알려 줍니다.',
    how_en: 'Latency problems have completely different fixes depending on where the delay lives. There are four places. First, physical distance — you cannot change the speed of light, so move content toward the user (CloudFront) or change the path to the backbone (Global Accelerator). Second, repeated identical reads — put a cache in front so requests never reach the database (ElastiCache, DAX, API Gateway caching). Third, storage I/O — change volume type when IOPS or throughput is short (tune gp3, io2, FSx for Lustre). Fourth, compute itself — cold starts (Provisioned Concurrency) or insufficient CPU (more memory, a different instance type).\n\nThis qualifier appears in 108 questions, and the cause is almost always spelled out: "global users", "the same query repeats", "the disk is the bottleneck", "the first request is slow".',
    why_ko: '시험은 원인과 해법을 잘못 짝지은 선택지를 대량으로 만들어 냅니다. 거리 문제에 캐시를 붙이거나, 반복 조회 문제에 인스턴스를 키우거나, 콜드 스타트에 CDN을 붙이는 식입니다. 그래서 이 유형은 "먼저 원인을 한 단어로 규정하고 그다음 도구를 고르는" 순서를 지키면 정확도가 크게 올라갑니다.',
    why_en: 'The exam manufactures distractors that mispair cause and fix: a cache for a distance problem, a bigger instance for repeated reads, a CDN for cold starts. Accuracy rises sharply if you name the cause in one word before choosing a tool.',
    traps: [
      { ko: '전 세계 사용자 지연 문제를 인스턴스 타입 상향으로 답하는 것 — 거리가 원인이면 서버 성능은 무관합니다.',
        en: 'Answering global-user latency with a bigger instance type — when distance is the cause, server speed is irrelevant.' },
      { ko: '읽기 캐시로 쓰기 지연을 개선하려는 것 — 캐시는 읽기 경로만 단축합니다.',
        en: 'Trying to improve write latency with a read cache — a cache only shortens the read path.' }
    ]
  },

  cost: {
    how_ko: '비용 최적화는 결국 사용 패턴을 읽고 과금 모델을 맞추는 일입니다. 컴퓨팅은 시간의 성격으로 갈립니다 — 중단 가능하면 Spot, 상시면 약정 할인, 간헐적이면 서버리스, 예측 가능한 시각이면 스케줄 조정. 스토리지는 접근 빈도로 갈립니다 — 수명주기로 IA·Glacier 전환, 패턴 미상이면 Intelligent-Tiering, 재생성 가능하면 One Zone. 데이터베이스는 부하 패턴으로 갈립니다 — 들쭉날쭉하면 Aurora Serverless나 DynamoDB On-Demand.\n\n그리고 자주 간과되는 축이 데이터 전송입니다. NAT 게이트웨이 처리 요금, 리전 간 전송, 인터넷 아웃바운드가 예상 밖의 청구를 만들며, 각각 VPC 엔드포인트·아키텍처 재배치·CloudFront로 줄입니다.',
    how_en: 'Cost optimisation is reading the usage pattern and matching the billing model. Compute forks on temporal shape: interruptible → Spot, always-on → commitment discounts, intermittent → serverless, predictable times → scheduled scaling. Storage forks on access frequency: lifecycle to IA and Glacier, Intelligent-Tiering when the pattern is unknown, One Zone when data is reproducible. Databases fork on load shape: erratic → Aurora Serverless or DynamoDB on-demand.\n\nThe overlooked axis is data transfer. NAT gateway processing, cross-Region transfer, and internet egress produce surprising bills, reduced respectively by VPC endpoints, rearchitecting placement, and CloudFront.',
    why_ko: '101문제가 비용을 기준으로 삼습니다. 함정은 두 가지 방향입니다 — 싼 것을 골랐지만 요구를 못 지키는 경우(중요 데이터를 One Zone-IA에, 사용자 대면 DB를 Spot에), 그리고 요구는 지키지만 과잉인 경우(RTO 24시간에 Active-Active). 정답은 항상 "요구를 만족하는 가장 저렴한 것"입니다.',
    why_en: '101 questions turn on cost, and the traps run both ways: cheap but failing the requirement (critical data in One Zone-IA, a user-facing database on Spot), and meeting the requirement but over-provisioned (active-active for a 24-hour RTO). The answer is always the cheapest option that still meets the requirement.',
    traps: [
      { ko: '비용만 보고 가용성·내구성 요구를 희생하는 선택지 — 요구를 위반하면 아무리 싸도 오답입니다.',
        en: 'Sacrificing availability or durability requirements for price — violating a requirement is wrong no matter how cheap.' },
      { ko: '보관 기간이 짧은 데이터를 Glacier에 넣는 것 — 최소 과금 기간 위약금으로 총비용이 올라갑니다.',
        en: 'Putting short-retention data in Glacier — minimum-duration charges raise the total.' }
    ]
  },

  hybrid: {
    how_ko: '하이브리드 요구는 세 종류로 갈라집니다. 연결이 목적이면 네트워크 계층 — 빠르고 저렴한 Site-to-Site VPN, 일관된 성능의 Direct Connect, VPC가 많으면 Transit Gateway입니다. 데이터를 옮기는 것이 목적이면 전송 계층 — 대역폭이 충분하면 DataSync, 부족하면 Snowball, 데이터베이스면 DMS입니다. 상시 하이브리드로 운영하는 것이 목적이면 스토리지·컴퓨팅 계층 — 로컬 접근을 유지하며 용량을 늘리는 Storage Gateway, AWS 하드웨어가 현장에 있어야 하는 Outposts입니다.\n\n98문제가 온프레미스를 언급하는데, 이 세 갈래 중 어디인지 먼저 정하면 후보가 3~4개에서 1개로 줄어듭니다.',
    how_en: 'Hybrid requirements split three ways. If connectivity is the goal, the network layer: Site-to-Site VPN (fast and cheap), Direct Connect (consistent performance), Transit Gateway (many VPCs). If moving data is the goal, the transfer layer: DataSync with adequate bandwidth, Snowball without it, DMS for databases. If continuing to operate hybrid is the goal, the storage and compute layer: Storage Gateway to extend capacity while keeping local access, Outposts when AWS hardware must sit on site.\n\n98 questions mention on-premises, and deciding which of the three branches applies narrows the candidates from four to one.',
    why_ko: '시험은 이 세 갈래를 섞어 놓은 선택지를 냅니다 — 연결 문제에 DataSync를, 전송 문제에 Direct Connect를 제시하는 식입니다. 문제 문장에서 동사를 찾으면 갈래가 정해집니다: "연결하라"는 네트워크, "옮기라·마이그레이션하라"는 전송, "확장하라·유지하라"는 상시 하이브리드입니다.',
    why_en: 'The exam mixes the branches in its options — DataSync for a connectivity problem, Direct Connect for a transfer problem. Find the verb in the question: "connect" is network, "move" or "migrate" is transfer, "extend" or "keep using" is ongoing hybrid.',
    traps: [
      { ko: '긴급 일정에 Direct Connect를 제안하는 것 — 회선 프로비저닝에 수 주 이상 걸립니다.',
        en: 'Proposing Direct Connect on an urgent timeline — circuit provisioning takes weeks or more.' },
      { ko: '일회성 마이그레이션에 Storage Gateway를 고르는 것 — 상시 관문이 목적이 아니면 DataSync가 맞습니다.',
        en: 'Choosing Storage Gateway for a one-time migration — unless an ongoing gateway is the goal, DataSync fits.' }
    ]
  },

  ha: {
    how_ko: '고가용성은 "단일 장애점을 남기지 않는다"는 한 문장으로 요약됩니다. 실전에서는 계층마다 방법이 정해져 있습니다 — 웹·앱 계층은 ALB + 다중 AZ ASG, 관계형 DB는 RDS Multi-AZ 또는 Aurora, 공유 파일은 EFS, 세션은 ElastiCache나 DynamoDB, 객체는 S3(이미 다중 AZ)입니다.\n\n74문제에서 이 조건이 나오는데, 실제 난이도는 "덜 눈에 띄는 단일 장애점"을 찾아내는 데 있습니다. NAT 게이트웨이 하나, Direct Connect 회선 하나, 단일 AZ 서브넷 구성, 단일 인스턴스 Redis, 한 AZ에만 있는 Cluster 배치 그룹이 대표적입니다.',
    how_en: 'High availability reduces to one sentence: leave no single point of failure. In practice each tier has a fixed method — web and app tiers use an ALB with a multi-AZ ASG, relational databases use RDS Multi-AZ or Aurora, shared files use EFS, sessions use ElastiCache or DynamoDB, objects use S3 (already multi-AZ).\n\nThis appears in 74 questions, and the real difficulty is spotting the less obvious single points: one NAT gateway, one Direct Connect circuit, subnets in a single AZ, a single-node Redis, or a Cluster placement group confined to one AZ.',
    why_ko: '이 조건이 있으면 선택지를 지우는 것이 가장 빠릅니다. 단일 인스턴스, 단일 AZ, 단일 회선이 남아 있는 선택지를 전부 제거하면 대개 하나가 남습니다. 그리고 가용 영역 수준과 리전 수준을 구분해야 합니다 — Multi-AZ는 AZ 장애만 막고, 리전 전체 장애에는 리전 간 복제가 필요합니다.',
    why_en: 'With this qualifier, elimination is fastest: discard every option leaving a single instance, single AZ, or single circuit, and usually one remains. Also separate AZ-level from Region-level — Multi-AZ survives an AZ failure only; a Region-wide failure needs cross-Region replication.',
    traps: [
      { ko: '읽기 전용 복제본으로 고가용성을 답하는 것 — 자동 장애 조치가 아니며 비동기라 데이터 손실 가능성이 있습니다.',
        en: 'Answering availability with read replicas — failover is not automatic and asynchronous replication risks data loss.' },
      { ko: '다중 AZ만으로 리전 장애까지 대비된다고 보는 것 — 리전 간 복제가 별도로 필요합니다.',
        en: 'Assuming multi-AZ also covers a Region failure — cross-Region replication is separately required.' }
    ]
  },

  scalab: {
    how_ko: '확장성 요구의 핵심은 "고정 용량을 전제하는 선택지는 모두 틀렸다"는 것입니다. 계층별 수단이 정해져 있습니다 — 컴퓨팅은 ASG(EC2)나 자동 동시성(Lambda·Fargate), 데이터베이스는 DynamoDB On-Demand·Aurora Serverless·읽기 복제본, 버스트 흡수는 SQS, 전역 배포는 CloudFront입니다.\n\n63문제에서 이 조건이 나오며, "예측할 수 없다", "갑자기 10배가 된다", "수백만 사용자", "블랙 프라이데이" 같은 표현이 신호입니다. 수직 확장(더 큰 인스턴스)은 상한과 재시작 때문에 이 유형의 정답이 되기 어렵습니다.',
    how_en: 'The core of scalability requirements is that any option assuming fixed capacity is wrong. Each tier has its tool: compute uses an ASG (EC2) or automatic concurrency (Lambda, Fargate); databases use DynamoDB on-demand, Aurora Serverless, or read replicas; bursts are absorbed by SQS; global distribution uses CloudFront.\n\nIt appears in 63 questions, signalled by "unpredictable", "suddenly ten times", "millions of users", or "Black Friday". Vertical scaling (a bigger instance) rarely answers this type because of its ceiling and required restart.',
    why_ko: '시험은 확장성과 가용성을 함께 요구하는 경우가 많고, 그때 정답은 대개 같은 구성(다중 AZ ASG + ALB)이 됩니다. 별도로 주의할 것은 "확장"이 컴퓨팅만이 아니라는 점 — 뒷단 데이터베이스나 큐가 병목이면 컴퓨팅을 늘려도 소용없습니다.',
    why_en: 'The exam often demands scalability and availability together, and the answer is usually the same shape (multi-AZ ASG behind an ALB). Watch that "scale" is not only compute — if the database or queue behind it is the bottleneck, adding compute changes nothing.',
    traps: [
      { ko: '예측 불가한 스파이크에 프로비저닝된 고정 용량을 고르는 것 — 과소 프로비저닝이면 장애, 과대면 낭비입니다.',
        en: 'Choosing fixed provisioned capacity for unpredictable spikes — under-provision and it breaks, over-provision and it wastes.' },
      { ko: '컴퓨팅만 확장하고 데이터베이스 연결 수 한계를 무시하는 것 — RDS Proxy나 캐시가 함께 필요할 수 있습니다.',
        en: 'Scaling only compute while ignoring database connection limits — RDS Proxy or a cache may be needed too.' }
    ]
  },

  multiaz: {
    how_ko: '가용 영역은 같은 리전 안에 있지만 전원·냉각·네트워크가 물리적으로 분리된 데이터센터 묶음입니다. AZ 사이는 수 밀리초의 저지연 전용 회선으로 연결되어 있어 동기 복제가 실용적입니다 — 이것이 RDS Multi-AZ가 데이터 손실 없이 동작하는 물리적 근거입니다.\n\nMulti-AZ라는 말은 서비스마다 의미가 조금씩 다릅니다. RDS Multi-AZ는 동기 복제 대기 인스턴스와 자동 DNS 장애 조치, ASG의 다중 AZ는 인스턴스 분산 배치, S3는 기본적으로 다중 AZ 저장, EFS는 다중 AZ 마운트 타깃입니다. 56문제에서 이 개념이 직접 다뤄집니다.',
    how_en: 'Availability Zones are clusters of data centres in the same Region with physically separate power, cooling, and networking. They are linked by dedicated low-latency circuits of a few milliseconds, which makes synchronous replication practical — the physical basis for RDS Multi-AZ operating without data loss.\n\n"Multi-AZ" means slightly different things per service: for RDS it is a synchronous standby with automatic DNS failover; for an ASG it is spreading instances; for S3 it is the default storage layout; for EFS it is mount targets per AZ. The concept is the direct subject of 56 questions.',
    why_ko: '시험이 반복하는 오답은 RDS Multi-AZ가 읽기 성능을 개선한다는 주장입니다. 대기 인스턴스는 트래픽을 받지 않습니다. 또 하나는 Multi-AZ가 리전 장애까지 막는다는 주장입니다 — AZ는 같은 리전 안에 있습니다.',
    why_en: 'The recurring distractor is claiming RDS Multi-AZ improves read performance — the standby serves no traffic. The other is claiming Multi-AZ survives a Region failure — AZs are inside one Region.',
    traps: [
      { ko: 'Multi-AZ로 읽기 확장을 답하는 것 — 읽기 전용 복제본이 정답입니다.',
        en: 'Answering read scale-out with Multi-AZ — read replicas are the answer.' },
      { ko: 'Cluster 배치 그룹과 다중 AZ를 동시에 요구하는 선택지 — Cluster는 단일 AZ 전용이라 양립하지 않습니다.',
        en: 'An option requiring both a Cluster placement group and multi-AZ — Cluster is single-AZ only, so they are incompatible.' }
    ]
  },

  encryption: {
    how_ko: '암호화 문제는 먼저 "저장 중(at rest)인가 전송 중(in transit)인가"를 가릅니다. 저장 중은 대부분 KMS 통합으로 해결됩니다 — S3는 SSE-S3/SSE-KMS/SSE-C, EBS·RDS·EFS·DynamoDB는 생성 시 KMS 키 지정입니다. 전송 중은 TLS이며 ACM 인증서를 통합 지점(ALB, CloudFront, API Gateway)에 붙입니다.\n\n두 번째 갈림길은 "키를 누가 통제하는가"입니다. AWS 관리형 키는 설정이 없고 감사도 제한적입니다. 고객 관리형 키는 키 정책을 직접 쓰고, 교체 주기를 정하고, CloudTrail로 사용 내역을 감사하고, 필요하면 비활성화해 데이터를 즉시 접근 불가로 만들 수 있습니다. FIPS 140-2 레벨 3 전용 하드웨어나 "AWS조차 접근 불가"가 요구되면 CloudHSM입니다.',
    how_en: 'Encryption questions first split at-rest from in-transit. At rest is mostly KMS integration: S3 offers SSE-S3, SSE-KMS, and SSE-C, while EBS, RDS, EFS, and DynamoDB take a KMS key at creation. In transit is TLS, with ACM certificates attached to integration points (ALB, CloudFront, API Gateway).\n\nThe second fork is who controls the key. AWS-managed keys need no setup and offer limited auditability. Customer-managed keys let you author the key policy, set rotation, audit usage in CloudTrail, and disable the key to make data instantly inaccessible. FIPS 140-2 Level 3 dedicated hardware, or "not even AWS may access it", means CloudHSM.',
    why_ko: '54문제가 암호화를 요구합니다. 함정은 대개 두 곳입니다 — 기존 리소스를 나중에 암호화하려는 시나리오(RDS·EBS는 제자리 암호화 불가, 스냅샷 경로 필요)와 키 정책을 잊는 경우(IAM만 넓혀도 실패)입니다.',
    why_en: '54 questions require encryption, and the traps sit in two places: encrypting existing resources after the fact (RDS and EBS cannot be encrypted in place; the snapshot path is required) and forgetting the key policy (widening IAM alone still fails).',
    traps: [
      { ko: '이미 만든 RDS 인스턴스를 설정 변경으로 암호화하려는 선택지 — 암호화된 스냅샷에서 새 인스턴스를 복원해야 합니다.',
        en: 'Encrypting an existing RDS instance by changing a setting — you must restore a new instance from an encrypted snapshot.' },
      { ko: '전송 중 암호화 요구를 저장 암호화로 답하는 것 — 두 요구는 별개이며 각각 조치가 필요합니다.',
        en: 'Answering an in-transit requirement with at-rest encryption — they are separate requirements needing separate measures.' }
    ]
  },

  compliance: {
    how_ko: '규정 준수 문제는 "무엇을 증명해야 하는가"로 서비스가 정해집니다. 행위 기록을 증명해야 하면 CloudTrail(누가 무엇을 언제), 설정이 규칙을 지킨다는 것을 증명해야 하면 Config(구성 준수와 이력), 민감 데이터의 소재를 증명해야 하면 Macie(S3의 PII), 취약점이 없음을 증명해야 하면 Inspector(CVE)입니다.\n\n여기에 두 가지 구조적 요구가 얹힙니다. 불변 보관은 S3 Object Lock Compliance 모드나 Glacier Vault Lock으로 보존 기간 내 삭제를 원천 차단합니다. 데이터 상주는 특정 리전에만 저장하고, SCP로 다른 리전 사용을 금지하고, 필요하면 Outposts로 시설 내에 둡니다.',
    how_en: 'Compliance questions pick a service by what must be proven. Proving actions → CloudTrail (who did what, when). Proving settings follow rules → Config (compliance and history). Proving where sensitive data sits → Macie (PII in S3). Proving absence of vulnerabilities → Inspector (CVEs).\n\nTwo structural requirements layer on. Immutable retention uses S3 Object Lock in Compliance mode or Glacier Vault Lock to make deletion impossible within the retention period. Data residency stores only in the permitted Region, forbids others with an SCP, and where required keeps data on site with Outposts.',
    why_ko: '53문제가 규제나 감사를 언급합니다. 시험은 네 서비스를 서로 바꿔 놓은 선택지를 반복해서 내므로, 위 매핑을 확실히 외우는 것이 가장 효율적입니다. 그리고 "감사자가 로그를 지울 수 없어야 한다"는 요구는 별도 계정 + Object Lock 조합을 요구합니다.',
    why_en: '53 questions mention regulation or audit, and the exam keeps swapping those four services in its options, so memorising the mapping pays off. And "auditors must not be able to delete logs" requires the separate-account plus Object Lock combination.',
    traps: [
      { ko: 'Governance 모드 Object Lock으로 엄격한 규제 요구를 답하는 것 — 특별 권한으로 해제 가능하므로 Compliance 모드가 필요합니다.',
        en: 'Answering a strict regulatory requirement with Governance-mode Object Lock — it can be overridden, so Compliance mode is needed.' },
      { ko: '로그를 같은 계정 S3에 두고 무결성을 주장하는 것 — 계정 침해 시 로그도 조작 가능합니다.',
        en: 'Claiming integrity with logs in the same account\'s S3 — a compromised account can tamper with them.' }
    ]
  },

  dr: {
    how_ko: '재해 복구 전략은 RPO와 RTO 두 숫자로 결정됩니다. RPO는 허용 데이터 손실량(시간으로 표현), RTO는 허용 중단 시간입니다. 네 전략이 이 두 값을 만족하는 비용 순서로 늘어섭니다.\n\nBackup & Restore는 백업만 다른 리전에 두고 재해 시 처음부터 복원합니다 — 가장 저렴하고 RTO는 수 시간입니다. Pilot Light는 데이터 복제는 계속하되 컴퓨팅은 최소한만 켜 둡니다 — RTO 수십 분. Warm Standby는 축소판 환경을 상시 가동해 트래픽만 늘리면 됩니다 — RTO 수 분. Multi-Site Active-Active는 양쪽이 모두 실서비스를 받습니다 — RTO 거의 0, 가장 비쌉니다.',
    how_en: 'Disaster-recovery strategy is decided by two numbers: RPO (tolerable data loss, expressed as time) and RTO (tolerable downtime). Four strategies line up in cost order to satisfy them.\n\nBackup and restore keeps only backups in another Region and rebuilds from scratch — cheapest, RTO in hours. Pilot light keeps data replicating while running minimal compute — RTO in tens of minutes. Warm standby runs a scaled-down live environment that only needs scaling up — RTO in minutes. Multi-site active-active serves production from both — RTO near zero, most expensive.',
    why_ko: '32문제가 DR을 다루고, 함정은 양방향입니다. 요구보다 약한 전략을 고르면 RTO·RPO를 위반하고, 과잉 전략을 고르면 비용 문제에서 밀립니다. 정답은 항상 "주어진 RPO·RTO를 만족하는 가장 저렴한 전략"입니다. RPO가 거의 0이면 동기·준동기 복제(Aurora Global Database, DynamoDB Global Tables, S3 CRR)가 필수입니다.',
    why_en: '32 questions cover DR and the traps run both ways: too weak violates the RTO or RPO, too strong loses on cost. The answer is always the cheapest strategy that satisfies the stated numbers. A near-zero RPO makes synchronous or near-synchronous replication mandatory (Aurora Global Database, DynamoDB Global Tables, S3 CRR).',
    traps: [
      { ko: '데이터 복제만 구성하고 트래픽 전환 장치를 빠뜨리는 것 — Route 53 장애 조치나 Global Accelerator가 함께 필요합니다.',
        en: 'Configuring data replication but omitting traffic shifting — Route 53 failover or Global Accelerator is also required.' },
      { ko: 'RTO가 24시간인데 Active-Active를 고르는 것 — 요구를 초과 충족하면서 비용에서 밀립니다.',
        en: 'Choosing active-active for a 24-hour RTO — it over-satisfies the requirement and loses on cost.' }
    ]
  },

  crossregion: {
    how_ko: '리전 간 복제는 두 목적으로 씁니다 — 리전 전체 장애 대비(DR)와 먼 지역 사용자의 지연시간 감소입니다. 서비스마다 수단이 다릅니다. S3는 CRR, RDS는 리전 간 읽기 복제본, Aurora는 Global Database, DynamoDB는 Global Tables, AMI·EBS 스냅샷은 복사, Secrets Manager는 복제 시크릿입니다.\n\n중요한 것은 데이터 복제와 트래픽 전환이 별개라는 점입니다. 데이터를 복제해도 사용자를 보조 리전으로 보내는 장치(Route 53 장애 조치 라우팅, Global Accelerator)가 없으면 재해 시 아무 일도 일어나지 않습니다.',
    how_en: 'Cross-Region replication serves two purposes: surviving a Region-wide failure (DR) and cutting latency for distant users. The mechanism differs per service: S3 uses CRR, RDS uses cross-Region read replicas, Aurora uses Global Database, DynamoDB uses Global Tables, AMIs and EBS snapshots are copied, and Secrets Manager replicates secrets.\n\nThe important point is that data replication and traffic shifting are separate. Replicated data does nothing during a disaster without a mechanism to send users to the secondary Region — Route 53 failover routing or Global Accelerator.',
    why_ko: '23문제에서 직접 다뤄지지만 DR과 지연시간 문항의 배경으로 훨씬 넓게 깔려 있습니다. 시험이 자주 확인하는 것은 전제 조건입니다 — S3 복제는 양쪽 버킷의 버전 관리, KMS 암호화 객체는 대상 리전의 키, 복제는 신규 객체만(기존은 배치 복제 필요)입니다.',
    why_en: 'It is the direct subject of 23 questions but underlies DR and latency questions far more broadly. What the exam checks is prerequisites: S3 replication needs versioning on both buckets, KMS-encrypted objects need a key in the destination Region, and replication covers new objects only (existing ones need Batch Replication).',
    traps: [
      { ko: '리전 간 복제를 켜면 기존 객체도 함께 복제된다고 보는 것 — 신규 객체만 대상입니다.',
        en: 'Assuming replication also copies existing objects — only new objects are covered.' },
      { ko: '데이터 상주 규정이 있는데 리전 간 복제를 제안하는 것 — 규정 위반이 될 수 있습니다.',
        en: 'Proposing cross-Region replication where data-residency rules apply — it can violate them.' }
    ]
  },

  leastpriv: {
    how_ko: '최소 권한은 "필요한 동작을, 필요한 리소스에, 필요한 조건에서만" 허용하는 것입니다. 실무적으로는 네 개의 조절 장치를 씁니다 — Action을 구체적으로 나열하고, Resource를 ARN으로 좁히고, Condition으로 상황을 제한하고(SourceIp, PrincipalOrgID, MultiFactorAuthPresent, s3:prefix), 위임 시 권한 경계로 상한을 겁니다.\n\n시험에서 이 원칙은 동점 상황의 결정자로 쓰입니다. 두 선택지가 모두 요구 기능을 제공하면, 권한 범위가 좁은 쪽이 정답입니다.',
    how_en: 'Least privilege means allowing only the needed actions, on the needed resources, under the needed conditions. In practice there are four dials: enumerate specific Actions, narrow Resource to ARNs, restrict with Conditions (SourceIp, PrincipalOrgID, MultiFactorAuthPresent, s3:prefix), and cap delegation with permission boundaries.\n\nOn the exam this principle acts as the tie-breaker: when two options both deliver the required function, the narrower one is correct.',
    why_ko: '이 원칙 덕분에 즉시 지울 수 있는 표현들이 있습니다 — AdministratorAccess 부여, Action:* / Resource:*, 버킷을 퍼블릭으로, 루트 자격 증명 사용, 액세스 키를 코드에 저장. 이 다섯 개가 보이면 거의 항상 오답입니다.',
    why_en: 'The principle lets you discard certain phrasings immediately: attaching AdministratorAccess, Action:* on Resource:*, making a bucket public, using root credentials, and storing access keys in code. Those five are almost always wrong.',
    traps: [
      { ko: '"나중에 좁히겠다"는 전제로 넓은 권한을 부여하는 선택지 — 시험에서는 항상 오답입니다.',
        en: 'Granting broad permissions on the premise of narrowing later — always wrong on the exam.' }
    ]
  },

  decouple: {
    how_ko: '디커플링은 구성 요소가 서로의 상태·속도·가용성을 몰라도 되게 만드는 설계입니다. 동기 직접 호출에서는 뒷단이 느려지면 앞단이 함께 느려지고, 뒷단이 죽으면 요청이 사라집니다. 사이에 큐나 토픽을 넣으면 앞단은 메시지를 넣고 즉시 응답하고, 뒷단은 자기 속도로 처리하며, 장애 시에도 메시지가 큐에 남아 있습니다.\n\n결과적으로 세 가지가 동시에 좋아집니다 — 버스트 흡수(큐가 버퍼), 독립 확장(각 계층이 자기 지표로 조정), 장애 격리(한쪽이 죽어도 다른 쪽은 계속). SQS는 1:1 작업 분배, SNS는 1:N 브로드캐스트, EventBridge는 내용 기반 라우팅에 씁니다.',
    how_en: 'Decoupling makes components independent of each other\'s state, speed, and availability. With synchronous direct calls, a slow backend slows the frontend and a dead backend loses requests. Inserting a queue or topic lets the frontend enqueue and respond immediately, the backend work at its own pace, and messages survive an outage in the queue.\n\nThree things improve at once: burst absorption (the queue buffers), independent scaling (each tier scales on its own metric), and fault isolation (one side failing does not stop the other). SQS handles one-to-one work distribution, SNS one-to-many broadcast, and EventBridge content-based routing.',
    why_ko: '시험은 "구성 요소를 분리하라", "확장성을 높여라", "한쪽 장애가 전체에 영향을 주지 않게" 같은 표현으로 이 개념을 부릅니다. 정답은 대개 큐나 토픽을 삽입하는 것이며, 동기 호출을 유지하면서 인스턴스만 늘리는 선택지는 오답입니다.',
    why_en: 'The exam invokes this with phrasings like "decouple the components", "increase scalability", and "a failure in one part must not affect the whole". The answer is usually inserting a queue or topic; options that keep synchronous calls and merely add instances are wrong.',
    traps: [
      { ko: '큐를 넣었지만 워커를 고정 대수로 두는 것 — 버스트가 큐에만 쌓이고 처리는 밀립니다. 큐 깊이 기준 ASG가 함께 필요합니다.',
        en: 'Inserting a queue but keeping a fixed worker count — bursts pile up in the queue and processing falls behind. An ASG scaling on queue depth is also needed.' }
    ]
  }
};

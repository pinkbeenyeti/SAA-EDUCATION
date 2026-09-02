/**
 * AWS SAA-C03 Concept Detail Bank
 *
 * One entry per node in KNOWLEDGE_GRAPH. Each entry supplies the text shown
 * when a concept is selected in the mindmap, and each `points[]` entry becomes
 * a leaf node hanging off that concept in the tree.
 *
 *   summary_*  one-line gist, shown under the tree node
 *   desc_*     2-4 sentence explanation
 *   points[]   exam-relevant facts; { ko, en } = leaf label, body_* = detail
 *   pattern_*  optional canonical architecture the exam keeps asking about
 *
 * The 17 services that also exist in AWS_DOMAINS keep their hand-written
 * deep-dive there; this file is what the mindmap itself renders.
 */
const CONCEPT_DETAIL = {

  /* ======================================================================
     COMPUTE
     ====================================================================== */
  ec2: {
    summary_ko: '클라우드의 가상 서버. 구매 옵션 선택이 곧 비용 문제의 정답',
    summary_en: 'Virtual servers in the cloud; the purchase option is usually the answer',
    plain_ko: 'EC2는 실제로 만질 수 있는 물리 서버가 아니라 가상 컴퓨팅 자원입니다. AWS가 가진 거대한 물리 서버 한 대를 여러 고객이 논리적으로 나눠 쓰는데, 그중 내 몫으로 떼어진 "가상의 컴퓨터 한 대"가 EC2 인스턴스입니다. 내 노트북에 운영체제를 깔고 프로그램을 설치하듯, 원격에 있는 이 가상 컴퓨터에 접속해 운영체제를 고르고 프로그램을 설치·실행한다고 생각하면 됩니다.',
    plain_en: 'EC2 is not a physical server you can touch — it is a virtual compute resource. AWS slices one giant physical machine into logically separate shares for many customers, and the share assigned to you is an EC2 instance. It works like installing an OS and programs on your own laptop, except the "computer" is remote: you connect to it, pick an OS, and install and run software on it.',
    desc_ko: 'EC2는 필요한 만큼 가상 머신을 빌려 쓰는 IaaS입니다. 시험에서 EC2 문제는 대부분 "어떤 인스턴스 타입인가"가 아니라 "어떤 구매 옵션이 가장 저렴한가", "어떻게 가용성을 확보하는가"를 묻습니다. 단독 EC2는 거의 정답이 아니며, ALB + Auto Scaling Group + 다중 AZ 조합이 기본형입니다.',
    desc_en: 'EC2 rents virtual machines on demand. Exam questions rarely turn on instance families; they turn on which purchase option is cheapest and how availability is achieved. A lone EC2 instance is almost never the answer — ALB + Auto Scaling Group across multiple AZs is the default shape.',
    points: [
      { ko: '구매 옵션 4종', en: 'Four purchase options',
        body_ko: 'On-Demand(유연, 비쌈) / Spot(최대 90% 할인, 2분 전 중단 경고, 무상태·내결함성 배치용) / Reserved·Savings Plans(1~3년 약정, 최대 72% 할인, 예측 가능한 상시 워크로드) / Dedicated Host(물리 서버 점유, BYOL 라이선스·규제 준수). "중단되어도 괜찮다" → Spot, "24시간 꾸준히 돈다" → RI/Savings Plans.',
        body_en: 'On-Demand (flexible, priciest) / Spot (up to 90% off, 2-minute interruption notice, for stateless fault-tolerant batch) / Reserved & Savings Plans (1–3 year commit, up to 72% off, steady-state) / Dedicated Host (physical tenancy for BYOL licensing and compliance). "Interruption is fine" → Spot. "Runs 24/7" → RI or Savings Plans.' },
      { ko: '배치 그룹 3종', en: 'Placement groups',
        body_ko: 'Cluster는 단일 AZ에 인스턴스를 물리적으로 밀집시켜 최저 지연시간과 최대 100Gbps를 얻습니다(HPC). Spread는 인스턴스마다 별도 랙에 분산해 동시 장애를 막습니다(AZ당 최대 7개). Partition은 파티션 단위로 하드웨어를 격리해 HDFS·Cassandra 같은 대규모 분산 시스템에 씁니다.',
        body_en: 'Cluster packs instances into one AZ for lowest latency and up to 100 Gbps (HPC). Spread puts each instance on distinct racks to avoid correlated failure (max 7 per AZ). Partition isolates hardware per partition for large distributed systems like HDFS or Cassandra.' },
      { ko: 'IAM 역할로 권한 부여', en: 'Grant access with an IAM role',
        body_ko: 'EC2에서 S3·DynamoDB에 접근해야 할 때 액세스 키를 인스턴스에 저장하는 선택지는 항상 오답입니다. 인스턴스 프로파일에 IAM 역할을 붙이면 임시 자격 증명이 자동 교체되며 배포됩니다.',
        body_en: 'Any option that stores access keys on the instance is wrong. Attach an IAM role via an instance profile — temporary credentials are delivered and rotated automatically.' },
      { ko: '상태를 인스턴스에 두지 말 것', en: 'Keep state off the instance',
        body_ko: '여러 EC2가 각자 EBS에 파일을 쓰면 사용자마다 다른 결과를 봅니다. 공유 파일은 EFS, 객체는 S3, 세션은 ElastiCache 또는 DynamoDB로 빼는 것이 정석 패턴입니다.',
        body_en: 'If each EC2 writes to its own EBS volume, users see inconsistent data. Move shared files to EFS, objects to S3, and sessions to ElastiCache or DynamoDB.' }
    ],
    pattern_ko: 'Route 53 → ALB → Auto Scaling Group(다중 AZ) → EC2 → RDS Multi-AZ, 정적 자산은 S3 + CloudFront',
    pattern_en: 'Route 53 → ALB → Auto Scaling Group across AZs → EC2 → RDS Multi-AZ, with static assets on S3 + CloudFront'
  },

  lambda: {
    summary_ko: '서버 없이 이벤트에 반응해 코드를 실행. "운영 부담 최소화"의 단골 정답',
    summary_en: 'Event-driven serverless compute; the usual answer to "least operational overhead"',
    plain_ko: 'Lambda는 서버도 컴퓨터도 아니라, "이 코드를 실행해줘"라고 요청할 때만 잠깐 켜졌다 사라지는 실행 서비스(완전 관리형)입니다. 자판기에 동전을 넣어야 그 순간만 작동하는 것처럼, 이벤트가 들어올 때만 코드가 돌아가고 끝나면 흔적도 없이 사라지며 실행된 시간만큼만 요금이 매겨집니다.',
    plain_en: 'Lambda is not a server or a computer you can point to — it is a fully managed execution service that spins up only when you say "run this code" and disappears right after. Like a vending machine that only springs to life when you drop a coin in, it runs only in response to an event and bills you only for that brief moment of execution.',
    desc_ko: 'Lambda는 서버를 프로비저닝하지 않고 코드를 실행하며 실행 시간만큼만 과금합니다. 문제에 "운영 부담을 최소화", "유휴 비용 없이", "관리형"이 나오면 Lambda가 강력한 후보입니다. 대신 15분 실행 제한이 결정적 제약이며, 이를 넘기면 ECS/Fargate·Batch·Step Functions로 넘어가야 합니다.',
    desc_en: 'Lambda runs code without provisioning servers and bills only for execution time. When a question says "minimize operational overhead", "no idle cost", or "fully managed", Lambda is a strong candidate. The decisive constraint is the 15-minute limit — beyond it, move to ECS/Fargate, Batch, or Step Functions.',
    points: [
      { ko: '15분 실행 제한', en: '15-minute execution limit',
        body_ko: '최대 실행 시간은 900초입니다. "처리에 1시간이 걸린다" 같은 조건이 보이면 Lambda 선택지는 즉시 탈락시키고 ECS/Fargate 태스크나 AWS Batch를 고르세요. 여러 단계를 길게 이어야 하면 Step Functions로 오케스트레이션합니다.',
        body_en: 'Hard cap is 900 seconds. If the scenario says processing takes an hour, eliminate Lambda and pick an ECS/Fargate task or AWS Batch. For long multi-step flows, orchestrate with Step Functions.' },
      { ko: '동시성 두 가지', en: 'Two kinds of concurrency',
        body_ko: 'Reserved Concurrency는 특정 함수에 동시성 상한·전용 풀을 보장해 다른 함수가 계정 한도를 잡아먹지 못하게 합니다. Provisioned Concurrency는 실행 환경을 미리 데워 콜드 스타트를 없앱니다. "지연시간이 일정해야 한다" → Provisioned.',
        body_en: 'Reserved Concurrency caps and reserves a pool for one function so others cannot exhaust the account limit. Provisioned Concurrency pre-warms environments to eliminate cold starts. "Consistent latency" → Provisioned.' },
      { ko: 'VPC 내 리소스 접근', en: 'Reaching resources inside a VPC',
        body_ko: 'Lambda를 VPC에 연결하면 Hyperplane ENI를 통해 프라이빗 서브넷의 RDS 등에 접근합니다. 단, VPC에 붙은 Lambda가 인터넷에 나가려면 NAT 게이트웨이가 필요하고, S3·DynamoDB는 게이트웨이 VPC 엔드포인트로 무료로 나가는 편이 낫습니다.',
        body_en: 'Attaching Lambda to a VPC gives it Hyperplane ENIs to reach private resources such as RDS. A VPC-attached Lambda needs a NAT gateway for internet egress, but S3 and DynamoDB are better reached free of charge through a gateway VPC endpoint.' },
      { ko: '메모리가 곧 CPU', en: 'Memory dial also buys CPU',
        body_ko: '메모리를 128MB~10,240MB 범위에서 올리면 vCPU와 네트워크 대역폭이 비례해 함께 올라갑니다. CPU 바운드 함수는 메모리를 키우면 실행 시간이 줄어 오히려 총비용이 내려가는 경우가 많습니다.',
        body_en: 'Memory from 128 MB to 10,240 MB scales vCPU and network bandwidth proportionally. For CPU-bound functions, more memory often shortens runtime enough to reduce total cost.' }
    ],
    pattern_ko: 'S3 이벤트 알림 또는 API Gateway → Lambda → DynamoDB, 실패분은 SQS 데드레터 큐로',
    pattern_en: 'S3 event notification or API Gateway → Lambda → DynamoDB, with failures routed to an SQS dead-letter queue'
  },

  autoscaling: {
    summary_ko: '수요에 맞춰 인스턴스 수를 자동 조절. 가용성과 비용을 동시에 푸는 열쇠',
    summary_en: 'Automatically adjusts instance count; solves availability and cost together',
    plain_ko: 'Auto Scaling Group은 그 자체로 손에 잡히는 자원이 아니라, EC2 인스턴스 수를 지켜보다가 필요에 따라 늘리고 줄이는 "자동 조절 규칙"입니다. 에어컨의 온도 조절기가 실내 온도를 재고 알아서 켜고 끄는 것처럼, ASG는 트래픽이나 CPU 같은 지표를 보고 서버 대수를 스스로 맞춰 나갑니다.',
    plain_en: 'An Auto Scaling Group is not a tangible resource itself — it is an automated rule that watches your EC2 instance count and adjusts it up or down as needed. Like a thermostat that reads room temperature and switches the AC on or off by itself, an ASG watches a metric such as traffic or CPU and keeps server count matched to it.',
    desc_ko: 'Auto Scaling Group(ASG)은 최소·희망·최대 용량을 정해두고 지표에 따라 인스턴스를 늘리고 줄입니다. 시험에서는 "트래픽이 예측 불가하게 변한다", "장애 인스턴스를 자동 교체" 같은 문장이 ASG를 가리킵니다. ALB와 짝을 이루고 여러 AZ에 걸치는 형태가 표준 정답입니다.',
    desc_en: 'An Auto Scaling Group keeps capacity between a min and max, adding and removing instances on metrics. Phrases like "unpredictable traffic" or "automatically replace failed instances" point at ASG. The standard answer pairs it with an ALB and spans multiple AZs.',
    points: [
      { ko: '조정 정책 종류', en: 'Scaling policy types',
        body_ko: 'Target Tracking은 "CPU 50% 유지"처럼 목표값을 주면 알아서 맞춥니다(가장 흔한 정답). Step Scaling은 임계값 구간별로 증감 폭을 다르게 줍니다. Scheduled Scaling은 "매일 오전 9시에 증설"처럼 시각이 예측될 때 씁니다.',
        body_en: 'Target Tracking holds a metric at a target such as 50% CPU — the most common correct answer. Step Scaling changes capacity by different amounts per threshold band. Scheduled Scaling fits known times, like scaling up every weekday at 9am.' },
      { ko: 'SQS 큐 길이로 조정', en: 'Scale on queue depth',
        body_ko: '워커가 큐를 소비하는 구조라면 CPU가 아니라 큐의 메시지 수(ApproximateNumberOfMessagesVisible) 또는 인스턴스당 백로그를 기준으로 조정해야 합니다. 이 선택지는 디커플링 문제에서 자주 정답입니다.',
        body_en: 'When workers consume a queue, scale on queue depth (ApproximateNumberOfMessagesVisible) or backlog per instance rather than CPU. This option is frequently correct in decoupling questions.' },
      { ko: '상태 확인과 자동 교체', en: 'Health checks and replacement',
        body_ko: 'ASG는 EC2 상태 확인 외에 ELB 상태 확인을 사용할 수 있습니다. ELB 상태 확인을 켜야 애플리케이션이 죽었는데 인스턴스는 살아있는 경우까지 잡아내 교체합니다.',
        body_en: 'Beyond EC2 status checks, an ASG can use ELB health checks. Enabling them catches instances where the OS is alive but the application is not, and replaces them.' },
      { ko: '다중 AZ 분산', en: 'Spread across AZs',
        body_ko: 'ASG를 여러 서브넷(서로 다른 AZ)에 걸쳐 두면 AZ 하나가 통째로 죽어도 서비스가 유지됩니다. "고가용성" 요구가 있으면 단일 AZ 구성 선택지는 모두 오답입니다.',
        body_en: 'Spanning subnets in different AZs keeps the service alive if an entire AZ fails. When the requirement says "highly available", any single-AZ option is wrong.' }
    ]
  },

  ecs: {
    summary_ko: 'AWS 네이티브 컨테이너 오케스트레이션. EC2 또는 Fargate 위에서 구동',
    summary_en: 'AWS-native container orchestration on either EC2 or Fargate',
    plain_ko: 'ECS는 물리 장비가 아니라, 여러 개의 도커 컨테이너를 언제 어디서 실행할지 지시하고 관리하는 관제 서비스(오케스트레이터)입니다. 오케스트라 지휘자가 직접 악기를 연주하지 않고 각 연주자에게 신호를 주듯, ECS는 실제 컴퓨팅(EC2나 Fargate)을 직접 만들지 않고 그 위에서 컨테이너들의 시작·중지·배치를 지휘합니다.',
    plain_en: 'ECS is not physical hardware — it is a control service (an orchestrator) that tells a fleet of Docker containers when and where to run. Like a conductor who never plays an instrument but signals every musician, ECS never supplies the underlying compute itself (that is EC2 or Fargate) — it just directs the starting, stopping, and placement of containers on top of it.',
    desc_ko: 'ECS는 도커 컨테이너를 태스크·서비스 단위로 실행하는 관리형 오케스트레이터입니다. 시험에서는 "컨테이너로 마이그레이션", "Lambda 15분 초과 작업"에서 등장합니다. 시작 유형이 EC2면 인스턴스를 직접 관리하고, Fargate면 서버 관리가 사라집니다.',
    desc_en: 'ECS is a managed orchestrator that runs Docker containers as tasks and services. It appears in "migrate to containers" scenarios and where Lambda exceeds 15 minutes. The EC2 launch type means you manage instances; Fargate removes servers entirely.',
    points: [
      { ko: 'EC2 vs Fargate 시작 유형', en: 'EC2 vs Fargate launch type',
        body_ko: 'EC2 시작 유형은 인스턴스를 직접 패치·확장해야 하지만 Spot·RI로 비용을 크게 낮출 수 있습니다. Fargate는 서버가 아예 보이지 않아 운영 부담이 최소이고, 문제에 "인프라 관리 없이"가 있으면 Fargate가 정답입니다.',
        body_en: 'The EC2 launch type means you patch and scale instances yourself but can cut cost with Spot or RIs. Fargate hides servers entirely; when the question says "without managing infrastructure", Fargate is the answer.' },
      { ko: '태스크 역할 vs 실행 역할', en: 'Task role vs execution role',
        body_ko: '태스크 역할(Task Role)은 컨테이너 안의 애플리케이션이 S3 등 AWS API를 호출할 때 쓰는 권한입니다. 실행 역할(Execution Role)은 ECS 에이전트가 ECR에서 이미지를 당기고 CloudWatch에 로그를 쓸 때 쓰는 권한으로, 둘은 별개입니다.',
        body_en: 'The task role grants the application inside the container permission to call AWS APIs such as S3. The execution role lets the ECS agent pull images from ECR and write logs to CloudWatch. They are separate.' },
      { ko: 'ALB와 동적 포트 매핑', en: 'ALB with dynamic port mapping',
        body_ko: '한 EC2 호스트에 같은 컨테이너를 여러 개 띄우려면 ALB의 동적 포트 매핑을 씁니다. 대상 그룹이 각 태스크의 임의 포트로 라우팅해 밀도를 높입니다.',
        body_en: 'To run several copies of a container on one host, use ALB dynamic port mapping; the target group routes to each task\'s ephemeral port, raising density.' }
    ]
  },

  spot: {
    summary_ko: '남는 용량을 최대 90% 싸게. 중단을 견디는 워크로드 전용',
    summary_en: 'Spare capacity at up to 90% off, for interruption-tolerant work',
    plain_ko: 'Spot은 별도의 서버 종류가 아니라, 이미 있는 EC2 가상 서버를 "AWS가 남는 용량을 쓸 때만, 훨씬 싸게" 빌리는 구매 방식(요금제)일 뿐입니다. 비행기의 스탠바이 티켓처럼 정가보다 훨씬 싸지만, 자리(용량)가 필요해지면 짧은 통보 후 좌석을 내줘야 하는 조건이 붙습니다.',
    plain_en: 'Spot is not a separate kind of server — it is just a purchase option (a pricing plan) for renting the same EC2 virtual machines whenever AWS has spare capacity, at a steep discount. Like a standby airline ticket, it costs far less than full price, but comes with the condition that the seat can be reclaimed on short notice if the airline needs the capacity back.',
    desc_ko: 'Spot 인스턴스는 AWS의 유휴 EC2 용량을 경매식으로 싸게 제공하며, 용량이 필요해지면 2분 전 경고 후 회수됩니다. "내결함성", "중단되어도 재시작 가능", "배치 처리", "가장 비용 효율적"이 함께 나오면 거의 항상 Spot이 정답입니다.',
    desc_en: 'Spot uses idle EC2 capacity at a deep discount and reclaims it with a two-minute warning. When "fault tolerant", "can be restarted", "batch", and "most cost-effective" appear together, Spot is almost always the answer.',
    points: [
      { ko: '쓰면 안 되는 경우', en: 'When not to use Spot',
        body_ko: '상태를 유지해야 하는 데이터베이스, 중단이 곧 장애인 사용자 대면 트랜잭션, 정해진 마감이 있는 단일 실행 작업에는 부적합합니다. 이런 조건이 보이면 On-Demand나 RI로 방향을 트세요.',
        body_en: 'Not for stateful databases, user-facing transactions where interruption equals outage, or single deadline-bound jobs. In those cases move to On-Demand or Reserved.' },
      { ko: 'Spot + On-Demand 혼합', en: 'Mixing Spot and On-Demand',
        body_ko: 'ASG의 혼합 인스턴스 정책으로 기본 용량은 On-Demand로 깔고 초과분만 Spot으로 채우면, 비용을 낮추면서도 최소 가용량을 보장할 수 있습니다. 비용과 가용성을 동시에 요구하는 문제의 정답 형태입니다.',
        body_en: 'An ASG mixed-instances policy can put a baseline on On-Demand and burst on Spot, cutting cost while guaranteeing minimum capacity — the shape that answers questions demanding both.' },
      { ko: '2분 중단 경고', en: 'Two-minute interruption notice',
        body_ko: '회수 전 인스턴스 메타데이터와 EventBridge로 중단 알림이 옵니다. 이 신호를 받아 체크포인트를 저장하거나 작업을 큐로 되돌리도록 설계해야 합니다.',
        body_en: 'A reclaim notice arrives via instance metadata and EventBridge. Design the worker to checkpoint or return the job to a queue when it fires.' }
    ]
  },

  fargate: {
    summary_ko: '컨테이너용 서버리스 실행 환경. EC2 호스트 관리가 사라짐',
    summary_en: 'Serverless compute for containers; no EC2 hosts to manage',
    plain_ko: 'Fargate는 만질 수 있는 서버가 아니라, 컨테이너를 실행할 때 그 뒤에 있는 EC2 호스트 자체를 통째로 안 보이게 만든 서버리스 실행 환경입니다. 셰프에게 필요한 것이 요리할 부엌뿐이듯, 부엌을 소유하거나 관리할 필요 없이 필요한 만큼 빌려 쓰고 끝나면 반납하는 것과 비슷합니다.',
    plain_en: 'Fargate is not a server you can touch — it is a serverless runtime that hides the underlying EC2 host entirely when running your containers. It is like renting a fully equipped kitchen only for the time you need to cook, with no ownership or upkeep of the kitchen itself.',
    desc_ko: 'Fargate는 ECS·EKS의 시작 유형으로, 컨테이너에 필요한 vCPU·메모리만 지정하면 AWS가 실행 환경을 대신 준비합니다. 클러스터 인스턴스 패치·스케일링이 사라져 "운영 부담 최소화" 요구에 잘 맞습니다.',
    desc_en: 'Fargate is a launch type for ECS and EKS: you declare vCPU and memory and AWS provides the runtime. Cluster patching and scaling disappear, which fits "minimize operational overhead".',
    points: [
      { ko: 'Lambda와의 선택 기준', en: 'Choosing between Fargate and Lambda',
        body_ko: '둘 다 서버리스지만 Lambda는 15분·이벤트 기반, Fargate는 장시간 실행·상주 서비스에 적합합니다. "컨테이너 이미지를 그대로 써야 한다", "15분을 넘는다"면 Fargate입니다.',
        body_en: 'Both are serverless, but Lambda is event-driven and capped at 15 minutes while Fargate suits long-running services. "Must use the existing container image" or "runs longer than 15 minutes" → Fargate.' },
      { ko: '비용 트레이드오프', en: 'Cost trade-off',
        body_ko: 'Fargate는 vCPU·메모리 단위 과금이라 사용률이 높고 상시 돌아가는 워크로드에서는 EC2 시작 유형(특히 Spot/RI)보다 비쌉니다. "가장 저렴"을 물으면 EC2 시작 유형이 정답일 수 있습니다.',
        body_en: 'Fargate bills per vCPU and GB, so for steady high-utilisation workloads it costs more than the EC2 launch type with Spot or RIs. If the question asks for cheapest, EC2 launch type may win.' }
    ]
  },

  ami: {
    summary_ko: '인스턴스의 부팅 템플릿. 표준화·빠른 확장·리전 복사의 단위',
    summary_en: 'The boot template for instances: standardisation, fast scaling, cross-Region copy',
    plain_ko: 'AMI는 실행 중인 서버가 아니라, EC2 인스턴스를 부팅할 때 쓰는 "틀"(설치된 OS·소프트웨어·설정을 통째로 얼려 놓은 이미지 파일)입니다. 붕어빵을 구울 때 쓰는 틀처럼, 이 틀 하나로 똑같은 내용물(설정)을 가진 서버를 몇 대든 똑같이 찍어낼 수 있습니다.',
    plain_en: 'An AMI is not a running server — it is a template (a frozen image of an installed OS, software, and settings) used to boot EC2 instances. Like a waffle iron that stamps out identical waffles, one AMI lets you produce any number of servers with exactly the same configuration baked in.',
    desc_ko: 'AMI는 OS·패키지·설정이 구워진 이미지로, 여기서 인스턴스를 찍어냅니다. 부팅 스크립트로 매번 설치하는 대신 미리 구운 골든 AMI를 쓰면 확장 속도가 크게 빨라집니다.',
    desc_en: 'An AMI is a baked image of OS, packages, and configuration used to launch instances. A pre-baked golden AMI scales far faster than installing software at boot time.',
    points: [
      { ko: '골든 AMI로 부팅 시간 단축', en: 'Golden AMI shortens boot time',
        body_ko: '"확장이 너무 느리다"는 문제에서, 사용자 데이터 스크립트로 매번 패키지를 설치하는 대신 필요한 소프트웨어를 미리 포함한 AMI를 만들어 두는 것이 정답입니다.',
        body_en: 'For "scaling is too slow", the fix is a custom AMI with the software pre-installed rather than a user-data script installing it at every launch.' },
      { ko: '리전 간 복사와 공유', en: 'Copy and share across Regions',
        body_ko: 'AMI는 리전에 종속되므로 다른 리전에서 쓰려면 복사해야 합니다. 재해 복구나 다중 리전 배포 문제에서 "AMI를 대상 리전으로 복사"가 필요한 단계로 등장합니다.',
        body_en: 'AMIs are Region-scoped and must be copied to be used elsewhere. Disaster-recovery and multi-Region questions include "copy the AMI to the target Region" as a required step.' },
      { ko: '암호화 상속', en: 'Encryption is inherited',
        body_ko: '암호화된 EBS 스냅샷으로 만든 AMI에서 launch한 인스턴스의 볼륨은 암호화 상태를 유지합니다. 규정 준수 요구가 있으면 AMI 단계부터 암호화를 확인해야 합니다.',
        body_en: 'Instances launched from an AMI built on encrypted snapshots keep encrypted volumes. For compliance requirements, verify encryption at the AMI level.' }
    ]
  },

  reserved: {
    summary_ko: '1~3년 약정으로 최대 72% 할인. 상시 워크로드의 비용 정답',
    summary_en: '1–3 year commitments for up to 72% off — the answer for steady workloads',
    plain_ko: 'Reserved Instances나 Savings Plans는 물리적인 것도, 별도의 서버 종류도 아니라, "1~3년 동안 이 정도는 꾸준히 쓰겠다"고 약속하고 그 대가로 할인을 받는 요금 계약입니다. 휴대폰을 매달 요금제로 약정하면 기기값이나 요금이 싸지는 것과 똑같은 구조입니다.',
    plain_en: 'Reserved Instances and Savings Plans are not a physical thing or a different type of server — they are a billing contract: you commit to a certain amount of usage for one to three years and get a discount in return. It works exactly like signing a phone plan contract, where committing to a term lowers the monthly rate.',
    desc_ko: 'Reserved Instances와 Savings Plans는 일정 사용량을 약정하는 대가로 큰 할인을 줍니다. "24시간 상시 가동", "향후 3년간 안정적 수요", "기존 인스턴스 비용 절감"이 나오면 여기가 정답입니다.',
    desc_en: 'Reserved Instances and Savings Plans trade a usage commitment for a large discount. "Runs 24/7", "predictable demand for three years", or "reduce cost of existing instances" point here.',
    points: [
      { ko: 'RI vs Savings Plans', en: 'RI vs Savings Plans',
        body_ko: 'Standard RI는 할인율이 가장 높지만 인스턴스 패밀리에 묶입니다. Convertible RI는 유연하지만 할인이 덜합니다. Compute Savings Plans는 EC2·Fargate·Lambda에 걸쳐 리전·패밀리 무관하게 적용되어 가장 유연합니다.',
        body_en: 'Standard RIs discount most but lock to a family. Convertible RIs are flexible with less discount. Compute Savings Plans apply across EC2, Fargate, and Lambda regardless of family or Region — the most flexible.' },
      { ko: '결제 옵션', en: 'Payment options',
        body_ko: 'All Upfront(선결제 전액)가 가장 싸고, Partial Upfront, No Upfront 순으로 할인이 줄어듭니다. "선결제 없이 절감"이면 No Upfront Savings Plans가 답입니다.',
        body_en: 'All Upfront is cheapest, then Partial Upfront, then No Upfront. "Save without an upfront payment" → No Upfront Savings Plans.' },
      { ko: 'Organizations 전체 공유', en: 'Sharing across Organizations',
        body_ko: 'RI와 Savings Plans 혜택은 조직 내 계정 간에 공유됩니다. 여러 계정을 쓰는 회사의 비용 절감 문제에서 통합 결제(Consolidated Billing)와 함께 등장합니다.',
        body_en: 'RI and Savings Plans benefits are shared across accounts in an organization, which pairs with consolidated billing in multi-account cost questions.' }
    ]
  },

  eks: {
    summary_ko: '관리형 쿠버네티스. 기존 K8s 자산을 그대로 옮길 때',
    summary_en: 'Managed Kubernetes, for lifting existing K8s workloads',
    plain_ko: 'EKS는 눈에 보이는 서버 묶음이 아니라, 쿠버네티스라는 오픈소스 컨테이너 관리 시스템의 "두뇌"(컨트롤 플레인) 부분을 AWS가 대신 운영해 주는 관리형 서비스입니다. 아파트 관리사무소를 직접 운영하지 않고 위탁 관리 업체에 맡기는 것처럼, 쿠버네티스의 복잡한 운영 부분을 AWS에 맡기고 입주민(컨테이너)만 신경 쓰면 됩니다.',
    plain_en: 'EKS is not a visible cluster of servers — it is a managed service where AWS runs the "brain" (the control plane) of the open-source Kubernetes system on your behalf. Like outsourcing an apartment building management office to a professional firm, you hand off the complex operational work of Kubernetes to AWS and only worry about your own tenants (containers).',
    desc_ko: 'EKS는 쿠버네티스 컨트롤 플레인을 AWS가 운영해 주는 서비스입니다. 시험에서는 "이미 쿠버네티스를 쓰고 있다", "온프레미스 K8s를 마이그레이션한다"처럼 쿠버네티스를 명시할 때 선택합니다. 그런 언급이 없으면 보통 ECS가 더 단순한 정답입니다.',
    desc_en: 'EKS runs the Kubernetes control plane for you. Choose it when the scenario names Kubernetes — "already uses Kubernetes", "migrate on-premises K8s". Without that signal, ECS is usually the simpler correct answer.',
    points: [
      { ko: 'ECS와의 구분 신호', en: 'Signal that separates it from ECS',
        body_ko: '문제에 "Kubernetes", "kubectl", "Helm", "기존 K8s 매니페스트" 같은 단어가 있으면 EKS입니다. 단순히 "컨테이너"라고만 하면 ECS/Fargate가 운영 부담이 더 적어 정답이 되기 쉽습니다.',
        body_en: 'Words like "Kubernetes", "kubectl", "Helm", or "existing manifests" mean EKS. If it only says "containers", ECS/Fargate usually wins on lower operational overhead.' },
      { ko: 'Fargate 프로필', en: 'Fargate profiles',
        body_ko: 'EKS도 Fargate에서 파드를 실행할 수 있어 노드 그룹 관리를 없앨 수 있습니다. "쿠버네티스는 유지하되 노드는 관리하고 싶지 않다"의 정답입니다.',
        body_en: 'EKS can run pods on Fargate, removing node-group management — the answer to "keep Kubernetes but stop managing nodes".' }
    ]
  },

  elasticbeanstalk: {
    summary_ko: '코드만 올리면 환경을 자동 구성하는 PaaS',
    summary_en: 'PaaS that builds the environment from your uploaded code',
    plain_ko: 'Elastic Beanstalk은 그 자체가 서버가 아니라, 코드만 올리면 뒤에서 EC2·로드밸런서·오토스케일링 같은 실제 자원들을 알아서 조립해 주는 관리형 배포 서비스입니다. 이사할 때 가구를 직접 나르지 않고 이삿짐센터에 맡기면 알아서 배치까지 해주는 것과 비슷하며, 필요하면 나중에 그 가구(자원)를 직접 손볼 수도 있습니다.',
    plain_en: 'Elastic Beanstalk is not a server itself — it is a managed deployment service that assembles real resources like EC2, a load balancer, and Auto Scaling behind the scenes once code is uploaded. It is like hiring a moving company that not only moves the furniture but arranges it, while it can still be rearranged (tuned) by hand afterward.',
    desc_ko: 'Elastic Beanstalk은 코드를 업로드하면 EC2·ALB·ASG·모니터링을 자동으로 구성합니다. 인프라는 사용자 계정에 그대로 생성되므로 필요하면 직접 손댈 수 있습니다. "개발자가 인프라를 몰라도 배포", "빠르게 웹앱 올리기"가 신호입니다.',
    desc_en: 'Elastic Beanstalk provisions EC2, ALB, ASG, and monitoring from uploaded code, while the resources remain visible in your account for manual tuning. Signals: "developers should not manage infrastructure", "deploy a web app quickly".',
    points: [
      { ko: '배포 정책', en: 'Deployment policies',
        body_ko: 'All at once(빠르지만 다운타임), Rolling(일부씩 교체), Rolling with additional batch(용량 유지), Immutable(새 인스턴스 세트로 교체, 롤백 안전), Blue/Green(환경 URL 교체). "무중단"이면 Immutable이나 Blue/Green입니다.',
        body_en: 'All at once (fast, has downtime), Rolling, Rolling with additional batch (keeps capacity), Immutable (fresh set, safest rollback), and Blue/Green (swap environment URLs). "Zero downtime" → Immutable or Blue/Green.' },
      { ko: '워커 환경', en: 'Worker environments',
        body_ko: '웹 티어와 별개로 SQS 큐를 소비하는 워커 환경을 만들 수 있습니다. 장시간 백그라운드 처리를 웹 요청과 분리하는 표준 구성입니다.',
        body_en: 'A worker environment consuming an SQS queue can be created alongside the web tier — the standard way to split long background processing from web requests.' }
    ]
  },

  batch: {
    summary_ko: '대규모 배치 작업 스케줄링. 컴퓨팅 자원을 알아서 프로비저닝',
    summary_en: 'Managed batch scheduling that provisions compute for you',
    plain_ko: 'AWS Batch는 컴퓨터가 아니라, 대량의 작업 목록을 넣으면 그때그때 필요한 만큼 EC2나 Fargate 용량을 불러왔다가 끝나면 알아서 치워 주는 관리형 작업 스케줄링 서비스입니다. 공사 현장에 필요한 인부와 장비를 그날그날 딱 필요한 만큼 불러왔다가 일이 끝나면 돌려보내는 인력 파견 업체와 비슷합니다.',
    plain_en: 'AWS Batch is not a computer — it is a managed job-scheduling service that spins up exactly as much EC2 or Fargate capacity as the queued jobs need, then tears it down when finished. It works like a construction staffing agency that calls in exactly the workers and equipment needed for the day and releases them the moment the job is done.',
    desc_ko: 'AWS Batch는 수천 개의 배치 잡을 큐에 넣으면 필요한 EC2·Fargate 용량을 자동으로 띄워 실행하고 끝나면 회수합니다. Lambda의 15분을 넘고 상시 클러스터는 낭비인 대량 처리에 적합합니다.',
    desc_en: 'AWS Batch takes thousands of queued jobs, provisions the EC2 or Fargate capacity to run them, and tears it down afterwards. It fits bulk processing that exceeds Lambda\'s 15 minutes but does not justify a standing cluster.',
    points: [
      { ko: 'Spot과 조합해 비용 절감', en: 'Pair with Spot for cost',
        body_ko: 'Batch의 컴퓨팅 환경을 Spot으로 지정하면 대규모 렌더링·시뮬레이션 비용을 크게 낮출 수 있습니다. 시험에서 "야간 배치 + 최저 비용" 조합의 정답입니다.',
        body_en: 'Configure the Batch compute environment to use Spot to cut rendering or simulation costs — the answer to "overnight batch at lowest cost".' },
      { ko: 'Lambda와의 경계', en: 'Boundary with Lambda',
        body_ko: '짧고 이벤트 기반이면 Lambda, 길고 대량이며 의존성이 무거우면 Batch입니다. "각 작업이 몇 시간 걸린다"는 Batch를 가리킵니다.',
        body_en: 'Short and event-driven → Lambda. Long, bulk, and dependency-heavy → Batch. "Each job takes hours" points to Batch.' }
    ]
  },

  placement: {
    summary_ko: '인스턴스의 물리 배치를 제어해 지연시간 또는 내결함성을 확보',
    summary_en: 'Controls physical placement for latency or fault isolation',
    plain_ko: '배치 그룹은 새로운 자원이 아니라, 이미 만든 EC2 인스턴스들을 물리적으로 어떻게 나란히 놓을지 지정하는 설정값입니다. 눈에 보이지는 않지만 실제 데이터센터 안의 랙·전원·네트워크 배치에 직접 영향을 주는, 좌석 배치도를 미리 지정해두는 것과 같은 개념입니다.',
    plain_en: 'A placement group is not a new resource — it is a setting that dictates how already-created EC2 instances are physically arranged relative to each other. It cannot be seen directly, but it really does control rack, power, and network placement in the data center, much like reserving a specific seating chart in advance.',
    desc_ko: '배치 그룹은 EC2 인스턴스를 물리적으로 어떻게 놓을지 지정합니다. 목적이 최저 지연시간인지, 동시 장애 회피인지에 따라 세 종류 중 하나를 고르는 단순한 문제로 출제됩니다.',
    desc_en: 'Placement groups control how instances sit on physical hardware. Questions reduce to picking one of three based on whether the goal is lowest latency or avoiding correlated failure.',
    points: [
      { ko: 'Cluster — 최저 지연시간', en: 'Cluster — lowest latency',
        body_ko: '단일 AZ 안에 인스턴스를 밀집시켜 노드 간 지연을 최소화하고 최대 100Gbps 대역폭을 얻습니다. HPC, 머신러닝 학습, 대규모 데이터 셔플에 씁니다. 대신 AZ 하나가 죽으면 전부 죽습니다.',
        body_en: 'Packs instances in one AZ for minimal inter-node latency and up to 100 Gbps. Used for HPC, ML training, and heavy shuffles — but an AZ failure takes everything down.' },
      { ko: 'Spread — 최대 격리', en: 'Spread — maximum isolation',
        body_ko: '인스턴스마다 별도 랙(전원·네트워크 분리)에 배치해 하드웨어 장애가 겹치지 않게 합니다. AZ당 최대 7개 인스턴스 제한이 있어 소수의 중요 인스턴스에 씁니다.',
        body_en: 'Places each instance on distinct racks with separate power and network, limited to seven per AZ — for a small number of critical instances.' },
      { ko: 'Partition — 분산 시스템', en: 'Partition — distributed systems',
        body_ko: '인스턴스를 파티션 그룹으로 나누고 파티션끼리 하드웨어를 공유하지 않게 합니다. HDFS, HBase, Cassandra처럼 복제본을 파티션에 나눠 두는 시스템에 맞습니다.',
        body_en: 'Groups instances into partitions that share no hardware, matching systems like HDFS, HBase, and Cassandra that place replicas per partition.' }
    ]
  },

  outposts: {
    summary_ko: 'AWS 하드웨어를 고객 데이터센터에 설치. 진짜 온프레미스가 필요할 때',
    summary_en: 'AWS hardware installed in your data centre for genuine on-premises needs',
    plain_ko: 'Outposts는 가상의 개념이 아니라 실제로 만질 수 있는 물리 하드웨어입니다. AWS가 관리하는 서버 랙을 트럭으로 실어와 고객의 실제 건물(데이터센터·공장)에 설치해 주는 것으로, 클라우드처럼 보이지만 진짜 철제 랙이 바닥에 놓여 있는 물리 장비입니다.',
    plain_en: 'Outposts is not a virtual concept — it is genuine physical hardware. AWS ships an actual server rack it manages and installs it inside the customer real building (a data center or factory floor); it looks and behaves like the cloud, but there is a real steel rack sitting on the floor.',
    desc_ko: 'Outposts는 AWS가 관리하는 랙을 고객 시설에 직접 설치해 동일한 API로 EC2·EBS·S3를 로컬에서 쓰게 합니다. "데이터가 물리적으로 건물을 떠날 수 없다", "공장 설비와 초저지연 통신"처럼 클라우드로 옮길 수 없는 제약이 있을 때만 정답입니다.',
    desc_en: 'Outposts places AWS-managed racks in your facility so EC2, EBS, and S3 run locally through the same APIs. It is only correct when data physically cannot leave the site or ultra-low latency to local equipment is required.',
    points: [
      { ko: '언제 정답인가', en: 'When it is the answer',
        body_ko: '데이터 상주(data residency) 규정, 로컬 설비와의 밀리초 미만 통신, 완전한 오프라인 운영 요구가 명시될 때입니다. 단순히 "하이브리드"라고만 하면 Direct Connect나 Storage Gateway가 더 적절합니다.',
        body_en: 'Data-residency rules, sub-millisecond links to local equipment, or fully disconnected operation. If the scenario merely says "hybrid", Direct Connect or Storage Gateway fits better.' }
    ]
  },

  /* ======================================================================
     STORAGE
     ====================================================================== */
  s3: {
    summary_ko: '무제한 객체 스토리지. 시험에서 가장 자주 등장하는 서비스',
    summary_en: 'Effectively unlimited object storage — the most-tested service on the exam',
    plain_ko: 'S3는 컴퓨터의 하드디스크 같은 물리 장치가 아니라, 파일을 맡겨두는 창고 서비스(관리형 스토리지)입니다. 하드디스크처럼 폴더를 파고 그 안에 파일을 넣는 게 아니라, 파일 하나하나(오브젝트)에 고유한 이름(키)을 붙여 커다란 창고(버킷)에 넣어둡니다. 그 파일이 실제로 어느 서버, 어느 디스크에 저장되는지는 AWS가 알아서 처리하고, 사용자는 "이 이름의 파일을 넣어줘 / 꺼내줘"라고만 요청하면 됩니다.',
    plain_en: 'S3 is not a physical disk like the hard drive in your computer — it is a managed storage service, more like a warehouse you hand files to. Instead of folders, every file (an object) gets a unique name (a key) and goes into a big warehouse (a bucket). AWS decides which physical server and disk actually holds it; you only ever ask "store this named file" or "give me that named file back."',
    desc_ko: 'S3는 11 nines 내구성의 객체 스토리지로, 정적 파일·백업·데이터 레이크·로그 저장소로 쓰입니다. 시험 문제의 40% 가까이가 S3를 건드리며, 대부분은 스토리지 클래스 선택, 수명주기 전환, 접근 제어, 리전 간 복제 중 하나를 묻습니다.',
    desc_en: 'S3 offers eleven-nines durability for static assets, backups, data lakes, and logs. Nearly 40% of exam questions touch S3, and most reduce to storage-class choice, lifecycle transitions, access control, or cross-Region replication.',
    points: [
      { ko: '접근 제어 우선순위', en: 'Access-control priority',
        body_ko: '버킷을 공개하지 않고 특정 대상에게만 열어야 할 때: 같은 계정 애플리케이션이면 IAM 역할, 교차 계정이면 버킷 정책, CloudFront 경유면 OAC(Origin Access Control), 임시 다운로드 링크면 사전 서명 URL(Presigned URL)입니다. ACL은 레거시라 정답이 되는 경우가 드뭅니다.',
        body_en: 'Same-account app → IAM role. Cross-account → bucket policy. Through CloudFront → Origin Access Control. Temporary download link → presigned URL. ACLs are legacy and rarely correct.' },
      { ko: 'Multipart Upload', en: 'Multipart Upload',
        body_ko: '단일 PUT은 5GB가 한계입니다. 100MB를 넘으면 Multipart Upload가 권장되고 5GB 초과 객체는 필수입니다. 파트를 병렬로 올려 처리량을 높이고 실패한 파트만 재전송하므로 대용량 객체나 불안정한 회선에서 유리합니다. 완료되지 않은 멀티파트 업로드는 보이지 않는 곳에서 요금이 계속 발생하므로 수명주기 규칙으로 정리해야 합니다.',
        body_en: 'A single PUT caps at 5 GB. Multipart Upload is recommended above 100 MB and required above 5 GB. Parts upload in parallel for higher throughput and only failed parts are retried, which helps with large objects and flaky links. Incomplete multipart uploads keep billing invisibly, so clean them up with a lifecycle rule.' },
      { ko: 'Transfer Acceleration', en: 'Transfer Acceleration',
        body_ko: '전 세계에 흩어진 사용자가 하나의 버킷으로 업로드할 때 가까운 엣지 로케이션을 거쳐 AWS 백본으로 전달합니다. 문제에 "지리적으로 분산된 사용자"와 "업로드 속도"가 같이 나오면 이것이 정답입니다. 같은 리전 안에서만 올리는 경우에는 이득이 없고 추가 요금만 붙습니다. CloudFront는 내려받기(배포) 가속이고 이쪽은 올리기 가속이라는 점을 구분해야 합니다.',
        body_en: 'Routes uploads from geographically dispersed users through a nearby edge location onto the AWS backbone. When a question pairs "globally dispersed users" with upload speed, this is the answer. It brings no benefit for same-Region uploads and only adds cost. Distinguish it from CloudFront, which accelerates downloads, not uploads.' },
      { ko: '리전 간·리전 내 복제', en: 'Replication',
        body_ko: 'CRR(Cross-Region Replication)은 재해 복구와 지연시간 감소, SRR(Same-Region Replication)은 로그 집계와 계정 분리에 씁니다. 복제를 켜려면 원본과 대상 모두 버전 관리가 활성화되어야 합니다.',
        body_en: 'CRR serves disaster recovery and latency; SRR serves log aggregation and account separation. Both require versioning enabled on source and destination.' },
      { ko: '이벤트 알림', en: 'Event notifications',
        body_ko: '객체 생성·삭제 시 Lambda, SQS, SNS, EventBridge로 알림을 보낼 수 있습니다. "업로드되면 자동으로 처리"라는 문장은 거의 항상 S3 이벤트 → Lambda 구조를 가리킵니다.',
        body_en: 'Object creation or deletion can notify Lambda, SQS, SNS, or EventBridge. "Process automatically on upload" almost always means S3 event → Lambda.' }
    ],
    pattern_ko: 'S3(원본) + CloudFront(OAC) 배포, 수명주기로 Glacier 전환, CRR로 DR 리전 복제',
    pattern_en: 'S3 origin behind CloudFront with OAC, lifecycle transitions to Glacier, and CRR to a DR Region'
  },

  ebs: {
    summary_ko: 'EC2에 붙이는 블록 볼륨. 단일 AZ에 묶임',
    summary_en: 'Block volumes for EC2, bound to a single AZ',
    plain_ko: 'EBS는 컴퓨터 안에 내장된 하드디스크가 아니라, 네트워크로 연결해 쓰는 가상의 외장 디스크(블록 스토리지)입니다. 물리적으로는 다른 곳에 있는 저장 장치를 마치 내 컴퓨터에 꽂힌 하드디스크처럼 쓰게 해주는데, 케이블이 실제로 짧아서(같은 AZ 안에서만) 다른 방(AZ)에 있는 컴퓨터에는 꽂을 수 없다는 제약이 있습니다.',
    plain_en: 'EBS is not a hard drive built into a computer — it is a virtual external disk (block storage) attached over the network. Physically the storage sits elsewhere, but it behaves like a drive plugged straight into the machine — except the "cable" is only long enough to reach instances in the same AZ, so it cannot be plugged into a computer in a different room (AZ).',
    desc_ko: 'EBS는 EC2에 연결하는 네트워크 블록 스토리지로 부팅 디스크와 데이터베이스 볼륨에 씁니다. 핵심 제약은 AZ 종속성입니다 — 볼륨은 같은 AZ의 인스턴스에만 붙고, 다른 AZ로 옮기려면 스냅샷을 거쳐야 합니다.',
    desc_en: 'EBS provides network block storage attached to EC2 for boot disks and database volumes. The key constraint is AZ affinity: a volume attaches only within its AZ, and moving it elsewhere requires a snapshot.',
    points: [
      { ko: '볼륨 타입 선택', en: 'Volume types',
        body_ko: 'gp3는 기본 선택으로 IOPS와 처리량을 용량과 독립적으로 설정합니다. st1은 빅데이터·로그 같은 순차 처리량용, sc1은 접근이 드문 저비용 저장용이며 둘 다 부팅 볼륨으로 쓸 수 없습니다. 선택지에 gp2가 보이면 대개 gp3가 같은 성능을 더 싸게 내는 함정입니다.',
        body_en: 'gp3 is the default and decouples IOPS and throughput from size. st1 targets sequential throughput for big data and logs, sc1 targets cold data, and neither can be a boot volume. When gp2 appears as an option it is usually a trap — gp3 delivers the same performance for less.' },
      { ko: '프로비저닝된 IOPS(io1/io2)', en: 'Provisioned IOPS (io1/io2)',
        body_ko: 'gp3로 감당되지 않는 최고 수준 IOPS와 일관된 저지연이 필요한 대형 상용 데이터베이스에 씁니다. io2 Block Express는 단일 볼륨 최대 성능과 함께 Multi-Attach를 지원합니다. 문제에서 "지속적으로 매우 높은 IOPS"나 "일관된 밀리초 미만 지연"을 요구하면 io 계열이지만, 단순히 "높은 처리량"만 나오면 gp3나 st1이 더 저렴한 정답입니다.',
        body_en: 'Use it for large commercial databases that need top-tier IOPS and consistently low latency beyond what gp3 delivers. io2 Block Express adds the highest single-volume performance plus Multi-Attach. "Sustained very high IOPS" or "consistent sub-millisecond latency" points to the io family, but plain "high throughput" is cheaper on gp3 or st1.' },
      { ko: 'Multi-Attach', en: 'Multi-Attach',
        body_ko: '하나의 io1/io2 볼륨을 같은 가용 영역에 있는 EC2 인스턴스 여러 대에 동시에 붙입니다. 단 EBS가 동시 쓰기를 조율해주지 않으므로 클러스터 인식 파일 시스템이 필수이고, 일반 ext4·XFS로 붙이면 데이터가 깨집니다. 가용 영역을 넘지 못하므로 "여러 AZ에서 공유"가 요구되면 정답은 EFS입니다.',
        body_en: 'Attaches one io1/io2 volume to several EC2 instances in the same Availability Zone. EBS does not coordinate concurrent writes, so a cluster-aware file system is mandatory — plain ext4 or XFS will corrupt data. It cannot cross Availability Zones, so "shared across AZs" means EFS instead.' },
      { ko: '스냅샷은 S3에, 증분으로', en: 'Snapshots are incremental and live in S3',
        body_ko: '스냅샷은 증분 저장되며 리전 단위로 보관됩니다. 다른 AZ나 리전에 볼륨을 만들려면 스냅샷을 복사해 복원합니다. Data Lifecycle Manager나 AWS Backup으로 스케줄링합니다.',
        body_en: 'Snapshots are incremental and Region-scoped. To create a volume in another AZ or Region, copy and restore the snapshot. Schedule them with Data Lifecycle Manager or AWS Backup.' },
      { ko: 'Fast Snapshot Restore', en: 'Fast Snapshot Restore',
        body_ko: '스냅샷으로 만든 볼륨은 원래 첫 접근 때 S3에서 블록을 당겨오느라 느립니다(지연 로딩). FSR을 켜두면 그 초기화 지연 없이 처음부터 최대 성능이 나옵니다. "스냅샷에서 복구한 직후에도 즉시 최대 성능"이 요구되면 이것이며, 가용 영역별로 켜야 하고 시간당 요금이 붙습니다.',
        body_en: 'A volume created from a snapshot is normally slow on first touch because blocks are lazily pulled from S3. Fast Snapshot Restore removes that initialization penalty so the volume runs at full performance immediately. Enable it per Availability Zone; it is billed hourly. "Full performance right after restoring a snapshot" points here.' },
      { ko: '볼륨 암호화', en: 'Volume encryption',
        body_ko: 'KMS 기반 암호화는 저장 데이터, 스냅샷, 인스턴스 사이 전송을 모두 보호하며 성능 영향은 거의 없습니다. 기존 볼륨을 암호화하려면 스냅샷 → 암호화 복사 → 복원 경로를 거칩니다.',
        body_en: 'KMS encryption covers data at rest, snapshots, and in-flight traffic to the instance with negligible overhead. To encrypt an existing volume: snapshot, copy with encryption, restore.' },
      { ko: 'EFS와 헷갈리지 말 것', en: 'Do not confuse with EFS',
        body_ko: '여러 인스턴스가 동시에 같은 파일을 읽고 써야 하면 EBS가 아니라 EFS입니다. EBS Multi-Attach는 io1/io2에서 같은 AZ 내 소수 인스턴스만 지원하며 클러스터 파일시스템이 별도로 필요합니다.',
        body_en: 'If several instances must share files concurrently, the answer is EFS, not EBS. EBS Multi-Attach only works on io1/io2 within one AZ and still needs a cluster-aware filesystem.' }
    ]
  },

  efs: {
    summary_ko: '여러 EC2가 동시에 마운트하는 관리형 NFS. 다중 AZ 공유의 정답',
    summary_en: 'Managed NFS mounted by many EC2s at once — the answer for shared multi-AZ files',
    plain_ko: 'EFS는 하드디스크가 아니라, 여러 컴퓨터가 동시에 접속해 같은 폴더를 함께 쓰는 네트워크 공유 파일 저장소(관리형 NFS)입니다. 사무실의 공용 파일 서버(NAS)처럼 여러 사람(여러 EC2)이 동시에 같은 파일을 열고 저장할 수 있고, 용량은 넣는 만큼 자동으로 늘어납니다.',
    plain_en: 'EFS is not a hard drive — it is a shared network file store (managed NFS) that many computers can mount and use at the same time. Like an office shared network drive (NAS), several EC2 instances can open and save the very same files simultaneously, and its capacity grows automatically as data is added.',
    desc_ko: 'EFS는 NFS 프로토콜의 완전 관리형 파일 시스템으로, 여러 AZ의 여러 인스턴스가 동시에 마운트할 수 있고 용량이 자동으로 늘고 줄어듭니다. "인스턴스마다 다른 파일이 보인다", "여러 서버가 공유 스토리지 필요" 문제의 표준 정답입니다.',
    desc_en: 'EFS is a fully managed NFS filesystem that many instances across AZs can mount simultaneously, growing and shrinking automatically. It is the standard answer to "users see different files on each instance" and "servers need shared storage".',
    points: [
      { ko: '리눅스 전용, 윈도우는 FSx', en: 'Linux only; Windows uses FSx',
        body_ko: 'EFS는 NFS라 리눅스 워크로드용입니다. SMB가 필요한 윈도우 파일 공유는 Amazon FSx for Windows File Server가 정답입니다.',
        body_en: 'EFS speaks NFS and serves Linux. Windows file shares needing SMB use Amazon FSx for Windows File Server.' },
      { ko: '스토리지 클래스와 수명주기', en: 'Storage classes and lifecycle',
        body_ko: 'Standard와 One Zone이 있고, 각각 접근이 뜸한 데이터를 IA로 자동 전환하는 수명주기 정책을 지원합니다. 비용 절감 문제에서 "EFS IA로 전환"이 정답으로 나옵니다.',
        body_en: 'Standard and One Zone classes both support lifecycle policies that move infrequently accessed files to IA — the cost-saving answer in EFS questions.' },
      { ko: '성능 모드', en: 'Performance modes',
        body_ko: 'General Purpose가 기본이며 지연시간이 낮습니다. 수천 개 인스턴스가 동시에 접근하는 대규모 병렬 처리에는 Max I/O를 쓰지만 지연시간이 조금 올라갑니다.',
        body_en: 'General Purpose is the low-latency default. Max I/O suits thousands of concurrent clients at the cost of slightly higher latency.' }
    ]
  },

  glacier: {
    summary_ko: '아카이브 전용 초저가 스토리지. 검색 시간이 트레이드오프',
    summary_en: 'Ultra-cheap archival storage; retrieval time is the trade-off',
    plain_ko: 'Glacier는 하드디스크나 서버가 아니라, 거의 열어볼 일 없는 파일을 아주 싼값에 장기 보관해주는 관리형 아카이브 창고 서비스입니다. 이삿짐을 창고 회사에 맡기면 저장료는 싸지만 다시 꺼내려면 시간이 걸리는 것처럼, 저장 비용은 최저 수준이지만 필요할 때 즉시가 아니라 몇 분에서 몇 시간을 기다려야 꺼낼 수 있습니다.',
    plain_en: 'Glacier is not a hard drive or a server — it is a managed archival warehouse service that stores rarely opened files at the lowest possible cost. Like handing boxes to an off-site storage company, storage itself is cheap, but getting a box back is not instant — retrieval can take anywhere from minutes to hours depending on the tier.',
    desc_ko: 'S3 Glacier 계열은 거의 꺼내지 않는 데이터를 최저 비용으로 장기 보관합니다. 시험에서는 보관 기간과 "얼마나 빨리 꺼내야 하는가"를 대조해 세 등급 중 하나를 고르게 합니다.',
    desc_en: 'The S3 Glacier tiers store rarely retrieved data at the lowest cost. Exam questions contrast retention period against how fast the data must come back, choosing among three tiers.',
    points: [
      { ko: '세 등급 구분', en: 'The three tiers',
        body_ko: 'Glacier Instant Retrieval은 밀리초 조회(분기별 접근). Glacier Flexible Retrieval은 분~시간 단위(기존 Glacier). Glacier Deep Archive는 12시간 내외이며 가장 저렴해 7~10년 규제 보관용입니다.',
        body_en: 'Glacier Instant Retrieval returns in milliseconds (quarterly access). Glacier Flexible Retrieval takes minutes to hours. Glacier Deep Archive takes about 12 hours and is cheapest, for 7–10 year regulatory retention.' },
      { ko: '최소 보관 기간', en: 'Minimum storage duration',
        body_ko: 'Flexible Retrieval은 90일, Deep Archive는 180일의 최소 과금 기간이 있습니다. 그 전에 지우면 위약금이 붙으므로 "30일 후 삭제" 같은 조건에서는 Glacier가 오답입니다.',
        body_en: 'Flexible Retrieval bills a 90-day minimum and Deep Archive 180 days. Deleting earlier incurs a charge, so Glacier is wrong for "delete after 30 days".' },
      { ko: 'Vault Lock으로 불변 보관', en: 'Vault Lock for immutability',
        body_ko: 'S3 Glacier Vault Lock 정책을 잠그면 관리자도 삭제할 수 없는 WORM 보관이 됩니다. SEC 17a-4 같은 규제 준수 문제의 정답입니다.',
        body_en: 'Locking a Vault Lock policy yields WORM retention that even administrators cannot delete — the answer for regulations such as SEC 17a-4.' }
    ]
  },

  lifecycle: {
    summary_ko: '나이에 따라 스토리지 클래스를 자동 전환·삭제하는 규칙',
    summary_en: 'Rules that transition or expire objects automatically by age',
    plain_ko: '수명주기 정책은 별도의 저장 장치나 서비스가 아니라, "며칠이 지나면 자동으로 이렇게 하라"고 미리 걸어두는 자동화 규칙(추상적 설정)입니다. 구독 서비스가 일정 기간 안 쓰면 자동으로 등급을 낮추거나 해지하는 것처럼, S3 객체를 시간이 지나면 자동으로 더 싼 등급으로 옮기거나 지우도록 예약해두는 것입니다.',
    plain_en: 'A lifecycle policy is not a separate storage device or service — it is an automation rule (an abstract setting) set up in advance, saying "after N days, do this automatically." Much like a subscription that auto-downgrades or cancels itself after a period of inactivity, it schedules S3 objects to be moved to a cheaper class or deleted once they age past a certain point.',
    desc_ko: '수명주기 정책은 객체가 생성된 뒤 며칠이 지나면 더 싼 클래스로 옮기거나 삭제하도록 자동화합니다. "며칠 후에는 거의 접근하지 않는다"는 문장이 나오면 거의 항상 수명주기 규칙이 정답의 일부입니다.',
    desc_en: 'Lifecycle rules automatically move objects to cheaper classes or delete them after a given age. Whenever a scenario says data is rarely accessed after N days, a lifecycle rule is almost always part of the answer.',
    points: [
      { ko: '전환 vs 만료', en: 'Transition vs expiration',
        body_ko: 'Transition은 클래스를 바꾸고(Standard → IA → Glacier), Expiration은 아예 삭제합니다. 규정상 7년 보관 후 삭제 같은 요구는 두 규칙을 함께 씁니다.',
        body_en: 'Transition changes class (Standard → IA → Glacier); expiration deletes. "Retain seven years then delete" uses both rules together.' },
      { ko: '30일 최소 전환 대기', en: '30-day minimum before IA',
        body_ko: 'Standard에서 Standard-IA나 One Zone-IA로 전환하려면 최소 30일이 지나야 합니다. "업로드 즉시 IA로" 같은 선택지는 이 규칙 때문에 오답입니다.',
        body_en: 'Objects must be at least 30 days old before transitioning to Standard-IA or One Zone-IA, so "move to IA immediately on upload" is wrong.' },
      { ko: 'Intelligent-Tiering과의 선택', en: 'Versus Intelligent-Tiering',
        body_ko: '접근 패턴을 알면 수명주기 규칙이 더 싸고, 패턴을 예측할 수 없으면 Intelligent-Tiering이 정답입니다. "접근 패턴을 알 수 없다"는 문장이 결정적 힌트입니다.',
        body_en: 'Known access patterns favour lifecycle rules; unpredictable patterns favour Intelligent-Tiering. "Access patterns are unknown" is the decisive hint.' },
      { ko: '이전 버전 관리', en: 'Handling noncurrent versions',
        body_ko: '버전 관리가 켜진 버킷에서는 이전 버전에 별도 전환·만료 규칙을 걸 수 있습니다. 버전이 쌓여 비용이 늘어나는 문제의 해법입니다.',
        body_en: 'On versioned buckets, noncurrent versions get their own transition and expiration rules — the fix when accumulated versions inflate cost.' }
    ]
  },

  fsx: {
    summary_ko: '윈도우·고성능 컴퓨팅용 관리형 파일 시스템 제품군',
    summary_en: 'Managed file systems for Windows and high-performance computing',
    plain_ko: 'FSx는 물리 장비가 아니라, 윈도우용·고성능 컴퓨팅용처럼 특정 용도에 맞춰 미리 튜닝된 관리형 파일 시스템 제품군입니다. 목적에 딱 맞는 전용 캐비닛을 통째로 빌리는 것과 비슷해서, 직접 조립하고 유지보수할 필요 없이 SMB나 초고속 병렬 처리 같은 특정 요구에 맞는 파일 저장소를 바로 씁니다.',
    plain_en: 'FSx is not physical equipment — it is a family of managed file systems pre-tuned for a specific purpose, such as Windows file shares or high-performance computing. It is like renting a purpose-built cabinet system rather than assembling one, getting storage matched to a specific need, like SMB compatibility or extreme parallel throughput, without any assembly or upkeep.',
    desc_ko: 'FSx는 목적별 파일 시스템 묶음입니다. 시험에서는 프로토콜과 워크로드로 어느 변형인지 고르게 합니다 — SMB/AD면 Windows, 초고속 병렬 처리면 Lustre입니다.',
    desc_en: 'FSx is a family of purpose-built file systems. Exam questions pick a variant by protocol and workload: SMB and Active Directory → Windows; extreme parallel throughput → Lustre.',
    points: [
      { ko: 'FSx for Windows File Server', en: 'FSx for Windows File Server',
        body_ko: 'SMB 프로토콜과 Active Directory 통합, NTFS 권한을 그대로 지원합니다. 온프레미스 윈도우 파일 서버를 옮기라는 문제의 정답입니다.',
        body_en: 'Supports SMB, Active Directory integration, and NTFS permissions — the answer for migrating an on-premises Windows file server.' },
      { ko: 'FSx for Lustre', en: 'FSx for Lustre',
        body_ko: '초당 수백 GB 처리량의 병렬 파일 시스템으로 HPC, 머신러닝 학습, 유전체 분석에 씁니다. S3와 연동해 객체를 파일처럼 읽고 결과를 다시 S3로 내보낼 수 있습니다.',
        body_en: 'A parallel filesystem delivering hundreds of GB/s for HPC, ML training, and genomics. It links to S3 so objects are read as files and results exported back.' },
      { ko: 'NetApp ONTAP / OpenZFS', en: 'NetApp ONTAP / OpenZFS',
        body_ko: 'ONTAP은 NFS·SMB·iSCSI를 동시에 제공하고 스냅샷·중복 제거 등 온프레미스 NetApp 기능을 그대로 옮길 때 씁니다. OpenZFS는 ZFS 기반 워크로드 마이그레이션용입니다.',
        body_en: 'ONTAP serves NFS, SMB, and iSCSI together with snapshots and deduplication for lifting existing NetApp estates. OpenZFS targets ZFS-based migrations.' }
    ]
  },

  s3class: {
    summary_ko: '접근 빈도와 가용성 요구로 결정되는 S3 등급 선택',
    summary_en: 'Choosing an S3 tier by access frequency and availability need',
    plain_ko: '스토리지 클래스는 별도의 상품이 아니라, 같은 S3 버킷 안에서 "이 파일을 얼마나 빨리, 얼마나 자주 꺼낼 것인가"에 따라 고르는 요금 등급입니다. 같은 택배를 보낼 때 당일 특급으로 보낼지 저렴한 완행으로 보낼지 고르는 것처럼, 담긴 데이터는 같아도 접근 속도와 가격이 다른 등급 중 하나를 선택하는 것입니다.',
    plain_en: 'A storage class is not a separate product — it is a pricing tier chosen within the same S3 bucket, based on how fast and how often a given file will be retrieved. Like choosing express shipping versus slow economy shipping for the same package, the data is identical; only the access speed and price tier differ.',
    desc_ko: 'S3 스토리지 클래스는 저장 단가와 조회 요금·가용성을 맞바꿉니다. 시험은 "얼마나 자주 접근하는가"와 "잃어도 되는가"를 조합해 하나를 고르게 합니다.',
    desc_en: 'S3 storage classes trade storage price against retrieval fees and availability. Questions combine "how often is it accessed" with "can it be lost" to select one.',
    points: [
      { ko: 'Standard vs Standard-IA', en: 'Standard vs Standard-IA',
        body_ko: 'Standard는 자주 접근하는 데이터, Standard-IA는 드물게 접근하지만 필요할 때 즉시 꺼내야 하는 데이터용입니다. IA는 저장은 싸지만 조회 요금이 붙어, 자주 읽으면 오히려 비싸집니다.',
        body_en: 'Standard for frequent access; Standard-IA for infrequent but immediate access. IA stores cheaper but charges per retrieval, so frequent reads make it more expensive.' },
      { ko: 'One Zone-IA의 함정', en: 'The One Zone-IA trap',
        body_ko: '단일 AZ에만 저장해 20% 저렴하지만 그 AZ가 소실되면 데이터가 사라집니다. 재생성 가능한 썸네일·2차 사본에만 쓰고, "중요 데이터"에는 오답입니다.',
        body_en: 'It stores in one AZ for about 20% less, but an AZ loss destroys the data. Use only for reproducible thumbnails or secondary copies — never for critical data.' },
      { ko: 'Intelligent-Tiering', en: 'Intelligent-Tiering',
        body_ko: '접근 패턴을 모니터링해 자동으로 계층을 옮기며 소액의 모니터링 수수료만 받습니다. "접근 패턴이 변하거나 예측 불가"면 이 선택지가 정답입니다.',
        body_en: 'Monitors access and moves objects between tiers for a small monitoring fee. "Changing or unpredictable access patterns" makes this correct.' }
    ]
  },

  s3version: {
    summary_ko: '덮어쓰기·삭제로부터 객체를 보호하고 불변 보관을 구현',
    summary_en: 'Protects objects from overwrite and deletion, and enables immutable retention',
    plain_ko: '버전 관리는 저장 장치가 아니라, 버킷에 켜두는 하나의 설정(기능)으로, 파일을 덮어쓰거나 지워도 예전 버전을 계속 남겨두는 "되돌리기 기록" 같은 개념입니다. 문서 작업 프로그램의 변경 기록 추적 기능처럼, 실수로 덮어쓰거나 지운 파일도 이전 버전으로 되돌릴 수 있게 해줍니다.',
    plain_en: 'Versioning is not a storage device — it is a setting (a feature) turned on for a bucket that keeps every prior copy of a file even after it is overwritten or deleted, much like a document editor version history. It allows a file that was accidentally overwritten or removed to be rolled back to an earlier version instead of being lost.',
    desc_ko: '버전 관리를 켜면 덮어쓰기와 삭제가 새 버전이나 삭제 마커를 만들 뿐 원본을 지우지 않습니다. Object Lock을 더하면 정해진 기간 동안 누구도 지울 수 없는 WORM 저장소가 됩니다.',
    desc_en: 'Versioning turns overwrites and deletes into new versions or delete markers instead of destroying data. Adding Object Lock produces WORM storage that nobody can delete for a set period.',
    points: [
      { ko: '실수 삭제 복구', en: 'Recovering accidental deletes',
        body_ko: '버전 관리 버킷에서 삭제하면 삭제 마커만 생기므로 마커를 지우면 객체가 되살아납니다. "실수로 지운 파일을 복구하고 싶다"의 정답입니다.',
        body_en: 'Deleting in a versioned bucket only adds a delete marker; removing the marker restores the object — the answer to "recover accidentally deleted files".' },
      { ko: 'MFA Delete', en: 'MFA Delete',
        body_ko: '버전 영구 삭제와 버전 관리 중단에 MFA를 요구하도록 강제할 수 있습니다. 루트 사용자만 설정 가능하며, 악의적 삭제 방지 요구에 등장합니다.',
        body_en: 'Requires MFA to permanently delete versions or suspend versioning. Only the root user can enable it; it appears in malicious-deletion scenarios.' },
      { ko: 'Object Lock 두 모드', en: 'Two Object Lock modes',
        body_ko: 'Governance 모드는 특별 권한이 있으면 해제 가능하고, Compliance 모드는 루트 계정조차 보관 기간 내 삭제할 수 없습니다. 엄격한 규제 문제는 Compliance가 정답입니다.',
        body_en: 'Governance mode can be overridden with a special permission; Compliance mode blocks deletion even by the root account until the retention period expires. Strict regulations → Compliance.' },
      { ko: '복제의 전제 조건', en: 'Prerequisite for replication',
        body_ko: 'CRR·SRR을 켜려면 원본과 대상 버킷 모두 버전 관리가 활성화되어야 합니다. 복제 문제에서 빠진 단계로 자주 출제됩니다.',
        body_en: 'CRR and SRR require versioning on both source and destination buckets — a step frequently missing from replication answer choices.' }
    ]
  },

  /* ======================================================================
     DATABASE
     ====================================================================== */
  rds: {
    summary_ko: '관리형 관계형 데이터베이스. 가용성은 Multi-AZ, 읽기 확장은 복제본',
    summary_en: 'Managed relational database: Multi-AZ for availability, replicas for read scale',
    plain_ko: 'RDS는 직접 설치한 데이터베이스 서버가 아니라, MySQL·PostgreSQL 같은 기존 데이터베이스 엔진을 AWS가 대신 설치·패치·백업까지 관리해 주는 관리형 서비스입니다. 개인 정비사를 고용하는 대신, 원래 몰던 차종(익숙한 DB 엔진)을 그대로 몰되 정비와 관리는 전문 카센터(AWS)에 맡기는 것과 같습니다.',
    plain_en: 'RDS is not a database server installed by hand — it is a managed service where AWS installs, patches, and backs up a familiar engine such as MySQL or PostgreSQL. It is like still driving the same car model as always (the familiar database engine), but handing all the maintenance and repairs over to a professional garage (AWS) instead of doing it directly.',
    desc_ko: 'RDS는 MySQL·PostgreSQL·MariaDB·Oracle·SQL Server를 관리형으로 제공하며 패치·백업·장애 조치를 대신합니다. 시험에서 RDS 문제는 거의 항상 두 축 중 하나입니다 — 가용성을 묻는가(Multi-AZ), 읽기 성능을 묻는가(읽기 전용 복제본). 이 둘을 바꿔 놓은 오답 선택지가 매우 흔합니다.',
    desc_en: 'RDS runs MySQL, PostgreSQL, MariaDB, Oracle, and SQL Server as a managed service handling patching, backup, and failover. Almost every RDS question turns on one of two axes: availability (Multi-AZ) or read performance (read replicas). Swapping the two is the most common distractor.',
    points: [
      { ko: 'Multi-AZ는 가용성 전용', en: 'Multi-AZ is for availability only',
        body_ko: '대기 인스턴스에 동기 복제하지만 읽기를 받지 않습니다. 장애 시 DNS가 자동으로 대기 인스턴스로 전환됩니다. "읽기 성능 향상"을 Multi-AZ로 답하는 선택지는 오답입니다.',
        body_en: 'The standby replicates synchronously but serves no reads; failover swings DNS to it automatically. Any option claiming Multi-AZ improves read performance is wrong.' },
      { ko: '읽기 전용 복제본은 성능 전용', en: 'Read replicas are for performance',
        body_ko: '비동기 복제로 최대 15개까지 만들 수 있고 다른 리전에도 둘 수 있습니다. 읽기 부하 분산과 분석 쿼리 격리에 쓰며, 수동 승격으로 재해 복구에도 활용됩니다.',
        body_en: 'Asynchronous, up to 15 replicas, optionally cross-Region. They offload reads and isolate analytics, and can be promoted manually for disaster recovery.' },
      { ko: 'RDS Proxy로 연결 폭주 완화', en: 'RDS Proxy for connection storms',
        body_ko: 'Lambda나 오토스케일링 그룹처럼 인스턴스가 수시로 뜨고 내려가는 구조에서는 DB 연결 수가 폭증해 "too many connections"로 죽습니다. RDS Proxy가 연결 풀을 대신 관리해 데이터베이스가 보는 연결 수를 일정하게 유지합니다. 페일오버 때의 재접속도 프록시가 흡수해 전환 시간이 크게 줄어듭니다. "Lambda 동시 실행이 늘면서 DB 연결이 고갈된다"가 나오면 인스턴스 크기를 키우는 선택지가 아니라 프록시가 정답입니다.',
        body_en: 'When instances churn — Lambda concurrency or an Auto Scaling group — database connections explode and the engine fails with "too many connections". RDS Proxy pools connections so the database sees a steady count, and it absorbs reconnects during failover, cutting switchover time sharply. If a question describes Lambda concurrency exhausting DB connections, the answer is the proxy, not a bigger instance.' },
      { ko: '백업과 복원', en: 'Backups and restore',
        body_ko: '자동 백업은 최대 35일 보존되며 그 범위 안에서 특정 시점 복원(PITR)이 가능합니다. 더 길게 보관하려면 수동 스냅샷을 뜹니다.',
        body_en: 'Automated backups retain up to 35 days and enable point-in-time restore within that window. Manual snapshots keep data longer.' },
      { ko: '자격 증명 관리', en: 'Credential handling',
        body_ko: 'DB 비밀번호를 코드나 환경 변수에 두는 선택지는 오답입니다. Secrets Manager에 저장해 자동 교체하거나 IAM 데이터베이스 인증을 씁니다.',
        body_en: 'Storing DB passwords in code or environment variables is wrong. Use Secrets Manager with rotation, or IAM database authentication.' }
    ],
    pattern_ko: 'RDS Multi-AZ(쓰기) + 읽기 전용 복제본(읽기) + ElastiCache(반복 조회) + Secrets Manager(자격 증명)',
    pattern_en: 'RDS Multi-AZ for writes, read replicas for reads, ElastiCache for hot queries, Secrets Manager for credentials'
  },

  dynamodb: {
    summary_ko: '서버리스 NoSQL. 한 자릿수 밀리초 지연과 무제한 확장',
    summary_en: 'Serverless NoSQL with single-digit millisecond latency and unbounded scale',
    plain_ko: 'DynamoDB는 서버나 인스턴스가 아니라, 용량 계획이나 서버 사양 걱정 없이 데이터를 저장하고 꺼내 쓰는 완전 관리형 서버리스 데이터베이스입니다. 크기를 미리 정할 필요 없는 무한히 늘어나는 서랍장처럼, 데이터가 얼마나 쌓이든 AWS가 뒤에서 알아서 공간을 늘려주고 사용자는 항목을 넣고 빼는 것만 신경 쓰면 됩니다.',
    plain_en: 'DynamoDB is not a server or an instance — it is a fully managed, serverless database with no capacity planning or server specs to worry about. Think of it as a drawer cabinet that expands infinitely without ever choosing its size in advance: no matter how much data piles up, AWS grows the space behind the scenes and the user just worries about putting items in and taking them out.',
    desc_ko: 'DynamoDB는 키-값·문서 데이터베이스로 용량 계획 없이 확장되고 관리 부담이 거의 없습니다. "수백만 사용자", "밀리초 응답", "스키마가 유연", "서버리스"가 함께 나오면 DynamoDB입니다. 반대로 복잡한 조인이나 트랜잭션 리포팅이 필요하면 RDS/Aurora로 갑니다.',
    desc_en: 'DynamoDB is a key-value and document store that scales without capacity planning and needs almost no administration. "Millions of users", "millisecond response", "flexible schema", and "serverless" point here; complex joins and reporting point back to RDS or Aurora.',
    points: [
      { ko: 'On-Demand vs 프로비저닝 용량 모드', en: 'On-Demand vs provisioned capacity',
        body_ko: 'On-Demand는 트래픽이 예측 불가하거나 급증할 때 용량 계획 없이 씁니다. Provisioned는 꾸준한 부하에서 더 저렴하며 Auto Scaling과 함께 씁니다. "예측할 수 없는 스파이크"는 On-Demand가 정답입니다.',
        body_en: 'On-Demand suits unpredictable or spiky traffic with no capacity planning. Provisioned is cheaper for steady load, paired with auto scaling. "Unpredictable spikes" → On-Demand.' },
      { ko: 'DAX로 읽기 캐싱', en: 'DAX for read caching',
        body_ko: '읽기가 지배적이고 마이크로초 지연이 필요하면 DynamoDB Accelerator(DAX)를 앞에 둡니다. 애플리케이션 코드 변경이 거의 없다는 점이 ElastiCache와의 차이입니다.',
        body_en: 'For read-heavy workloads needing microsecond latency, put DAX in front. Unlike ElastiCache, it needs almost no application change.' },
      { ko: 'Global Tables', en: 'Global Tables',
        body_ko: '여러 리전에 다중 쓰기 가능한 복제 테이블을 만들어 전 세계 사용자에게 낮은 지연을 제공합니다. "다중 리전 액티브-액티브"의 정답입니다.',
        body_en: 'Multi-Region, multi-active replicated tables give worldwide users low latency — the answer for "multi-Region active-active".' },
      { ko: 'TTL과 Streams', en: 'TTL and Streams',
        body_ko: 'TTL 속성으로 만료된 항목을 무료로 자동 삭제합니다(세션 데이터에 유용). DynamoDB Streams는 변경 사항을 Lambda로 흘려보내 이벤트 기반 처리를 만듭니다.',
        body_en: 'TTL attributes delete expired items automatically at no cost (useful for sessions). DynamoDB Streams pipe changes to Lambda for event-driven processing.' },
      { ko: '시점 복구(PITR)와 백업', en: 'Point-in-time recovery and backups',
        body_ko: 'PITR을 켜면 최근 35일 안의 임의 시점(초 단위)으로 새 테이블에 복구할 수 있습니다. 실수로 지운 데이터를 되돌리는 시나리오의 정답입니다. 다만 35일이 상한이므로 "7년 보관" 같은 장기 보존이 요구되면 PITR이 아니라 AWS Backup의 보존 정책을 씁니다. 복구는 항상 새 테이블로 이뤄지며 원본을 덮어쓰지 않습니다.',
        body_en: 'With PITR enabled you can restore to any second within the last 35 days, into a new table — the answer for undoing an accidental delete. But 35 days is the ceiling, so long retention such as "keep 7 years" calls for AWS Backup retention policies instead. A restore always creates a new table and never overwrites the original.' }
    ]
  },

  aurora: {
    summary_ko: 'AWS가 재작성한 MySQL·PostgreSQL 호환 엔진. 성능과 가용성 모두 상위',
    summary_en: 'AWS-rebuilt MySQL/PostgreSQL-compatible engine with higher performance and availability',
    plain_ko: 'Aurora는 완전히 새로운 데이터베이스 제품이 아니라, MySQL·PostgreSQL과 똑같은 방식으로 조작하되 내부 엔진과 저장 구조를 AWS가 처음부터 다시 설계해서 더 빠르고 튼튼하게 만든 관리형 서비스입니다. 겉모습과 운전 방법(호환 인터페이스)은 늘 타던 차와 같지만, 그 밑의 엔진과 서스펜션(스토리지 계층)을 AWS가 통째로 새로 만든 것과 비슷합니다.',
    plain_en: 'Aurora is not a brand-new database product — it is a managed service operated exactly like MySQL or PostgreSQL, while AWS rebuilt the engine and storage layer underneath from scratch for more speed and durability. The dashboard and driving feel (the compatible interface) match the car always driven, but AWS rebuilt the engine and suspension (the storage layer) entirely underneath.',
    desc_ko: 'Aurora는 스토리지를 3개 AZ에 6중 복제하는 분산 계층 위에 올려 표준 RDS보다 빠르고 견고합니다. "MySQL 호환을 유지하면서 성능·가용성을 크게 높여라"는 요구의 정답이며, 사용량이 들쭉날쭉하면 Serverless v2가 답이 됩니다.',
    desc_en: 'Aurora places a MySQL/PostgreSQL-compatible engine on storage replicated six ways across three AZs, outperforming standard RDS. It answers "keep MySQL compatibility but raise performance and availability", and Serverless v2 answers intermittent usage.',
    points: [
      { ko: '스토리지 구조', en: 'Storage architecture',
        body_ko: '3개 AZ에 6개 사본을 두고 자동으로 복구하며, 최대 128TB까지 스스로 확장합니다. 인스턴스 장애와 스토리지 장애가 분리되어 복구가 빠릅니다.',
        body_en: 'Six copies across three AZs with self-healing, growing automatically to 128 TB. Separating instance failure from storage failure makes recovery fast.' },
      { ko: 'Aurora Serverless v2', en: 'Aurora Serverless v2',
        body_ko: '초 단위로 용량을 늘리고 줄여 간헐적·예측 불가 워크로드에 맞습니다. "가끔만 쓰는 개발·테스트 DB 비용 절감"의 정답입니다.',
        body_en: 'Scales capacity in seconds for intermittent or unpredictable workloads — the answer for cutting cost on rarely used dev and test databases.' },
      { ko: 'Global Database', en: 'Global Database',
        body_ko: '보조 리전으로 1초 미만 지연의 복제를 제공하고 1분 내외로 승격할 수 있습니다. 낮은 RPO·RTO를 요구하는 재해 복구 문제의 정답입니다.',
        body_en: 'Replicates to secondary Regions with sub-second lag and promotes in about a minute — the answer for low RPO and RTO disaster recovery.' },
      { ko: '복제본 최대 15개', en: 'Up to 15 replicas',
        body_ko: 'Aurora 복제본은 같은 스토리지를 공유해 복제 지연이 매우 짧고, 장애 시 자동 승격 우선순위를 지정할 수 있습니다.',
        body_en: 'Aurora replicas share the same storage, so replication lag is minimal, and failover priority can be assigned.' }
    ]
  },

  readreplica: {
    summary_ko: '읽기 부하를 분산하는 비동기 복제본. 가용성 수단이 아님',
    summary_en: 'Asynchronous copies that spread read load — not an availability mechanism',
    plain_ko: '읽기 전용 복제본은 별도 서비스가 아니라, 원본 데이터베이스의 내용을 그대로 복사해 둔 가상의 사본 데이터베이스입니다. 은행 원장을 그대로 베껴 여러 창구 직원이 각자 조회용으로 들고 있는 사본과 비슷해서, 원본에 새 기록이 생기면 시차를 두고 사본에도 반영되며, 조회(읽기)만 가능하고 원본을 대신하지는 못합니다.',
    plain_en: 'A read replica is not a separate service — it is a virtual copy of the original database, kept in sync with it. It is like photocopying a bank master ledger so several tellers can each keep a copy for lookups: new entries reach the copies a little after they hit the original, and the copies are for reading only, never a stand-in for the master.',
    desc_ko: '읽기 전용 복제본은 원본의 변경을 비동기로 따라가며 SELECT 트래픽을 받습니다. "읽기가 너무 많아 느리다", "분석 쿼리가 운영 DB를 방해한다"는 문제의 정답입니다. 비동기이므로 약간의 지연(replica lag)이 있다는 점이 함정으로 나옵니다.',
    desc_en: 'Read replicas follow the primary asynchronously and serve SELECT traffic. They answer "reads are overwhelming the database" and "analytics queries disturb production". The asynchronous lag is a common trap.',
    points: [
      { ko: 'Multi-AZ와 혼동 주의', en: 'Do not confuse with Multi-AZ',
        body_ko: 'Multi-AZ는 동기 복제이며 읽기를 받지 않는 가용성 장치, 읽기 복제본은 비동기이며 읽기를 받는 성능 장치입니다. 문제의 요구가 "가용성"인지 "성능"인지부터 확인하세요.',
        body_en: 'Multi-AZ is synchronous and serves no reads (availability); read replicas are asynchronous and serve reads (performance). Decide first whether the requirement is availability or performance.' },
      { ko: '리전 간 복제본', en: 'Cross-Region replicas',
        body_ko: '다른 리전에 복제본을 두면 그 지역 사용자의 읽기 지연을 줄이고, 승격해서 재해 복구 대상으로 쓸 수 있습니다.',
        body_en: 'A replica in another Region lowers read latency for local users and can be promoted as a disaster-recovery target.' },
      { ko: '애플리케이션이 엔드포인트를 나눠야 함', en: 'The app must split endpoints',
        body_ko: '복제본을 만들어도 애플리케이션이 읽기를 복제본 엔드포인트로 보내도록 수정해야 효과가 있습니다. Aurora는 리더 엔드포인트가 이를 자동 분산해 줍니다.',
        body_en: 'Creating a replica helps only if the application sends reads to the replica endpoint. Aurora\'s reader endpoint load-balances this automatically.' }
    ]
  },

  elasticache: {
    summary_ko: '인메모리 캐시로 DB 부하를 걷어내고 지연시간을 낮춤',
    summary_en: 'In-memory cache that removes database load and cuts latency',
    plain_ko: 'ElastiCache는 데이터베이스가 아니라, 자주 찾는 정보를 데이터베이스 앞에 미리 꺼내 놓는 관리형 인메모리 임시 저장소입니다. 매번 서류 창고까지 가지 않도록 자주 쓰는 서류를 책상 위 포스트잇에 적어 두는 것과 비슷해서, 같은 질문이 반복될 때 느린 원본 대신 이 빠른 메모를 먼저 보여줍니다.',
    plain_en: 'ElastiCache is not a database — it is a managed in-memory holding area placed in front of a database for frequently requested data. It is like keeping sticky notes with commonly needed facts on a desk instead of walking to the archive room every time — when the same question comes up again, the fast sticky note is checked before the slow original.',
    desc_ko: 'ElastiCache는 Redis 또는 Memcached를 관리형으로 제공합니다. "같은 쿼리가 반복된다", "DB CPU가 포화 상태", "세션 상태를 공유해야 한다"는 문제에서 정답이 됩니다. 두 엔진 중 어느 쪽인지 고르는 문제도 자주 나옵니다.',
    desc_en: 'ElastiCache offers managed Redis or Memcached. It answers "the same query repeats", "the database CPU is saturated", and "sessions must be shared". Choosing between the two engines is itself a common question.',
    points: [
      { ko: 'Redis vs Memcached', en: 'Redis vs Memcached',
        body_ko: 'Redis는 영속성, 복제, 자동 장애 조치, 정렬 집합 같은 자료구조를 지원합니다. Memcached는 단순 캐시이며 멀티스레드로 수평 확장만 합니다. "고가용성", "데이터 유지", "리더보드"가 나오면 Redis입니다.',
        body_en: 'Redis supports persistence, replication, automatic failover, and rich data structures. Memcached is a simple multi-threaded cache that only scales out. "High availability", "durability", or "leaderboard" → Redis.' },
      { ko: '세션 저장소', en: 'Session store',
        body_ko: 'ALB 뒤 여러 EC2가 세션을 공유해야 할 때 ElastiCache Redis에 세션을 두면 무상태 서버가 됩니다. 스티키 세션 대신 권장되는 구조입니다.',
        body_en: 'Storing sessions in ElastiCache Redis makes EC2 instances behind an ALB stateless — preferred over sticky sessions.' },
      { ko: '캐싱 전략', en: 'Caching strategies',
        body_ko: 'Lazy Loading은 미스가 날 때만 채워 메모리를 아끼지만 첫 요청이 느립니다. Write-Through는 쓰기 시 캐시도 갱신해 항상 최신이지만 쓰기가 무거워집니다. TTL로 오래된 데이터를 정리합니다.',
        body_en: 'Lazy loading fills only on a miss, saving memory but slowing first reads. Write-through updates the cache on write, keeping data fresh at the cost of heavier writes. TTLs evict staleness.' }
    ]
  },

  dax: {
    summary_ko: 'DynamoDB 전용 마이크로초 캐시. 코드 변경 없이 붙음',
    summary_en: 'A microsecond cache purpose-built for DynamoDB, with minimal code change',
    plain_ko: 'DAX는 별도의 데이터베이스가 아니라, DynamoDB 전용으로 딱 붙여 쓰는 관리형 초고속 캐시입니다. DynamoDB라는 서랍장 바로 옆에 자주 찾는 물건만 따로 올려둔 작은 트레이라고 생각하면 되고, 이 트레이 덕분에 매번 서랍을 다 뒤지지 않고도 훨씬 빠르게 물건을 찾을 수 있습니다.',
    plain_en: 'DAX is not a separate database — it is a managed high-speed cache built specifically to attach to DynamoDB. Picture it as a small tray of frequently grabbed items sitting right next to the DynamoDB drawer cabinet: thanks to that tray, things are found far faster without digging through the whole cabinet every time.',
    desc_ko: 'DAX는 DynamoDB 앞에 놓는 완전 관리형 인메모리 캐시로 밀리초를 마이크로초로 줄입니다. DynamoDB API와 호환되어 엔드포인트만 바꾸면 되고, ElastiCache처럼 캐시 로직을 직접 짤 필요가 없습니다.',
    desc_en: 'DAX is a fully managed in-memory cache in front of DynamoDB that turns milliseconds into microseconds. It is API-compatible, so only the endpoint changes — no hand-written caching logic as with ElastiCache.',
    points: [
      { ko: 'DynamoDB 전용', en: 'DynamoDB only',
        body_ko: 'DAX는 DynamoDB에만 쓸 수 있습니다. RDS나 다른 데이터 소스를 캐싱해야 하면 ElastiCache가 정답입니다.',
        body_en: 'DAX works only with DynamoDB. Caching RDS or other sources requires ElastiCache.' },
      { ko: '읽기 위주 워크로드용', en: 'For read-heavy workloads',
        body_ko: '쓰기가 많으면 캐시 무효화 비용이 커져 이점이 줄어듭니다. "읽기가 압도적이고 동일 항목을 반복 조회"가 신호입니다.',
        body_en: 'Write-heavy workloads lose benefit to invalidation overhead. The signal is overwhelmingly read-heavy access to the same items.' }
    ]
  },

  documentdb: {
    summary_ko: 'MongoDB 호환 관리형 문서 데이터베이스',
    summary_en: 'Managed MongoDB-compatible document database',
    plain_ko: 'DocumentDB는 MongoDB 그 자체가 아니라, MongoDB와 똑같은 방식으로 다루되 AWS가 서버 운영을 대신 맡아 주는 관리형 문서 데이터베이스입니다. Aurora가 MySQL 호환 방식이듯, DocumentDB는 이미 MongoDB에 익숙한 팀이 사용법을 그대로 유지하면서 운영 부담만 AWS에 넘기는 것입니다.',
    plain_en: 'DocumentDB is not MongoDB itself — it is a managed document database operated the exact same way as MongoDB, while AWS runs the servers. Just as Aurora is MySQL-compatible, DocumentDB lets a team already fluent in MongoDB keep working the same way and simply hand the operational burden to AWS.',
    desc_ko: 'DocumentDB는 MongoDB API와 호환되는 관리형 문서 DB입니다. 시험에서는 "기존 MongoDB 워크로드를 관리 부담 없이 옮겨라"처럼 MongoDB가 명시될 때만 정답입니다.',
    desc_en: 'DocumentDB is a managed document database compatible with the MongoDB API. It is correct only when the scenario names MongoDB, such as "migrate an existing MongoDB workload without managing servers".',
    points: [
      { ko: 'MongoDB가 명시될 때만', en: 'Only when MongoDB is named',
        body_ko: 'MongoDB 언급 없이 단순히 "NoSQL"이나 "유연한 스키마"만 나오면 DynamoDB가 더 흔한 정답입니다.',
        body_en: 'Without an explicit MongoDB mention, "NoSQL" or "flexible schema" usually points to DynamoDB instead.' }
    ]
  },

  neptune: {
    summary_ko: '그래프 데이터베이스. 관계 자체를 질의할 때',
    summary_en: 'Graph database for querying relationships themselves',
    plain_ko: 'Neptune은 표나 문서를 저장하는 일반 데이터베이스가 아니라, "누가 누구와 연결되어 있는가" 같은 관계 자체를 저장하고 따라가는 그래프 전용 관리형 데이터베이스입니다. 압정과 실로 사람들 사이의 인맥을 지도판에 표시해 둔 것처럼, 항목(노드)보다 그 사이를 잇는 연결선(관계)을 찾아내는 데 특화되어 있습니다.',
    plain_en: 'Neptune is not a general-purpose database for tables or documents — it is a managed database purpose-built to store and traverse relationships, like who is connected to whom. Picture a corkboard with pins and string mapping out a social network: it specializes in following the connecting threads (relationships) rather than just the pinned cards (items) themselves.',
    desc_ko: 'Neptune은 노드와 간선으로 이루어진 그래프를 저장하고 질의하는 관리형 DB입니다. 소셜 네트워크, 추천 엔진, 부정 거래 탐지, 지식 그래프처럼 "관계를 따라가는" 질의가 핵심일 때만 정답입니다.',
    desc_en: 'Neptune stores and queries graphs of nodes and edges. It is correct only when traversing relationships is the point: social networks, recommendations, fraud detection, or knowledge graphs.',
    points: [
      { ko: '신호가 되는 표현', en: 'Signal phrases',
        body_ko: '"친구의 친구", "추천 엔진", "관계 탐색", "지식 그래프"가 나오면 Neptune입니다. 그렇지 않으면 거의 항상 오답 선택지입니다.',
        body_en: '"Friends of friends", "recommendation engine", "relationship traversal", or "knowledge graph" mean Neptune. Otherwise it is a distractor.' }
    ]
  },

  /* ======================================================================
     NETWORKING
     ====================================================================== */
  alb: {
    summary_ko: 'HTTP/HTTPS 계층 7 로드 밸런서. 경로·호스트 기반 라우팅',
    summary_en: 'Layer 7 HTTP/HTTPS load balancer with path and host routing',
    plain_ko: 'ALB는 물리적인 로드밸런서 장비가 아니라, 들어오는 요청의 내용(URL 경로 등)을 읽고 알맞은 서버 그룹으로 나눠 보내주는 가상의 관리형 트래픽 안내원입니다. 건물 안내 데스크 직원이 방문객의 용건을 듣고 맞는 부서로 안내하듯, ALB는 요청을 열어보고 그 내용에 따라 목적지를 결정합니다.',
    plain_en: 'An ALB is not a physical load-balancing appliance — it is a virtual, managed traffic director that reads what an incoming request is asking for (like its URL path) and routes it to the right group of servers. Like a front-desk receptionist who listens to a visitor purpose and points them to the correct department, an ALB opens the request and decides its destination based on the content.',
    desc_ko: 'ALB는 요청 내용을 보고 대상 그룹으로 분배하는 계층 7 로드 밸런서입니다. 웹 애플리케이션 문제의 기본값이며, URL 경로나 호스트 헤더로 마이크로서비스를 나누는 구성이 자주 나옵니다.',
    desc_en: 'An ALB inspects request content and routes to target groups at layer 7. It is the default for web applications, often splitting microservices by URL path or host header.',
    points: [
      { ko: 'ALB vs NLB 판단', en: 'Choosing ALB or NLB',
        body_ko: 'HTTP/HTTPS·경로 기반 라우팅·WAF 연동이면 ALB입니다. TCP/UDP, 초고성능, 고정 IP, 극한의 낮은 지연이면 NLB입니다. "고정 IP가 필요하다"는 NLB의 결정적 신호입니다.',
        body_en: 'HTTP/HTTPS, path routing, or WAF integration → ALB. TCP/UDP, extreme throughput, static IPs, or ultra-low latency → NLB. "Static IP required" decisively means NLB.' },
      { ko: '대상 유형', en: 'Target types',
        body_ko: 'EC2 인스턴스, IP 주소, Lambda 함수를 대상으로 지정할 수 있습니다. Lambda를 대상으로 두면 서버 없이 HTTP 엔드포인트를 만들 수 있습니다.',
        body_en: 'Targets can be EC2 instances, IP addresses, or Lambda functions — the last giving an HTTP endpoint with no servers.' },
      { ko: 'SSL 종료와 SNI', en: 'SSL termination and SNI',
        body_ko: 'ACM 인증서를 ALB에 붙여 HTTPS를 종료하고 뒷단은 HTTP로 보낼 수 있습니다. SNI로 하나의 리스너에 여러 도메인 인증서를 올릴 수 있습니다.',
        body_en: 'Attach an ACM certificate to terminate HTTPS at the ALB and speak HTTP behind it. SNI allows multiple domain certificates on one listener.' },
      { ko: '상태 확인과 다중 AZ', en: 'Health checks and multiple AZs',
        body_ko: 'ALB는 최소 2개 AZ의 서브넷을 요구하며, 상태 확인에 실패한 대상으로는 트래픽을 보내지 않습니다. 이것이 고가용성 구성의 기본입니다.',
        body_en: 'An ALB requires subnets in at least two AZs and withholds traffic from targets failing health checks — the basis of a highly available tier.' }
    ]
  },

  vpc: {
    summary_ko: '논리적으로 격리된 사설 네트워크. 모든 아키텍처의 토대',
    summary_en: 'A logically isolated private network underlying every architecture',
    plain_ko: 'VPC는 눈에 보이는 물리 네트워크 장비가 아니라, AWS 클라우드 안에 내 것으로 그어놓은 가상(논리적)의 사설 네트워크 경계선입니다. 실제로는 같은 AWS 데이터센터 설비를 다른 고객들과 함께 쓰지만, VPC 덕분에 마치 나만 쓰는 격리된 사무실 네트워크처럼 IP 대역과 서브넷, 라우팅을 남과 섞이지 않게 독립적으로 구성할 수 있습니다.',
    plain_en: 'A VPC is not a physical networking appliance you can see — it is a virtual (logical) boundary you draw for your own private network inside AWS. You are physically sharing the same underlying AWS data-center hardware with other customers, but the VPC keeps your IP ranges, subnets, and routing walled off and independent, as if you had your own isolated office network.',
    desc_ko: 'VPC는 AWS 안에 만드는 사용자 전용 네트워크로 서브넷·라우팅 테이블·게이트웨이로 구성됩니다. 시험에서는 퍼블릭/프라이빗 서브넷 구분, 인터넷 접근 경로, 온프레미스 연결이 핵심 주제입니다.',
    desc_en: 'A VPC is your own network inside AWS, built from subnets, route tables, and gateways. The exam focuses on public versus private subnets, paths to the internet, and connections to on-premises networks.',
    points: [
      { ko: '퍼블릭 vs 프라이빗 서브넷', en: 'Public vs private subnets',
        body_ko: '차이는 라우팅 테이블뿐입니다. 인터넷 게이트웨이로 향하는 0.0.0.0/0 경로가 있으면 퍼블릭입니다. 데이터베이스는 항상 프라이빗 서브넷에 두는 것이 정답 패턴입니다.',
        body_en: 'The only difference is the route table: a 0.0.0.0/0 route to an internet gateway makes it public. Databases always belong in private subnets.' },
      { ko: '프라이빗에서 인터넷 나가기', en: 'Egress from private subnets',
        body_ko: '프라이빗 서브넷의 인스턴스가 패치를 받으려면 퍼블릭 서브넷의 NAT 게이트웨이를 경유합니다. NAT는 아웃바운드만 허용하고 인바운드 연결은 막습니다.',
        body_en: 'Instances in private subnets reach the internet through a NAT gateway in a public subnet, which permits outbound connections only.' },
      { ko: 'AWS 서비스에 사설로 접근', en: 'Reaching AWS services privately',
        body_ko: 'S3·DynamoDB는 게이트웨이 VPC 엔드포인트(무료), 그 외 대부분의 서비스는 인터페이스 엔드포인트(PrivateLink)로 인터넷을 거치지 않고 접근합니다.',
        body_en: 'S3 and DynamoDB use free gateway VPC endpoints; most other services use interface endpoints (PrivateLink) to stay off the internet.' },
      { ko: 'CIDR 설계', en: 'CIDR planning',
        body_ko: 'VPC CIDR은 생성 후 축소할 수 없고 피어링하려면 대역이 겹치면 안 됩니다. AWS가 각 서브넷에서 5개 IP를 예약한다는 점도 계산에 넣어야 합니다.',
        body_en: 'A VPC CIDR cannot shrink after creation and must not overlap for peering. AWS also reserves five IPs in every subnet.' }
    ]
  },

  cloudfront: {
    summary_ko: '전 세계 엣지 CDN. 지연시간 감소와 오리진 부하 경감',
    summary_en: 'Global edge CDN that cuts latency and offloads the origin',
    plain_ko: 'CloudFront는 특정 장비 하나가 아니라, 전 세계 곳곳에 흩어진 캐시 서버(엣지 로케이션) 네트워크를 관리형으로 빌려 쓰는 서비스입니다. 본사 창고 하나에서 전 세계로 배송하는 대신 동네마다 편의점을 두고 인기 상품을 미리 채워 놓는 것과 비슷해서, 사용자와 가까운 곳에서 바로 콘텐츠를 내려받게 해줍니다.',
    plain_en: 'CloudFront is not a single piece of equipment — it is a managed service that puts content on a worldwide network of cache servers (edge locations). It is like stocking popular items at neighborhood convenience stores instead of shipping everything from one central warehouse, so users can grab content from somewhere close to them.',
    desc_ko: 'CloudFront는 전 세계 엣지 로케이션에 콘텐츠를 캐싱해 사용자와 가까운 곳에서 응답합니다. "전 세계 사용자의 지연시간을 줄여라", "정적 콘텐츠 전송 비용 절감"의 표준 정답이며, S3와 짝을 이룹니다.',
    desc_en: 'CloudFront caches content at edge locations worldwide so responses come from near the user. It is the standard answer to "reduce latency for global users" and "cut delivery cost for static content", usually paired with S3.',
    points: [
      { ko: 'OAC로 S3 비공개 유지', en: 'Keep S3 private with OAC',
        body_ko: 'Origin Access Control을 쓰면 S3 버킷을 비공개로 둔 채 CloudFront만 읽게 할 수 있습니다. 버킷을 퍼블릭으로 여는 선택지는 항상 오답입니다.',
        body_en: 'Origin Access Control lets CloudFront read a bucket that stays private. Any option that makes the bucket public is wrong.' },
      { ko: '서명된 URL·쿠키', en: 'Signed URLs and cookies',
        body_ko: '유료 콘텐츠처럼 접근을 제한하려면 서명된 URL(개별 파일)이나 서명된 쿠키(여러 파일)를 씁니다. S3 사전 서명 URL과 목적은 같지만 엣지에서 동작합니다.',
        body_en: 'Restrict access with signed URLs (single file) or signed cookies (many files) — the edge equivalent of S3 presigned URLs.' },
      { ko: '지리적 제한과 WAF', en: 'Geo restriction and WAF',
        body_ko: '국가 단위 차단은 CloudFront 지리적 제한으로, SQL 인젝션·봇 차단은 AWS WAF를 CloudFront에 연결해 처리합니다.',
        body_en: 'Block by country with CloudFront geo restriction; block SQL injection and bots by attaching AWS WAF to the distribution.' },
      { ko: '동적 콘텐츠도 가속', en: 'It accelerates dynamic content too',
        body_ko: '캐싱하지 않는 요청도 AWS 백본망을 타고 오리진에 도달해 인터넷 경유보다 빠릅니다. "정적 파일만"이라는 통념은 틀립니다.',
        body_en: 'Even uncached requests travel the AWS backbone to the origin, beating the public internet. The "static only" assumption is wrong.' }
    ]
  },

  sgnacl: {
    summary_ko: '보안 그룹은 인스턴스 방화벽(상태 저장), NACL은 서브넷 방화벽(무상태)',
    summary_en: 'Security groups are stateful instance firewalls; NACLs are stateless subnet firewalls',
    plain_ko: '보안 그룹과 NACL은 눈에 보이는 방화벽 장비가 아니라, 누구를 들여보내고 막을지 정해두는 가상의 규칙 목록입니다. 보안 그룹은 한 번 들어온 손님을 나갈 때 다시 검사하지 않는 아파트 현관 경비원(상태 저장)에 가깝고, NACL은 들어올 때든 나갈 때든 매번 명단을 확인하는 건물 정문 경비(무상태)에 가깝습니다.',
    plain_en: 'Security groups and NACLs are not physical firewall boxes — they are virtual rule lists that decide who gets in and who gets blocked. A security group is like an apartment door guard who does not re-check a guest on the way out once let in (stateful); a NACL is like a building front gate guard who checks the list every single time, coming or going (stateless).',
    desc_ko: '두 계층의 차이를 묻는 문제가 반복 출제됩니다. 보안 그룹은 허용 규칙만 있고 상태를 기억하며, NACL은 허용·거부 규칙이 모두 있고 상태를 기억하지 않아 인바운드·아웃바운드를 각각 열어야 합니다.',
    desc_en: 'The distinction is tested repeatedly. Security groups only allow and are stateful; NACLs allow and deny, are stateless, and require both inbound and outbound rules.',
    points: [
      { ko: '상태 저장 vs 무상태', en: 'Stateful vs stateless',
        body_ko: '보안 그룹은 인바운드를 허용하면 응답 아웃바운드가 자동 허용됩니다. NACL은 그렇지 않아 응답 트래픽용 임시 포트(1024-65535) 아웃바운드 규칙이 따로 필요합니다.',
        body_en: 'A security group automatically allows the reply to an allowed inbound flow. A NACL does not, so you must add an outbound rule for ephemeral ports 1024–65535.' },
      { ko: '차단은 NACL로만', en: 'Only NACLs can deny',
        body_ko: '보안 그룹에는 거부 규칙이 없습니다. "특정 IP를 차단하라"는 요구는 NACL의 Deny 규칙이 정답입니다.',
        body_en: 'Security groups have no deny rule. "Block a specific IP address" is answered by a NACL deny rule.' },
      { ko: '보안 그룹을 소스로 지정', en: 'Reference a security group as source',
        body_ko: '웹 티어 보안 그룹을 DB 보안 그룹의 소스로 지정하면 IP를 몰라도 계층 간 통신만 허용됩니다. 최소 권한 네트워크 설계의 정석입니다.',
        body_en: 'Using the web tier\'s security group as the source in the database\'s rule permits tier-to-tier traffic without hard-coded IPs — the least-privilege pattern.' }
    ]
  },

  subnet: {
    summary_ko: 'VPC를 AZ 단위로 나눈 구획. 공개 여부는 라우팅이 결정',
    summary_en: 'AZ-scoped slices of a VPC; routing decides whether they are public',
    plain_ko: '서브넷은 물리적인 구역이 아니라, 하나의 가상 네트워크(VPC)를 논리적으로 잘게 나눈 구획입니다. 큰 사무실 층 하나를 칸막이로 나눠 여러 개의 방을 만드는 것과 같아서, 방마다(서브넷마다) 어떤 문(라우팅)을 통해 밖으로 나갈 수 있는지가 그 방이 공개인지 비공개인지를 결정합니다.',
    plain_en: 'A subnet is not a physical zone — it is a logical slice carved out of one virtual network (a VPC). It is like dividing one large open office floor into separate rooms with partition walls: which door (route) each room has to the outside decides whether that room counts as public or private.',
    desc_ko: '서브넷은 하나의 AZ에 속하며 VPC CIDR의 일부를 차지합니다. 다중 AZ 고가용성은 결국 여러 AZ에 서브넷을 만들고 리소스를 분산하는 일입니다.',
    desc_en: 'A subnet lives in one AZ and takes a slice of the VPC CIDR. Multi-AZ high availability ultimately means creating subnets in several AZs and spreading resources across them.',
    points: [
      { ko: '3계층 서브넷 구성', en: 'Three-tier subnet layout',
        body_ko: '퍼블릭 서브넷에 ALB와 NAT, 프라이빗 서브넷에 애플리케이션 서버, 별도 프라이빗 서브넷에 데이터베이스를 두는 것이 표준입니다. 각 계층을 최소 2개 AZ에 복제합니다.',
        body_en: 'ALB and NAT in public subnets, application servers in private subnets, databases in separate private subnets — each tier duplicated across at least two AZs.' },
      { ko: '예약 IP 5개', en: 'Five reserved IPs',
        body_ko: 'AWS는 각 서브넷에서 네트워크 주소, VPC 라우터, DNS, 예약, 브로드캐스트용으로 5개 IP를 가져갑니다. /28이면 사용 가능한 주소는 11개뿐입니다.',
        body_en: 'AWS reserves five addresses per subnet, so a /28 leaves only eleven usable IPs.' },
      { ko: 'RDS 서브넷 그룹', en: 'RDS subnet groups',
        body_ko: 'RDS를 Multi-AZ로 배포하려면 서로 다른 AZ의 서브넷을 최소 2개 포함하는 DB 서브넷 그룹이 필요합니다.',
        body_en: 'Deploying RDS Multi-AZ requires a DB subnet group containing subnets in at least two different AZs.' }
    ]
  },

  route53: {
    summary_ko: '관리형 DNS. 라우팅 정책과 상태 확인으로 장애 조치까지',
    summary_en: 'Managed DNS whose routing policies and health checks also deliver failover',
    plain_ko: 'Route 53은 물리 서버나 네트워크 장비가 아니라, 도메인 이름을 실제 주소로 바꿔주는 관리형 전화번호부(DNS) 서비스입니다. 단순한 전화번호부와 다른 점은, 안내원이 전화를 연결하기 전에 상대방이 실제로 응답하는지(상태 확인) 먼저 확인하고, 필요하면 다른 지점(대체 리전)으로 돌려준다는 것입니다.',
    plain_en: 'Route 53 is not a physical server or network appliance — it is a managed phone-book service (DNS) that translates domain names into real addresses. Unlike a plain phone book, its operator first checks whether the other end actually answers (a health check) before connecting the call, and reroutes to another branch (a standby Region) when it does not.',
    desc_ko: 'Route 53은 도메인을 AWS 리소스로 연결하고, 라우팅 정책으로 지역·지연시간·가중치에 따라 트래픽을 분배합니다. 다중 리전 아키텍처 문제에서는 어떤 라우팅 정책인지 고르는 것이 핵심입니다.',
    desc_en: 'Route 53 maps domains to AWS resources and distributes traffic by geography, latency, or weight. In multi-Region questions, picking the right routing policy is the whole answer.',
    points: [
      { ko: '라우팅 정책 구분', en: 'Routing policies',
        body_ko: 'Latency는 가장 빠른 리전으로, Geolocation은 사용자 위치 기준으로(규정 준수·콘텐츠 현지화), Weighted는 비율로(카나리 배포), Failover는 상태 확인 실패 시 대기 사이트로 보냅니다.',
        body_en: 'Latency routes to the fastest Region; Geolocation routes by user location (compliance, localisation); Weighted splits by percentage (canary releases); Failover swings to a standby when health checks fail.' },
      { ko: 'Alias 레코드', en: 'Alias records',
        body_ko: 'ALB·CloudFront·S3 웹사이트 엔드포인트를 가리킬 때는 CNAME이 아니라 Alias를 씁니다. 조회 요금이 무료이고 영역 정점(zone apex, example.com)에도 쓸 수 있습니다.',
        body_en: 'Point to ALBs, CloudFront, or S3 website endpoints with Alias records rather than CNAMEs: queries are free and Alias works at the zone apex.' },
      { ko: '상태 확인 기반 장애 조치', en: 'Health-check failover',
        body_ko: '상태 확인을 붙이면 기본 리전이 죽었을 때 자동으로 보조 리전으로 전환합니다. 파일럿 라이트·웜 스탠바이 DR 구성의 트래픽 전환 담당입니다.',
        body_en: 'Attached health checks swing traffic to a secondary Region when the primary fails — the traffic-shifting half of pilot-light and warm-standby DR.' }
    ]
  },

  vpcendpoint: {
    summary_ko: '인터넷을 거치지 않고 AWS 서비스에 접근하는 사설 통로',
    summary_en: 'Private paths to AWS services that never touch the internet',
    plain_ko: 'VPC 엔드포인트는 케이블이나 장비가 아니라, 프라이빗 네트워크 안에서 AWS 서비스로 곧장 이어지는 가상의 사설 통로입니다. 건물 밖으로 나가 빙 돌아가는 대신 사무실끼리 바로 통하는 내부 복도를 뚫어 놓은 것과 비슷해서, 인터넷을 거치지 않고도 S3 같은 서비스에 곧바로 닿을 수 있습니다.',
    plain_en: 'A VPC endpoint is not a cable or a device — it is a virtual private path from inside the network straight to an AWS service. It is like cutting an internal hallway directly between offices instead of walking outside and around the building, reaching a service like S3 without ever touching the internet.',
    desc_ko: 'VPC 엔드포인트는 프라이빗 서브넷의 리소스가 NAT나 인터넷 게이트웨이 없이 AWS 서비스에 닿게 합니다. "인터넷 연결 없이 S3에 접근"이라는 문장이 나오면 거의 항상 정답입니다.',
    desc_en: 'VPC endpoints let private resources reach AWS services without a NAT or internet gateway. "Access S3 without internet connectivity" almost always means an endpoint.',
    points: [
      { ko: '게이트웨이 vs 인터페이스', en: 'Gateway vs interface',
        body_ko: '게이트웨이 엔드포인트는 S3와 DynamoDB 전용이며 라우팅 테이블에 항목을 추가하고 무료입니다. 인터페이스 엔드포인트(PrivateLink)는 ENI를 만들어 대부분의 다른 서비스에 연결하며 시간당 요금이 붙습니다.',
        body_en: 'Gateway endpoints serve only S3 and DynamoDB, add a route-table entry, and are free. Interface endpoints (PrivateLink) create ENIs for most other services and bill hourly.' },
      { ko: 'NAT 비용 절감', en: 'Cutting NAT cost',
        body_ko: 'S3로 대량 데이터를 보내면서 NAT 게이트웨이 데이터 처리 요금이 커지는 문제에서, 게이트웨이 엔드포인트로 바꾸면 그 비용이 사라집니다.',
        body_en: 'When heavy S3 traffic drives up NAT gateway data-processing charges, switching to a gateway endpoint removes the cost entirely.' },
      { ko: '엔드포인트 정책', en: 'Endpoint policies',
        body_ko: '엔드포인트에 정책을 붙여 특정 버킷에만 접근을 허용할 수 있습니다. 데이터 유출 방지 요구의 정답 구성 요소입니다.',
        body_en: 'An endpoint policy can restrict access to specific buckets — a building block for data-exfiltration prevention.' }
    ]
  },

  nlb: {
    summary_ko: '계층 4 로드 밸런서. 초고성능·고정 IP·TCP/UDP',
    summary_en: 'Layer 4 load balancer for extreme throughput, static IPs, and TCP/UDP',
    plain_ko: 'NLB는 물리 장비가 아니라, 요청 내용을 들여다보지 않고 IP·포트 정보만으로 초고속으로 트래픽을 나눠주는 가상의 4계층 로드밸런서입니다. 우편물의 봉투를 뜯지 않고 주소만 보고 분류해 던지는 초고속 우편 분류기와 비슷해서, 내용을 해석하는 ALB보다 훨씬 빠르고 고정된 주소(고정 IP)를 가질 수 있습니다.',
    plain_en: 'An NLB is not physical hardware — it is a virtual layer-4 load balancer that sorts traffic at extreme speed using only IP and port information, without opening the request. It is like a high-speed mail-sorting machine that never opens an envelope, just reads the address and flings it onward — faster than an ALB, which reads the contents, and capable of holding a fixed address (a static IP).',
    desc_ko: 'NLB는 TCP·UDP·TLS를 초당 수백만 요청 규모로 처리하며 AZ마다 고정 IP를 제공합니다. HTTP 라우팅 기능은 없지만 지연시간이 가장 낮습니다.',
    desc_en: 'An NLB handles TCP, UDP, and TLS at millions of requests per second and offers a static IP per AZ. It has no HTTP routing but the lowest latency.',
    points: [
      { ko: '고정 IP가 결정적 신호', en: 'Static IP is the decisive signal',
        body_ko: '"방화벽 화이트리스트에 등록할 고정 IP가 필요하다"가 나오면 ALB가 아니라 NLB입니다. Elastic IP를 AZ별로 붙일 수 있습니다.',
        body_en: '"A static IP to whitelist in a firewall" means NLB, not ALB. Elastic IPs can be assigned per AZ.' },
      { ko: '비-HTTP 프로토콜', en: 'Non-HTTP protocols',
        body_ko: 'MQTT, 게임 서버 UDP, 데이터베이스 프로토콜처럼 HTTP가 아닌 트래픽은 NLB만 처리할 수 있습니다.',
        body_en: 'Non-HTTP traffic such as MQTT, game-server UDP, or database protocols can only be balanced by an NLB.' },
      { ko: '클라이언트 IP 보존', en: 'Client IP preservation',
        body_ko: 'NLB는 원본 클라이언트 IP를 그대로 전달하므로 애플리케이션이 X-Forwarded-For 없이도 실제 IP를 봅니다.',
        body_en: 'An NLB passes the original client IP through, so applications see the real address without X-Forwarded-For.' },
      { ko: 'Gateway Load Balancer는 인라인 검사용', en: 'Gateway Load Balancer is for inline inspection',
        body_ko: 'ALB·NLB와 목적이 다릅니다. GWLB는 트래픽을 방화벽이나 IDS/IPS 같은 서드파티 가상 어플라이언스로 투명하게 통과시키는 3계층 장비입니다. GENEVE 캡슐화를 쓰고 원본 패킷을 그대로 보존하며, 엔드포인트를 통해 라우팅 테이블에 끼워 넣습니다. "모든 트래픽을 보안 어플라이언스로 검사"가 요구되면 GWLB이고, 애플리케이션 트래픽을 분산하는 문제면 ALB나 NLB입니다.',
        body_en: 'It serves a different purpose from ALB and NLB. Gateway Load Balancer transparently steers traffic through third-party virtual appliances such as firewalls and IDS/IPS. It uses GENEVE encapsulation, preserves the original packet, and is inserted into route tables through endpoints. "Inspect all traffic with a security appliance" means GWLB; distributing application traffic means ALB or NLB.' }
    ]
  },

  natgw: {
    summary_ko: '프라이빗 서브넷의 아웃바운드 인터넷 통로. 비용 주의 대상',
    summary_en: 'Outbound internet path for private subnets — and a cost hotspot',
    plain_ko: 'NAT 게이트웨이는 물리 장비가 아니라, 프라이빗한 방 안의 컴퓨터가 밖으로 나갈 때만 문을 열어주는 관리형 가상 출입구입니다. 회사 우편실이 직원이 보내는 편지는 내보내 주지만 낯선 사람이 그 반대로 들어오는 건 막는 것과 비슷해서, 아웃바운드 인터넷 접속만 허용하고 인바운드 연결은 차단합니다.',
    plain_en: 'A NAT gateway is not physical hardware — it is a managed virtual doorway that only opens for private-room computers heading outward. It is like a company mailroom that lets employee outgoing letters through but blocks strangers from walking in the reverse direction: it allows outbound internet access while blocking inbound connections.',
    desc_ko: 'NAT 게이트웨이는 프라이빗 서브넷 인스턴스가 인터넷으로 나가되 밖에서는 들어올 수 없게 합니다. 관리형이며 AZ 단위로 배치하는데, 시간당 요금과 데이터 처리 요금이 모두 붙어 비용 문제의 단골 소재입니다.',
    desc_en: 'A NAT gateway lets private instances reach the internet while blocking inbound connections. It is managed and AZ-scoped, and bills both hourly and per GB — a frequent subject of cost questions.',
    points: [
      { ko: 'AZ마다 하나씩', en: 'One per AZ',
        body_ko: 'NAT 게이트웨이는 AZ에 종속되므로 고가용성을 위해 각 AZ에 하나씩 두고 해당 AZ의 프라이빗 서브넷이 자기 AZ의 NAT를 쓰게 라우팅합니다. 단일 NAT는 그 AZ 장애 시 전체가 끊깁니다.',
        body_en: 'A NAT gateway is AZ-bound, so deploy one per AZ and route each private subnet to the NAT in its own AZ. A single NAT breaks everything when its AZ fails.' },
      { ko: '엔드포인트로 우회', en: 'Bypass with endpoints',
        body_ko: 'S3·DynamoDB 트래픽은 게이트웨이 VPC 엔드포인트로 빼면 NAT 데이터 처리 요금을 내지 않습니다. NAT 비용 절감 문제의 정답입니다.',
        body_en: 'Route S3 and DynamoDB traffic through a gateway VPC endpoint to avoid NAT data-processing charges — the answer for reducing NAT cost.' },
      { ko: 'NAT 인스턴스는 레거시', en: 'NAT instances are legacy',
        body_ko: 'NAT 인스턴스는 직접 관리·확장해야 하고 단일 장애점이 됩니다. 관리 부담 최소화를 묻는 문제에서 NAT 인스턴스는 오답입니다.',
        body_en: 'NAT instances must be managed and scaled by you and form a single point of failure, so they are wrong when the question minimises operational overhead.' }
    ]
  },

  sitevpn: {
    summary_ko: '인터넷 위 암호화 터널로 온프레미스와 VPC를 연결',
    summary_en: 'Encrypted tunnels over the internet linking on-premises to a VPC',
    plain_ko: 'Site-to-Site VPN은 새로운 케이블을 까는 것이 아니라, 이미 있는 공용 인터넷 위에 암호화된 가상의 터널을 뚫어 온프레미스와 VPC를 잇는 방식입니다. 일반 우편 시스템을 그대로 쓰되 내용물을 잠금 서류가방에 넣어 보내는 것과 비슷해서, 별도 공사 없이 몇 시간 만에 안전한 연결을 만들 수 있습니다.',
    plain_en: 'Site-to-Site VPN does not lay new cable — it punches an encrypted virtual tunnel over the existing public internet to connect on-premises to a VPC. It is like using the regular postal system but sending contents inside a locked briefcase: no new construction is needed, and a secure connection can be up in hours.',
    desc_ko: 'Site-to-Site VPN은 고객 게이트웨이와 가상 프라이빗 게이트웨이 사이에 IPsec 터널을 만듭니다. 몇 시간 안에 구축할 수 있어 빠른 하이브리드 연결이나 Direct Connect의 백업으로 쓰입니다.',
    desc_en: 'Site-to-Site VPN builds IPsec tunnels between a customer gateway and a virtual private gateway. It stands up in hours, serving as fast hybrid connectivity or as a Direct Connect backup.',
    points: [
      { ko: 'Direct Connect와의 선택', en: 'Choosing against Direct Connect',
        body_ko: '"빠르게 구축", "저렴하게"는 VPN, "일관된 대역폭", "예측 가능한 지연시간", "대용량 상시 전송"은 Direct Connect입니다. VPN은 인터넷을 타므로 성능이 변동합니다.',
        body_en: '"Set up quickly" and "inexpensive" → VPN. "Consistent bandwidth", "predictable latency", or "large sustained transfer" → Direct Connect. VPN rides the internet, so performance varies.' },
      { ko: 'Direct Connect의 백업', en: 'As a Direct Connect backup',
        body_ko: '전용선이 끊겼을 때를 대비한 저비용 이중화 수단으로 VPN을 함께 구성하는 것이 권장 패턴입니다.',
        body_en: 'Running a VPN alongside Direct Connect is the recommended low-cost redundancy when the dedicated link fails.' }
    ]
  },

  directconnect: {
    summary_ko: '온프레미스와 AWS를 잇는 전용 물리 회선',
    summary_en: 'A dedicated physical circuit between on-premises and AWS',
    plain_ko: 'Direct Connect는 가상의 개념이 아니라, 온프레미스 시설과 AWS 사이에 실제로 깔리는 물리 전용 회선입니다. 인터넷이라는 공용 도로를 타지 않고 회사 건물과 AWS 시설을 잇는 전용 사설 도로를 실제로 포장해 놓은 것이라고 보면 되며, 그만큼 공사에 몇 주에서 몇 달이 걸립니다.',
    plain_en: 'Direct Connect is not a virtual concept — it is an actual physical dedicated circuit laid between an on-premises facility and AWS. Think of it as literally paving a private road between a building and an AWS facility instead of using the shared public highway (the internet) — and like any real road, it takes weeks to months to build.',
    desc_ko: 'Direct Connect는 인터넷을 거치지 않는 전용 회선으로 일관된 대역폭과 낮은 지연시간을 제공하며 데이터 전송 비용도 낮습니다. 구축에 수 주에서 수 개월이 걸린다는 점이 자주 함정으로 나옵니다.',
    desc_en: 'Direct Connect provides a dedicated circuit bypassing the internet, with consistent bandwidth, low latency, and cheaper data transfer. The multi-week to multi-month provisioning time is a common trap.',
    points: [
      { ko: '구축 기간이 함정', en: 'Provisioning time is the trap',
        body_ko: '"이번 주 안에 연결해야 한다" 같은 조건이 있으면 Direct Connect는 오답이고 VPN이 정답입니다. 전용선은 물리 회선 설치가 필요합니다.',
        body_en: 'If the requirement says "connect within a week", Direct Connect is wrong and VPN is right — a physical circuit must be installed.' },
      { ko: '이중화 구성', en: 'Redundancy',
        body_ko: '단일 Direct Connect는 단일 장애점입니다. 두 번째 회선을 다른 로케이션에 두거나 VPN 백업을 붙이는 것이 고가용성 정답입니다.',
        body_en: 'A single connection is a single point of failure; add a second at a different location or a VPN backup for high availability.' },
      { ko: '가상 인터페이스 종류', en: 'Virtual interface types',
        body_ko: 'Private VIF는 VPC의 사설 IP에, Public VIF는 S3 같은 퍼블릭 엔드포인트에, Transit VIF는 Transit Gateway에 연결합니다.',
        body_en: 'A private VIF reaches VPC private IPs, a public VIF reaches public endpoints such as S3, and a transit VIF attaches to a Transit Gateway.' }
    ]
  },

  globalaccel: {
    summary_ko: 'AWS 백본으로 트래픽을 태워 전 세계 지연시간을 낮추는 고정 애니캐스트 IP',
    summary_en: 'Static anycast IPs that pull traffic onto the AWS backbone for lower global latency',
    plain_ko: 'Global Accelerator는 CDN처럼 콘텐츠를 저장해 두는 서비스가 아니라, 사용자를 가장 가까운 AWS 관문으로 끌어들여 그 뒤로는 AWS 전용 고속도로(백본망)를 타게 해주는 관리형 네트워크 가속 서비스입니다. 톨게이트를 지나자마자 막힘없는 전용 고속도로로 바로 올라타는 것과 비슷해서, 콘텐츠를 캐싱하진 않지만 이동 경로 자체를 빠르게 만들어 줍니다.',
    plain_en: 'Global Accelerator does not cache content like a CDN — it is a managed network acceleration service that pulls users into the nearest AWS on-ramp and carries them the rest of the way over AWS own private backbone highway. It is like merging onto a private, uncongested expressway right after the toll gate: it caches nothing, but it makes the journey itself faster.',
    desc_ko: 'Global Accelerator는 두 개의 고정 애니캐스트 IP를 주고 사용자를 가장 가까운 엣지로 끌어들여 AWS 백본으로 전달합니다. CloudFront와 달리 캐싱하지 않으며 비-HTTP 프로토콜과 빠른 리전 장애 조치에 강합니다.',
    desc_en: 'Global Accelerator gives two static anycast IPs, draws users to the nearest edge, and carries traffic over the AWS backbone. Unlike CloudFront it does not cache, and it excels at non-HTTP protocols and fast regional failover.',
    points: [
      { ko: 'CloudFront와의 구분', en: 'Versus CloudFront',
        body_ko: '캐싱 가능한 정적·동적 HTTP 콘텐츠는 CloudFront, TCP/UDP 게임·IoT·음성 트래픽이나 고정 IP가 필요하면 Global Accelerator입니다.',
        body_en: 'Cacheable HTTP content → CloudFront. TCP/UDP gaming, IoT, or voice traffic, or a need for static IPs → Global Accelerator.' },
      { ko: '리전 장애 조치가 빠름', en: 'Fast regional failover',
        body_ko: 'DNS TTL에 의존하지 않고 수십 초 안에 정상 리전으로 트래픽을 옮깁니다. Route 53 장애 조치보다 전환이 빠른 것이 장점입니다.',
        body_en: 'It shifts traffic to a healthy Region within seconds without waiting for DNS TTLs — faster than Route 53 failover.' }
    ]
  },

  vpcpeering: {
    summary_ko: '두 VPC를 1:1로 사설 연결. 전이적 라우팅은 안 됨',
    summary_en: 'One-to-one private link between two VPCs; no transitive routing',
    plain_ko: 'VPC 피어링은 물리적 배선이 아니라, 두 개의 가상 네트워크(VPC) 사이만 직접 잇는 가상의 사설 연결입니다. A 건물과 B 건물 사이에 전용 터널을 뚫었다고 해서 B와 연결된 C 건물까지 그 터널로 갈 수 있는 건 아닌 것처럼, 피어링도 딱 연결한 두 VPC 사이에서만 통하고 건너 건너 전달되지 않습니다.',
    plain_en: 'VPC peering is not physical wiring — it is a virtual private connection linking exactly two virtual networks (VPCs) directly. Just as digging a tunnel between Building A and Building B does not let anyone reach Building C through B own tunnel, peering only works between the two VPCs it directly joins — it never passes through to a third.',
    desc_ko: 'VPC 피어링은 두 VPC 사이에 사설 경로를 만듭니다. 계정과 리전을 넘어 연결할 수 있지만 전이적 라우팅이 불가능하다는 제약이 시험의 핵심입니다.',
    desc_en: 'Peering creates a private path between two VPCs, across accounts and Regions. The exam hinges on one limitation: peering is never transitive.',
    points: [
      { ko: '전이적 라우팅 불가', en: 'Not transitive',
        body_ko: 'A-B, B-C가 연결되어 있어도 A는 C와 통신할 수 없습니다. VPC가 늘어나면 연결 수가 제곱으로 증가하므로 Transit Gateway가 정답이 됩니다.',
        body_en: 'If A peers with B and B with C, A still cannot reach C. As VPC count grows the mesh explodes quadratically, making Transit Gateway the answer.' },
      { ko: 'CIDR 중복 불가', en: 'CIDRs must not overlap',
        body_ko: '두 VPC의 IP 대역이 겹치면 피어링을 만들 수 없습니다. 네트워크 설계 초기에 대역을 나눠야 하는 이유입니다.',
        body_en: 'Overlapping CIDR blocks make peering impossible — the reason to plan address space up front.' }
    ]
  },

  transitgw: {
    summary_ko: '수많은 VPC와 온프레미스를 잇는 중앙 허브',
    summary_en: 'A central hub connecting many VPCs and on-premises networks',
    plain_ko: 'Transit Gateway는 물리 장비가 아니라, 여러 VPC와 온프레미스 네트워크를 한곳으로 모아주는 가상의 중앙 허브 라우터입니다. 각 지점끼리 개별 터널을 뚫는 대신 모든 지점이 하나의 중앙 로터리(허브)로만 연결되게 하는 것과 같아서, 지점이 늘어나도 연결 관리가 훨씬 단순해집니다.',
    plain_en: 'Transit Gateway is not physical hardware — it is a virtual central hub router that gathers many VPCs and on-premises networks into one place. Instead of every branch digging its own tunnel to every other branch, all branches connect to a single central roundabout (the hub), keeping connection management simple even as the number of branches grows.',
    desc_ko: 'Transit Gateway는 허브-스포크 구조로 VPC와 VPN·Direct Connect를 한곳에 모읍니다. 피어링 메시가 복잡해지는 규모에서 정답이 됩니다.',
    desc_en: 'Transit Gateway forms a hub-and-spoke that aggregates VPCs, VPNs, and Direct Connect. It becomes the answer once a peering mesh grows unwieldy.',
    points: [
      { ko: '피어링 메시를 대체', en: 'Replaces the peering mesh',
        body_ko: '"수십 개 VPC를 서로 연결해야 한다"는 문제에서 피어링은 관리 불가능해집니다. Transit Gateway 하나에 모두 붙이면 라우팅이 중앙화됩니다.',
        body_en: 'When dozens of VPCs must interconnect, peering becomes unmanageable; attaching them all to one Transit Gateway centralises routing.' },
      { ko: '라우팅 테이블로 격리', en: 'Isolation via route tables',
        body_ko: 'Transit Gateway 라우팅 테이블을 나누면 특정 VPC끼리만 통신하게 격리할 수 있습니다. 개발·운영 환경 분리에 씁니다.',
        body_en: 'Separate Transit Gateway route tables isolate which VPCs may talk — used to separate development from production.' }
    ]
  },

  /* ======================================================================
     SECURITY & IAM
     ====================================================================== */
  iam: {
    summary_ko: '누가 무엇을 할 수 있는지 정의. 키를 심는 선택지는 항상 오답',
    summary_en: 'Defines who may do what; any option embedding keys is wrong',
    plain_ko: 'IAM은 서버나 소프트웨어가 아니라, "누가 무엇을 할 수 있는가"를 정의해 두는 AWS 전체의 권한 규칙 체계(추상적 개념)입니다. 건물의 출입 카드 발급 사무소이자 규정집이라고 생각하면 되며, 실제 문이나 자물쇠가 아니라 "이 카드로는 몇 층까지 들어갈 수 있다"는 규칙 자체를 관리합니다.',
    plain_en: 'IAM is not a server or piece of software — it is the abstract system of rules across all of AWS that defines who is allowed to do what. Think of it as a building ID-badge office and its rulebook combined: it is not a door or a lock itself, it manages the rules like "this badge opens doors up to floor 5."',
    desc_ko: 'IAM은 사용자·그룹·역할·정책으로 AWS 리소스 접근을 제어합니다. 시험의 IAM 문제는 대부분 "장기 액세스 키를 어딘가에 저장한다"는 오답 선택지를 걸러내고 역할 기반 임시 자격 증명을 고르는 연습입니다.',
    desc_en: 'IAM controls access through users, groups, roles, and policies. Most IAM questions are an exercise in rejecting options that store long-lived access keys and choosing role-based temporary credentials instead.',
    points: [
      { ko: '역할이 거의 항상 정답', en: 'Roles are almost always the answer',
        body_ko: 'EC2·Lambda·ECS가 AWS 서비스를 호출할 때는 역할을 붙입니다. 교차 계정 접근도 역할 수임(AssumeRole)이 정답이며, 계정마다 IAM 사용자를 만드는 선택지는 오답입니다.',
        body_en: 'Attach roles when EC2, Lambda, or ECS call AWS services. Cross-account access is solved by AssumeRole, not by creating IAM users in each account.' },
      { ko: '정책 평가 순서', en: 'Policy evaluation order',
        body_ko: '명시적 Deny가 모든 Allow를 이깁니다. 기본은 암묵적 거부이며, SCP·권한 경계·리소스 정책이 겹치면 교집합만 허용됩니다.',
        body_en: 'An explicit Deny beats every Allow. The default is implicit deny, and where SCPs, permission boundaries, and resource policies overlap only the intersection is allowed.' },
      { ko: '최소 권한과 조건 키', en: 'Least privilege and condition keys',
        body_ko: 'aws:PrincipalOrgID로 조직 내부만, aws:SourceIp로 특정 대역만, aws:MultiFactorAuthPresent로 MFA 사용자만 허용하는 식으로 조건을 좁힙니다.',
        body_en: 'Narrow access with condition keys: aws:PrincipalOrgID for the organization, aws:SourceIp for an address range, aws:MultiFactorAuthPresent for MFA-authenticated callers.' },
      { ko: '루트 계정 보호', en: 'Protect the root account',
        body_ko: '루트는 MFA를 켜고 액세스 키를 삭제한 뒤 일상 작업에 쓰지 않습니다. 루트로 작업하라는 선택지는 언제나 오답입니다.',
        body_en: 'Enable MFA on root, delete its access keys, and never use it for daily work. Any option telling you to use root is wrong.' }
    ]
  },

  kms: {
    summary_ko: '암호화 키의 생성·보관·교체를 맡는 관리형 서비스',
    summary_en: 'Managed creation, storage, and rotation of encryption keys',
    plain_ko: 'KMS는 물리적인 금고가 아니라, 암호화에 쓰는 키를 만들고 보관하고 교체하는 일을 대신해 주는 관리형 서비스입니다. 개인 금고를 사서 직접 관리하는 대신, 열쇠 제작과 보관, 정기적인 자물쇠 교체까지 전부 대행해 주는 보안 업체를 이용하는 것과 비슷합니다.',
    plain_en: 'KMS is not a physical vault — it is a managed service that creates, stores, and rotates the cryptographic keys used for encryption on your behalf. Rather than buying and managing a personal safe, it is like hiring a security firm that cuts the keys, stores them, and periodically changes the locks.',
    desc_ko: 'KMS는 대부분의 AWS 서비스와 통합되어 저장 데이터 암호화를 담당합니다. 시험에서는 AWS 관리형 키와 고객 관리형 키(CMK)의 차이, 자동 교체, 키 정책이 핵심입니다.',
    desc_en: 'KMS integrates with most AWS services to encrypt data at rest. The exam focuses on AWS-managed versus customer-managed keys, automatic rotation, and key policies.',
    points: [
      { ko: '고객 관리형 키를 쓰는 이유', en: 'Why customer-managed keys',
        body_ko: '키 정책을 직접 통제하고, 교체 주기를 정하고, 감사 추적을 남기고, 필요하면 키를 비활성화해 데이터를 즉시 접근 불가로 만들 수 있습니다. "키를 통제해야 한다"는 요구의 정답입니다.',
        body_en: 'They let you control the key policy, set rotation, audit usage, and disable the key to make data instantly inaccessible — the answer to "we must control the keys".' },
      { ko: '자동 교체', en: 'Automatic rotation',
        body_ko: '고객 관리형 키는 연 1회 자동 교체를 켤 수 있고 이전 키 자료는 보관되어 옛 데이터도 계속 복호화됩니다. 더 짧은 주기가 필요하면 수동 교체합니다.',
        body_en: 'Customer-managed keys can rotate annually while retaining old key material so older data still decrypts. Shorter intervals require manual rotation.' },
      { ko: 'CloudHSM과의 구분', en: 'Versus CloudHSM',
        body_ko: 'FIPS 140-2 레벨 3 전용 하드웨어나 키를 AWS조차 접근 못 하게 해야 하는 규제가 있으면 CloudHSM입니다. 그 외에는 KMS가 운영 부담이 훨씬 적습니다.',
        body_en: 'FIPS 140-2 Level 3 dedicated hardware, or a requirement that AWS cannot access the key, means CloudHSM. Otherwise KMS carries far less overhead.' },
      { ko: '봉투 암호화', en: 'Envelope encryption',
        body_ko: 'KMS는 데이터 키를 발급하고 그 키로 실제 데이터를 암호화합니다. 4KB를 넘는 데이터는 직접 암호화하지 않고 이 방식을 씁니다.',
        body_en: 'KMS issues a data key that encrypts the payload; anything larger than 4 KB uses this envelope approach rather than direct KMS encryption.' }
    ]
  },

  iamrole: {
    summary_ko: '임시 자격 증명을 발급하는 권한 묶음. 키 저장의 대안',
    summary_en: 'A permission bundle issuing temporary credentials instead of stored keys',
    plain_ko: 'IAM 역할은 서버나 프로그램 같은 실체가 아니라, "누가 무엇을 할 수 있는가"를 정의해 둔 권한 규칙(추상적 개념)입니다. 사람에게 발급하는 고정된 로그인 계정(IAM 사용자)과 달리, EC2나 Lambda 같은 AWS 서비스가 잠깐 빌려 쓰고 자동으로 반납하는 "임시 신분증"이라고 생각하면 됩니다. 이 신분증은 시간이 지나면 자동으로 새 것으로 바뀌기 때문에, 코드에 고정된 비밀번호(액세스 키)를 박아두는 것보다 훨씬 안전합니다.',
    plain_en: 'An IAM role is not a physical thing like a server — it is an abstract permission rule that answers "who is allowed to do what." Unlike an IAM user (a fixed login account issued to a person), a role is more like a temporary ID badge that an AWS service such as EC2 or Lambda borrows for a short time and automatically returns. Because that badge keeps getting swapped for a fresh one, it is far safer than hard-coding a permanent password (an access key) into your code.',
    desc_ko: 'IAM 역할은 사용자나 서비스가 잠시 수임(assume)해 임시 자격 증명을 얻는 구조입니다. 자격 증명이 자동 교체되고 만료되므로 유출 위험이 낮습니다.',
    desc_en: 'A role is assumed to obtain temporary credentials that rotate and expire automatically, drastically reducing leak risk.',
    points: [
      { ko: '인스턴스 프로파일', en: 'Instance profiles',
        body_ko: 'EC2에 역할을 붙이는 껍데기가 인스턴스 프로파일입니다. 애플리케이션은 인스턴스 메타데이터에서 자격 증명을 자동으로 가져갑니다.',
        body_en: 'An instance profile is the wrapper that attaches a role to EC2; the application picks up credentials automatically from instance metadata.' },
      { ko: '교차 계정 접근', en: 'Cross-account access',
        body_ko: '대상 계정에 신뢰 정책을 가진 역할을 만들고 원본 계정 주체가 수임합니다. 계정마다 사용자를 만들거나 키를 공유하는 선택지는 오답입니다.',
        body_en: 'Create a role with a trust policy in the target account and let the source principal assume it. Creating users per account or sharing keys is wrong.' },
      { ko: '외부 ID와 서비스 연동', en: 'External ID and federation',
        body_ko: '서드파티가 내 계정에 접근할 때는 신뢰 정책에 External ID를 요구해 혼동된 대리인(confused deputy) 공격을 막습니다. 사내 디렉터리 연동은 SAML·IAM Identity Center를 씁니다.',
        body_en: 'Require an External ID in the trust policy when a third party accesses your account, preventing confused-deputy attacks. Corporate directories federate through SAML or IAM Identity Center.' }
    ]
  },

  waf: {
    summary_ko: '계층 7 웹 방화벽. SQL 인젝션·XSS·봇 차단',
    summary_en: 'Layer 7 web firewall blocking SQL injection, XSS, and bots',
    plain_ko: 'WAF는 물리적인 방화벽 장비가 아니라, 웹 요청 하나하나의 내용을 들여다보고 악성 패턴을 걸러내는 가상의 7계층 보안 필터입니다. 신분증만 확인하는 경비원과 달리 가방 속 내용물까지 검사하는 보안 검색대처럼, 요청 안에 SQL 인젝션 같은 위험한 코드가 숨어 있는지 실제 내용을 검사합니다.',
    plain_en: 'WAF is not a physical firewall box — it is a virtual layer-7 security filter that inspects the actual content of each web request for malicious patterns. Unlike a guard who just checks an ID badge, it is like an airport security scanner that looks inside the bag itself, checking whether a request hides dangerous code such as a SQL injection.',
    desc_ko: 'AWS WAF는 CloudFront, ALB, API Gateway 앞에서 HTTP 요청을 검사해 악성 패턴을 차단합니다. 문제에 "SQL 인젝션", "크로스 사이트 스크립팅", "특정 국가 차단", "속도 제한"이 나오면 WAF입니다.',
    desc_en: 'AWS WAF inspects HTTP requests in front of CloudFront, ALB, or API Gateway. "SQL injection", "cross-site scripting", "block a country", or "rate limiting" all point to WAF.',
    points: [
      { ko: 'Shield와의 역할 분담', en: 'Division of labour with Shield',
        body_ko: 'Shield는 네트워크·전송 계층(L3/L4) DDoS를, WAF는 애플리케이션 계층(L7) 공격을 막습니다. 대규모 L7 DDoS는 둘을 함께 씁니다.',
        body_en: 'Shield handles L3/L4 DDoS; WAF handles L7 attacks. Large layer-7 floods use both together.' },
      { ko: '속도 기반 규칙', en: 'Rate-based rules',
        body_ko: '한 IP가 5분간 일정 횟수를 넘으면 자동 차단합니다. 무차별 로그인 시도나 스크래핑 방어의 정답입니다.',
        body_en: 'Automatically block an IP exceeding a request count in five minutes — the answer for brute-force logins and scraping.' }
    ]
  },

  acm: {
    summary_ko: 'SSL/TLS 인증서를 무료로 발급하고 자동 갱신',
    summary_en: 'Free SSL/TLS certificates with automatic renewal',
    plain_ko: 'ACM은 물건이 아니라, 웹사이트의 신원을 증명하는 디지털 인증서(SSL/TLS)를 발급하고 만료 전에 자동으로 갱신해 주는 관리형 서비스입니다. 신분증이 만료되기 전에 자동으로 새 신분증을 발급해 주는 관공서 서비스라고 생각하면 되며, 덕분에 인증서 만료로 갑자기 사이트가 막히는 사고를 막아 줍니다.',
    plain_en: 'ACM is not a physical item — it is a managed service that issues digital certificates (SSL/TLS) proving a website identity and renews them automatically before they expire. Think of it as a government office that automatically reissues an ID before the old one lapses, preventing the outage that happens when a certificate quietly expires.',
    desc_ko: 'ACM은 퍼블릭 인증서를 무료로 발급하고 만료 전에 자동 갱신합니다. "인증서 만료로 장애가 났다", "갱신을 자동화하라"는 문제의 정답입니다.',
    desc_en: 'ACM issues public certificates free and renews them before expiry — the answer to "an expired certificate caused an outage" and "automate renewal".',
    points: [
      { ko: '통합 지점이 정해져 있음', en: 'Fixed integration points',
        body_ko: 'ACM 인증서는 ALB, CloudFront, API Gateway 등에 붙습니다. EC2에 직접 설치할 수는 없으므로 EC2에서 종료해야 하면 직접 인증서를 관리하거나 ACM Private CA를 씁니다.',
        body_en: 'ACM certificates attach to ALB, CloudFront, and API Gateway. They cannot be installed directly on EC2, so terminating there requires your own certificate or ACM Private CA.' },
      { ko: 'CloudFront는 us-east-1', en: 'CloudFront needs us-east-1',
        body_ko: 'CloudFront에 붙일 인증서는 반드시 버지니아 북부(us-east-1)에서 발급해야 합니다. 자주 나오는 함정입니다.',
        body_en: 'A certificate for CloudFront must be issued in us-east-1 — a frequently tested detail.' }
    ]
  },

  secretsmanager: {
    summary_ko: '비밀번호·API 키를 안전하게 보관하고 자동 교체',
    summary_en: 'Stores passwords and API keys securely with automatic rotation',
    plain_ko: 'Secrets Manager는 파일 저장소가 아니라, 비밀번호나 API 키 같은 민감한 값을 암호화해 보관하고 주기적으로 스스로 새 값으로 바꿔주는 관리형 금고 서비스입니다. 은행 대여금고이면서 동시에 정기적으로 자물쇠 비밀번호를 스스로 바꿔주는 서비스라고 생각하면, 코드에 비밀번호를 그대로 박아 넣을 필요가 없어지는 이유를 알 수 있습니다.',
    plain_en: 'Secrets Manager is not a file store — it is a managed vault service that keeps sensitive values like passwords and API keys encrypted and periodically swaps them for new ones on its own. Picture a bank safe-deposit box that also changes its own combination on a schedule — this is why applications no longer need to hard-code a password into their source code.',
    desc_ko: 'Secrets Manager는 자격 증명을 암호화해 보관하고 RDS 등과 연동해 주기적으로 자동 교체합니다. "DB 비밀번호를 코드에서 제거하라", "정기적으로 교체하라"의 정답입니다.',
    desc_en: 'Secrets Manager encrypts credentials and rotates them automatically in concert with services such as RDS — the answer to "remove the database password from code" and "rotate regularly".',
    points: [
      { ko: 'Parameter Store와의 선택', en: 'Versus Parameter Store',
        body_ko: '자동 교체가 필요하면 Secrets Manager, 단순 설정값이고 비용을 아끼려면 Systems Manager Parameter Store(SecureString)입니다. 교체 요구가 결정적 갈림길입니다.',
        body_en: 'Automatic rotation → Secrets Manager. Plain configuration values at lower cost → Systems Manager Parameter Store with SecureString. Rotation is the deciding factor.' },
      { ko: '교차 계정·리전 복제', en: 'Cross-account and replication',
        body_ko: '리소스 정책으로 다른 계정에 공유할 수 있고, 다중 리전 애플리케이션을 위해 시크릿을 다른 리전으로 복제할 수 있습니다.',
        body_en: 'Resource policies share secrets across accounts, and secrets replicate to other Regions for multi-Region applications.' }
    ]
  },

  guardduty: {
    summary_ko: '로그를 기계학습으로 분석해 위협을 탐지',
    summary_en: 'Machine-learning threat detection over your logs',
    plain_ko: 'GuardDuty는 방화벽이 아니라, 계정 안의 로그를 기계학습으로 계속 지켜보며 수상한 움직임을 찾아 알려주는 관리형 감시 서비스입니다. 건물 곳곳의 CCTV 영상을 사람 대신 AI가 24시간 분석해 이상 행동을 발견하면 경고만 울리는 것과 같아서, 직접 문을 잠그거나 침입자를 막지는 않습니다.',
    plain_en: 'GuardDuty is not a firewall — it is a managed monitoring service that uses machine learning to continuously watch account logs and flag suspicious activity. It is like having an AI analyze every security camera footage around the clock instead of a human, sounding an alarm when it spots something odd — but it never locks a door or stops an intruder itself.',
    desc_ko: 'GuardDuty는 CloudTrail, VPC 플로우 로그, DNS 로그를 자동 분석해 비정상 API 호출, 암호화폐 채굴, 손상된 인스턴스 같은 위협을 찾아냅니다. 에이전트 설치가 필요 없습니다.',
    desc_en: 'GuardDuty continuously analyses CloudTrail, VPC flow logs, and DNS logs to surface anomalous API calls, crypto-mining, and compromised instances — with no agents to install.',
    points: [
      { ko: '탐지 전용', en: 'Detection only',
        body_ko: 'GuardDuty는 찾아낼 뿐 차단하지 않습니다. 자동 대응이 필요하면 EventBridge로 결과를 받아 Lambda로 조치합니다.',
        body_en: 'GuardDuty detects but does not block. For automated response, route findings through EventBridge to a Lambda function.' },
      { ko: '유사 서비스 구분', en: 'Distinguishing similar services',
        body_ko: '위협 탐지는 GuardDuty, S3의 민감 데이터 식별은 Macie, EC2·컨테이너 취약점 스캔은 Inspector, 리소스 구성 규정 준수는 Config입니다.',
        body_en: 'Threats → GuardDuty. Sensitive data in S3 → Macie. Vulnerability scanning of EC2 and containers → Inspector. Resource configuration compliance → Config.' }
    ]
  },

  macie: {
    summary_ko: 'S3에서 개인정보·민감 데이터를 자동으로 찾아냄',
    summary_en: 'Automatically discovers PII and sensitive data in S3',
    plain_ko: 'Macie는 별도의 저장소가 아니라, S3 안에 쌓인 파일들을 기계학습으로 훑어 주민번호·카드번호 같은 민감 정보가 들어있는지 찾아주는 관리형 탐지 서비스입니다. 우편물을 하나하나 열어보며 개인정보가 담긴 서류만 골라내는 자동 검수원과 비슷하며, 대상은 오직 S3에 한정됩니다.',
    plain_en: 'Macie is not a storage location — it is a managed detection service that uses machine learning to scan files piling up in S3 for sensitive data such as national IDs or credit-card numbers. It works like an automated mail inspector opening every envelope and pulling out only the ones containing personal information, and its coverage is limited to S3.',
    desc_ko: 'Macie는 머신러닝으로 S3 버킷을 훑어 주민번호·신용카드 번호·여권 번호 같은 민감 정보를 식별하고 공개된 버킷을 경고합니다. "S3에 PII가 있는지 확인하라"는 문제의 정답입니다.',
    desc_en: 'Macie scans S3 with machine learning to identify national IDs, credit-card numbers, and passport numbers, and flags publicly exposed buckets — the answer to "find PII stored in S3".',
    points: [
      { ko: 'S3 전용', en: 'S3 only',
        body_ko: 'Macie는 S3만 대상으로 합니다. RDS나 EBS의 민감 데이터를 찾으라는 문제에서는 오답입니다.',
        body_en: 'Macie covers only S3, so it is wrong when the question asks about sensitive data in RDS or EBS.' }
    ]
  },

  inspector: {
    summary_ko: 'EC2·컨테이너 이미지·Lambda의 취약점을 지속 스캔',
    summary_en: 'Continuous vulnerability scanning of EC2, container images, and Lambda',
    plain_ko: 'Inspector는 사람이 아니라, EC2·컨테이너 이미지·Lambda 코드에 알려진 보안 취약점(CVE)이 있는지 계속 자동으로 스캔해 알려주는 관리형 서비스입니다. 건물의 배선과 벽체에 하자가 없는지 정기적으로 점검하는 시설 점검관과 비슷하며, "규칙을 지키는가"가 아니라 "망가진 부분이 있는가"를 찾는다는 점에서 Config와 다릅니다.',
    plain_en: 'Inspector is not a person — it is a managed service that continuously and automatically scans EC2, container images, and Lambda code for known security vulnerabilities (CVEs). It is like a facilities inspector who regularly checks a building wiring and walls for defects, differing from Config by looking for what is broken rather than whether the rule is being followed.',
    desc_ko: 'Amazon Inspector는 소프트웨어 취약점(CVE)과 의도치 않은 네트워크 노출을 자동으로 찾아 심각도와 함께 보고합니다. "패치되지 않은 취약점을 찾아라"의 정답입니다.',
    desc_en: 'Inspector finds software CVEs and unintended network exposure automatically, reporting them with severity — the answer to "identify unpatched vulnerabilities".',
    points: [
      { ko: '취약점 vs 구성 규정', en: 'Vulnerabilities vs configuration rules',
        body_ko: '소프트웨어 CVE는 Inspector, "S3 버킷이 암호화되어 있는가" 같은 구성 규정 준수는 AWS Config입니다. 둘을 바꿔 놓은 선택지가 흔합니다.',
        body_en: 'Software CVEs → Inspector. Configuration rules such as "is this bucket encrypted" → AWS Config. Swapping them is a common distractor.' }
    ]
  },

  shield: {
    summary_ko: 'DDoS 방어. Standard는 기본 제공, Advanced는 유료 전담 대응',
    summary_en: 'DDoS protection: Standard is automatic, Advanced adds paid expert response',
    plain_ko: 'Shield는 장비가 아니라, 대량 트래픽 공격(DDoS)으로부터 계정을 지켜주는 관리형 방어 서비스입니다. Standard는 모든 건물에 기본으로 설치된 셔터 같은 무료 기본 방어이고, Advanced는 여기에 더해 유료로 전담 보안팀을 상시 대기시켜 놓는 것과 같습니다.',
    plain_en: 'Shield is not a piece of equipment — it is a managed defense service that protects an account from massive traffic floods (DDoS attacks). Standard is like a free, basic shutter installed on every building by default; Advanced adds a paid, dedicated security team on standby around the clock.',
    desc_ko: 'Shield Standard는 모든 AWS 고객에게 무료로 L3/L4 DDoS 방어를 제공합니다. Shield Advanced는 월정액으로 대규모 공격 대응팀, 비용 급증 보호, 상세 진단을 추가합니다.',
    desc_en: 'Shield Standard gives every customer free L3/L4 DDoS protection. Shield Advanced adds a response team, cost-spike protection, and detailed diagnostics for a monthly fee.',
    points: [
      { ko: 'Advanced가 정답인 조건', en: 'When Advanced is the answer',
        body_ko: '"DDoS 대응 전문가 지원", "공격으로 인한 확장 비용 환급", "24시간 대응"이 명시되면 Advanced입니다. 그냥 "DDoS 방어"면 Standard가 이미 적용 중입니다.',
        body_en: '"DDoS response team", "reimbursement for attack-driven scaling", or "24/7 support" mean Advanced. Plain "DDoS protection" is already covered by Standard.' }
    ]
  },

  cognito: {
    summary_ko: '앱 사용자의 가입·로그인·소셜 연동을 담당',
    summary_en: 'Sign-up, sign-in, and social federation for application users',
    plain_ko: 'Cognito는 직원용 출입 시스템이 아니라, 내 앱을 쓰는 일반 고객들의 회원가입·로그인을 대신 처리해 주는 관리형 서비스입니다. IAM이 회사 직원 출입증을 관리하는 것이라면, Cognito는 매장 앞의 회원가입 데스크이자 로그인 창구로, 서로 다른 사람들을 대상으로 한다는 점이 핵심입니다.',
    plain_en: 'Cognito is not an employee access system — it is a managed service that handles sign-up and sign-in for the everyday customers using an app. If IAM manages employee badges for staff, Cognito is the membership desk and login counter out front for the public — the key distinction is who each one is meant for.',
    desc_ko: 'Cognito는 최종 사용자(고객) 인증을 처리합니다. IAM이 AWS 리소스 접근을 다루는 반면 Cognito는 모바일·웹 앱의 회원을 다룬다는 점이 핵심 구분입니다.',
    desc_en: 'Cognito authenticates end users of your application. The key distinction: IAM governs access to AWS resources, while Cognito manages the members of your mobile or web app.',
    points: [
      { ko: '사용자 풀 vs 자격 증명 풀', en: 'User pools vs identity pools',
        body_ko: '사용자 풀은 가입·로그인 디렉터리로 토큰을 발급합니다. 자격 증명 풀은 그 토큰을 임시 AWS 자격 증명으로 바꿔 앱이 S3 등에 직접 접근하게 합니다.',
        body_en: 'A user pool is the sign-up directory issuing tokens; an identity pool exchanges those tokens for temporary AWS credentials so the app can reach S3 directly.' },
      { ko: '소셜·기업 로그인', en: 'Social and enterprise login',
        body_ko: 'Google·Facebook·Apple 소셜 로그인과 SAML 기업 IdP 연동을 지원합니다. "사용자가 구글 계정으로 로그인하게 하라"의 정답입니다.',
        body_en: 'Supports Google, Facebook, and Apple sign-in plus SAML enterprise IdPs — the answer to "let users sign in with their Google account".' }
    ]
  },

  /* ======================================================================
     APPLICATION INTEGRATION
     ====================================================================== */
  apigw: {
    summary_ko: 'API의 정문. 인증·스로틀링·캐싱을 대신 처리',
    summary_en: 'The front door for APIs, handling auth, throttling, and caching',
    plain_ko: 'API Gateway는 서버가 아니라, 외부 요청을 받아서 인증 확인·속도 제한·캐싱까지 대신 처리해 주는 관리형 API 관문 서비스입니다. 호텔 프런트 데스크가 투숙객 확인부터 과도한 요청 조율, 자주 묻는 질문에 대한 즉답까지 처리해 뒷단 직원들의 부담을 덜어주는 것과 비슷합니다.',
    plain_en: 'API Gateway is not a server — it is a managed front-door service that receives external requests and handles authentication, rate limiting, and caching. It is like a hotel front desk that checks guests in, manages a flood of requests, and even answers common questions on the spot, sparing the staff behind it.',
    desc_ko: 'API Gateway는 REST·HTTP·WebSocket API를 관리형으로 제공하며 Lambda와 짝을 이뤄 서버리스 백엔드를 만듭니다. 인증, 요청 제한, 캐싱, 버전 관리를 코드 없이 붙일 수 있습니다.',
    desc_en: 'API Gateway hosts REST, HTTP, and WebSocket APIs and pairs with Lambda for serverless backends, adding authentication, throttling, caching, and versioning without code.',
    points: [
      { ko: '스로틀링과 사용 계획', en: 'Throttling and usage plans',
        body_ko: '사용 계획과 API 키로 클라이언트별 요청 속도를 제한합니다. "특정 고객이 API를 과다 호출한다"는 문제의 정답입니다.',
        body_en: 'Usage plans with API keys rate-limit each client — the answer when one customer floods the API.' },
      { ko: '권한 부여 방식', en: 'Authorization options',
        body_ko: 'Cognito 사용자 풀 권한 부여자, Lambda 권한 부여자(커스텀 토큰 검증), IAM 인증 중에서 고릅니다. 앱 사용자 로그인이면 Cognito입니다.',
        body_en: 'Choose among Cognito user pool authorizers, Lambda authorizers for custom tokens, or IAM authentication. App user login → Cognito.' },
      { ko: '캐싱으로 백엔드 보호', en: 'Caching protects the backend',
        body_ko: '스테이지 캐시를 켜면 동일 요청을 백엔드까지 보내지 않아 지연시간과 Lambda 호출 비용이 줄어듭니다.',
        body_en: 'Stage caching stops repeated requests from reaching the backend, cutting latency and Lambda invocation cost.' }
    ]
  },

  sqs: {
    summary_ko: '메시지 큐. 생산자와 소비자를 떼어 놓는 버퍼',
    summary_en: 'A message queue that buffers producers from consumers',
    plain_ko: 'SQS는 서버나 데이터베이스가 아니라, 메시지를 안전하게 담아두는 가상의 우편함(큐)입니다. 받는 사람이 잠깐 자리를 비워도 편지가 사라지지 않고 우편함에 그대로 남아 있는 것처럼, 뒷단 시스템이 느리거나 잠깐 죽어 있어도 메시지는 유실되지 않고 큐 안에서 기다립니다.',
    plain_en: 'SQS is not a server or a database — it is a virtual mailbox (a queue) that holds messages safely. Just as a letter stays waiting in the mailbox even if the recipient steps away for a while, messages sit safely in the queue even when the backend system is slow or briefly down, instead of being lost.',
    desc_ko: 'SQS는 메시지를 안전히 보관해 뒷단이 느리거나 죽어도 요청이 유실되지 않게 합니다. "트래픽 급증을 흡수하라", "구성 요소를 분리하라", "작업이 유실되면 안 된다"는 문제의 정답입니다.',
    desc_en: 'SQS durably holds messages so requests survive a slow or failed backend. It answers "absorb traffic spikes", "decouple components", and "no work may be lost".',
    points: [
      { ko: 'Standard vs FIFO', en: 'Standard vs FIFO',
        body_ko: 'Standard는 거의 무제한 처리량이지만 순서를 보장하지 않고 중복 전달이 가능합니다. FIFO는 순서와 정확히 한 번 처리를 보장합니다. "순서대로 처리해야 한다"면 FIFO입니다.',
        body_en: 'Standard offers near-unlimited throughput without ordering and may deliver duplicates. FIFO guarantees order and exactly-once processing. "Must be processed in order" → FIFO.' },
      { ko: '가시성 제한 시간', en: 'Visibility timeout',
        body_ko: '소비자가 메시지를 가져가면 일정 시간 다른 소비자에게 보이지 않습니다. 처리 시간보다 짧으면 같은 메시지가 중복 처리되므로 넉넉히 잡아야 합니다.',
        body_en: 'A consumed message is hidden from others for this period. If it is shorter than processing time, the message is processed twice — set it generously.' },
      { ko: '데드레터 큐', en: 'Dead-letter queue',
        body_ko: '지정 횟수만큼 처리에 실패한 메시지를 별도 큐로 보내 원인을 분석합니다. "실패한 메시지를 격리하라"의 정답입니다.',
        body_en: 'Messages that fail a set number of times move to a separate queue for analysis — the answer to "isolate failed messages".' },
      { ko: 'ASG 조정의 근거', en: 'Basis for ASG scaling',
        body_ko: '큐 깊이를 CloudWatch 지표로 삼아 워커 수를 조정하면 부하에 정확히 비례하는 확장이 됩니다.',
        body_en: 'Scaling workers on queue depth as a CloudWatch metric produces scaling that tracks load precisely.' }
    ]
  },

  eventbridge: {
    summary_ko: '이벤트 버스. 규칙으로 이벤트를 여러 대상에 라우팅',
    summary_en: 'An event bus routing events to many targets by rule',
    plain_ko: 'EventBridge는 실체가 있는 장비가 아니라, 여러 곳에서 들어오는 이벤트를 규칙에 따라 알맞은 곳으로 골라 보내는 가상의 교환대(이벤트 버스)입니다. 전화 교환원이 걸려온 전화의 용건을 듣고 알맞은 부서로 돌려주듯, 사건이 발생한 내용을 보고 미리 정한 규칙대로 Lambda나 SQS 같은 목적지로 자동 전달합니다.',
    plain_en: 'EventBridge is not a tangible device — it is a virtual switchboard (an event bus) that reads events arriving from many sources and routes each one to the right place by rule. Like a phone operator who hears a caller purpose and transfers them to the right department, it looks at what event just happened and automatically forwards it to a destination like Lambda or SQS according to preset rules.',
    desc_ko: 'EventBridge는 AWS 서비스, SaaS, 자체 애플리케이션의 이벤트를 받아 규칙에 따라 Lambda·SQS·Step Functions 등으로 보냅니다. 크론 스케줄링도 담당합니다.',
    desc_en: 'EventBridge ingests events from AWS services, SaaS providers, and your own applications, routing them by rule to Lambda, SQS, Step Functions, and more — including cron scheduling.',
    points: [
      { ko: '스케줄 실행', en: 'Scheduled execution',
        body_ko: '"매일 밤 2시에 실행", "1시간마다 정리 작업" 같은 요구는 EventBridge 스케줄 규칙 + Lambda가 표준 정답입니다. 크론 서버를 띄우는 선택지는 오답입니다.',
        body_en: '"Run nightly at 2am" or "clean up hourly" is answered by an EventBridge schedule rule plus Lambda. Standing up a cron server is wrong.' },
      { ko: 'SNS와의 구분', en: 'Versus SNS',
        body_ko: 'SNS는 단순 팬아웃 알림, EventBridge는 이벤트 내용으로 필터링·변환·라우팅합니다. "이벤트 패턴에 따라 다른 처리"면 EventBridge입니다.',
        body_en: 'SNS is simple fan-out; EventBridge filters, transforms, and routes on event content. "Different handling per event pattern" → EventBridge.' },
      { ko: '서비스 상태 변화 감지', en: 'Reacting to service state changes',
        body_ko: 'EC2 상태 변경, Spot 중단 경고, GuardDuty 결과 같은 AWS 이벤트를 잡아 자동 대응을 만듭니다.',
        body_en: 'Capture AWS events such as EC2 state changes, Spot interruption notices, or GuardDuty findings to drive automated response.' }
    ]
  },

  sns: {
    summary_ko: '발행-구독 알림. 하나의 메시지를 여러 대상에 팬아웃',
    summary_en: 'Publish-subscribe notifications fanning one message out to many targets',
    plain_ko: 'SNS는 저장소가 아니라, 메시지 하나를 여러 구독자에게 동시에 뿌려주는 발행-구독 방식의 관리형 알림 서비스입니다. 하나의 공지를 확성기로 방송하거나 단체 우편 발송 명단에 동시에 보내는 것과 같아서, 구독하고 있는 모든 대상(큐·이메일·문자 등)이 같은 메시지를 한 번에 받습니다.',
    plain_en: 'SNS is not a storage service — it is a managed publish-subscribe notification service that broadcasts one message to many subscribers at once. It is like announcing something over a loudspeaker or sending one mailing to an entire distribution list: every subscriber (queues, email, SMS, and more) receives the same message simultaneously.',
    desc_ko: 'SNS는 토픽에 발행된 메시지를 여러 구독자(SQS 큐, Lambda, HTTP, 이메일, SMS)에게 동시에 보냅니다. "한 이벤트를 여러 시스템이 각자 처리해야 한다"는 문제의 정답입니다.',
    desc_en: 'SNS delivers a message published to a topic to many subscribers at once — SQS queues, Lambda, HTTP, email, or SMS. It answers "several systems must each handle the same event".',
    points: [
      { ko: '팬아웃 패턴', en: 'The fan-out pattern',
        body_ko: 'SNS 토픽에 여러 SQS 큐를 구독시키면 각 소비자가 자기 속도로 처리하면서도 메시지를 잃지 않습니다. 시험의 대표적 정답 구조입니다.',
        body_en: 'Subscribing several SQS queues to one SNS topic lets each consumer work at its own pace without losing messages — a signature exam answer.' },
      { ko: 'SQS와의 구분', en: 'Versus SQS',
        body_ko: 'SQS는 하나의 메시지를 하나의 소비자가 가져가는 큐, SNS는 하나의 메시지를 모든 구독자가 받는 브로드캐스트입니다.',
        body_en: 'SQS is a queue where one consumer takes each message; SNS is a broadcast where every subscriber receives it.' },
      { ko: '메시지 필터링', en: 'Message filtering',
        body_ko: '구독마다 필터 정책을 걸어 관심 있는 메시지만 받게 할 수 있어 불필요한 처리를 줄입니다.',
        body_en: 'Per-subscription filter policies deliver only relevant messages, cutting wasted processing.' }
    ]
  },

  stepfunctions: {
    summary_ko: '여러 단계를 상태 기계로 오케스트레이션. 재시도·분기 내장',
    summary_en: 'Orchestrates multi-step workflows as a state machine with built-in retries and branching',
    plain_ko: 'Step Functions는 서버가 아니라, 여러 작업 단계를 순서·조건·재시도까지 정해둔 대로 자동 진행시키는 가상의 상태 기계(워크플로 엔진)입니다. 종이에 그려둔 업무 흐름도를 그대로 따라 움직이는 자동 현장 감독처럼, 각 단계가 끝나면 다음으로 넘기고 실패하면 정해둔 대로 재시도하거나 다른 길로 분기합니다.',
    plain_en: 'Step Functions is not a server — it is a virtual state machine (a workflow engine) that automatically advances through steps in a defined order, with conditions and retries built in. It is like an automatic site foreman following a written flowchart: it moves to the next step when one finishes, and retries or branches exactly as instructed when something fails.',
    desc_ko: 'Step Functions는 Lambda 등 여러 작업을 순서·조건·병렬로 엮고 실패 시 재시도와 보상 처리를 선언적으로 정의합니다. Lambda 하나로 15분을 넘기거나 복잡한 흐름 제어가 필요할 때 정답입니다.',
    desc_en: 'Step Functions chains tasks in sequence, branches, and parallel, declaring retries and compensation on failure. It is the answer when one Lambda exceeds 15 minutes or the flow control gets complex.',
    points: [
      { ko: '긴 워크플로 해법', en: 'Solving long workflows',
        body_ko: 'Standard 워크플로는 최대 1년까지 실행되어 사람의 승인 대기 같은 장기 흐름도 처리합니다. Express는 짧고 대량인 흐름에 씁니다.',
        body_en: 'Standard workflows run up to a year, covering long waits such as human approval; Express workflows suit short, high-volume flows.' },
      { ko: 'Lambda 체이닝의 대안', en: 'Alternative to chaining Lambdas',
        body_ko: 'Lambda가 다른 Lambda를 직접 호출하며 오류 처리를 코드로 짜는 선택지보다, Step Functions로 흐름을 외부화하는 편이 관측성과 재시도 면에서 낫습니다.',
        body_en: 'Externalising the flow into Step Functions beats having Lambdas invoke each other with hand-written error handling, for observability and retries.' }
    ]
  },

  ses: {
    summary_ko: '대량 이메일 발송·수신 서비스',
    summary_en: 'Bulk email sending and receiving',
    plain_ko: 'SES는 이메일 서버 장비가 아니라, 대량의 이메일을 대신 발송하고 수신까지 처리해 주는 관리형 서비스입니다. 자체 우편실을 직접 운영하는 대신 대량 발송 전문 우편 대행 업체에 맡기는 것과 비슷해서, 거래 알림이나 마케팅 메일을 대규모로 보낼 때 씁니다.',
    plain_en: 'SES is not an email server appliance — it is a managed service that sends, and can receive, large volumes of email on your behalf. It is like outsourcing a mailroom to a bulk-mailing specialist instead of running one directly, used for transactional notifications or marketing email at scale.',
    desc_ko: 'SES는 트랜잭션 메일과 마케팅 메일을 대량으로 보내는 서비스입니다. 알림 목적의 SNS 이메일과 달리 실제 이메일 애플리케이션에 씁니다.',
    desc_en: 'SES sends transactional and marketing email at scale. Unlike SNS email notifications, it powers real email applications.',
    points: [
      { ko: 'SNS 이메일과의 구분', en: 'Versus SNS email',
        body_ko: '운영 알림을 몇 명에게 보내면 SNS, 고객에게 서식 있는 대량 메일을 보내면 SES입니다.',
        body_en: 'Operational alerts to a few people → SNS. Formatted bulk email to customers → SES.' }
    ]
  },

  mq: {
    summary_ko: '기존 메시지 브로커를 그대로 옮길 때 쓰는 관리형 브로커',
    summary_en: 'Managed broker for lifting an existing message broker as-is',
    plain_ko: 'Amazon MQ는 새로운 발명품이 아니라, 이미 있는 ActiveMQ·RabbitMQ 같은 특정 브랜드의 메시지 브로커 소프트웨어를 AWS가 대신 운영해 주는 관리형 서비스입니다. 원래 회사에 있던 특정 브랜드의 분류 기계를 그대로 옮겨오되, 그 기계의 유지보수만 AWS에 맡기는 것과 같습니다.',
    plain_en: 'Amazon MQ is not a new invention — it is a managed service that runs an existing, specific brand of message broker software, such as ActiveMQ or RabbitMQ, on your behalf. It is like moving the exact same brand of sorting machine a company already used, but handing its maintenance over to AWS.',
    desc_ko: 'Amazon MQ는 ActiveMQ·RabbitMQ를 관리형으로 제공합니다. 시험에서는 "기존 애플리케이션이 JMS·AMQP·MQTT 같은 표준 프로토콜을 쓰고 코드를 바꿀 수 없다"는 조건에서만 정답입니다.',
    desc_en: 'Amazon MQ runs managed ActiveMQ or RabbitMQ. It is correct only when the scenario says an existing application uses standard protocols such as JMS, AMQP, or MQTT and cannot be rewritten.',
    points: [
      { ko: 'SQS가 기본, MQ는 예외', en: 'SQS by default, MQ as the exception',
        body_ko: '새로 만드는 시스템이면 SQS/SNS가 더 확장성 있고 저렴합니다. "코드 변경 없이 마이그레이션", "JMS/AMQP"가 명시될 때만 MQ를 고르세요.',
        body_en: 'For new systems SQS and SNS scale better and cost less. Pick MQ only when "migrate without code changes" or "JMS/AMQP" is explicit.' }
    ]
  },

  /* ======================================================================
     ANALYTICS
     ====================================================================== */
  kinesis: {
    summary_ko: '실시간 스트리밍 데이터 수집·처리',
    summary_en: 'Real-time streaming data ingestion and processing',
    plain_ko: 'Kinesis는 저장 창고가 아니라, 끊임없이 흘러 들어오는 데이터를 실시간으로 흘려보내는 가상의 컨베이어 벨트입니다. 상자를 창고에 쌓아뒀다가 나중에 꺼내는 게 아니라, 벨트 위를 지나가는 물건을 그 자리에서 바로 집어 처리하는 것과 같아서 클릭 로그나 센서 데이터처럼 계속 밀려드는 정보를 실시간으로 다룹니다.',
    plain_en: 'Kinesis is not a storage warehouse — it is a virtual conveyor belt that carries continuously arriving data in real time. Rather than stacking boxes in a warehouse and pulling them out later, it is like picking items straight off a moving belt as they pass by, handling constantly incoming data such as clickstreams or sensor readings the instant it arrives.',
    desc_ko: 'Kinesis는 클릭스트림, IoT 센서, 로그처럼 끊임없이 흘러드는 데이터를 실시간으로 받습니다. 시험에서는 Data Streams와 Data Firehose의 구분이 핵심입니다.',
    desc_en: 'Kinesis ingests continuously flowing data such as clickstreams, IoT telemetry, and logs. The exam hinges on distinguishing Data Streams from Data Firehose.',
    points: [
      { ko: 'Data Streams vs Firehose', en: 'Data Streams vs Firehose',
        body_ko: 'Data Streams는 밀리초 지연으로 커스텀 소비자가 읽고 데이터를 최대 365일 보관합니다. Firehose는 완전 관리형으로 S3·Redshift·OpenSearch에 자동 적재하지만 지연이 최소 60초입니다. "실시간 처리"면 Streams, "S3로 적재만"이면 Firehose입니다.',
        body_en: 'Data Streams gives millisecond latency for custom consumers and retains data up to 365 days. Firehose is fully managed, loading to S3, Redshift, or OpenSearch with a minimum ~60-second buffer. "Real-time processing" → Streams; "just load into S3" → Firehose.' },
      { ko: '샤드와 처리량', en: 'Shards and throughput',
        body_ko: 'Data Streams의 처리량은 샤드 수에 비례합니다. "초당 10만 건" 같은 조건에서 단일 샤드 선택지는 오답입니다. On-Demand 모드는 샤드 관리를 없앱니다.',
        body_en: 'Data Streams throughput scales with shard count, so a single-shard option is wrong for "100,000 records per second". On-demand mode removes shard management.' },
      { ko: '순서 보장', en: 'Ordering',
        body_ko: '같은 파티션 키의 레코드는 같은 샤드에 들어가 순서가 보장됩니다. 기기별 순서가 중요하면 기기 ID를 파티션 키로 씁니다.',
        body_en: 'Records sharing a partition key land on the same shard in order, so use the device ID as the partition key when per-device ordering matters.' }
    ]
  },

  athena: {
    summary_ko: 'S3에 있는 데이터를 그대로 SQL로 조회. 서버 없음',
    summary_en: 'Query data in place on S3 with SQL — no servers',
    plain_ko: 'Athena는 데이터베이스 서버가 아니라, S3 창고 안에 있는 파일을 옮기지 않은 채로 그 자리에서 SQL로 질문하고 답을 받는 서버리스 조회 서비스입니다. 창고 관리인을 따로 고용하지 않고, 필요할 때만 조사원을 창고에 보내 궁금한 것만 확인시키고 스캔한 만큼만 요금을 내는 것과 같습니다.',
    plain_en: 'Athena is not a database server — it is a serverless query service that answers SQL questions against files sitting in an S3 warehouse without ever moving them. It is like never hiring a permanent warehouse manager, and instead sending an investigator in only when needed to check exactly what is being asked about, paying only for how much was scanned.',
    desc_ko: 'Athena는 S3의 CSV·JSON·Parquet 파일을 옮기지 않고 SQL로 질의하며 스캔한 데이터 양만큼 과금합니다. "S3의 로그를 가끔 분석", "인프라 변경 최소화"가 나오면 표준 정답입니다.',
    desc_en: 'Athena runs SQL directly over CSV, JSON, or Parquet in S3 without moving data, billing per byte scanned. "Occasionally analyse logs in S3" with "minimal changes to architecture" makes it the standard answer.',
    points: [
      { ko: 'Redshift와의 갈림길', en: 'The fork with Redshift',
        body_ko: '가끔·즉석 쿼리면 Athena(클러스터 없음), 지속적인 대규모 BI 워크로드면 Redshift입니다. "on-demand", "가끔", "간단한 쿼리"는 Athena 신호입니다.',
        body_en: 'Ad-hoc, occasional queries → Athena (no cluster). Sustained large-scale BI → Redshift. "On-demand", "occasionally", and "simple queries" signal Athena.' },
      { ko: '비용을 줄이는 방법', en: 'Reducing cost',
        body_ko: 'Parquet·ORC 같은 열 기반 형식으로 압축하고 날짜별로 파티셔닝하면 스캔량이 크게 줄어 비용이 내려갑니다. Athena 비용 절감 문제의 정답입니다.',
        body_en: 'Convert to columnar formats such as Parquet or ORC and partition by date to slash bytes scanned — the answer for cutting Athena cost.' }
    ]
  },

  glue: {
    summary_ko: '서버리스 ETL과 데이터 카탈로그',
    summary_en: 'Serverless ETL and a data catalog',
    plain_ko: 'Glue는 서버 클러스터가 아니라, 데이터가 어떤 모양인지 자동으로 파악해 목록을 만들고, 필요하면 형식까지 변환해 주는 서버리스 ETL·카탈로그 서비스입니다. 창고에 쌓인 상자들을 하나하나 열어 내용물을 목록으로 정리하고 필요하면 포장까지 다시 해주는 자동 사서라고 생각하면 됩니다.',
    plain_en: 'Glue is not a server cluster — it is a serverless ETL and catalog service that figures out the shape of data, builds a searchable list of it, and reformats it if needed. Think of it as an automatic librarian who opens every box in the warehouse, catalogs the contents, and even repackages them when required.',
    desc_ko: 'Glue는 데이터 소스를 크롤링해 스키마를 카탈로그에 등록하고, 서버리스 Spark로 변환 작업을 실행합니다. Athena·Redshift Spectrum이 참조하는 메타데이터 저장소 역할도 합니다.',
    desc_en: 'Glue crawls sources to register schemas in a catalog and runs transformations on serverless Spark. Its catalog is also the metadata store Athena and Redshift Spectrum read.',
    points: [
      { ko: '크롤러와 데이터 카탈로그', en: 'Crawlers and the Data Catalog',
        body_ko: '크롤러가 S3를 훑어 테이블 정의를 자동 생성하면 Athena가 바로 질의할 수 있습니다. "스키마를 자동으로 발견"이 신호입니다.',
        body_en: 'A crawler scans S3 and generates table definitions that Athena can query immediately. "Automatically discover the schema" is the signal.' },
      { ko: 'EMR과의 선택', en: 'Versus EMR',
        body_ko: '클러스터 관리 없이 ETL만 하면 Glue, Spark·Hadoop 클러스터를 세밀히 튜닝해야 하면 EMR입니다. 운영 부담 최소화 요구면 Glue입니다.',
        body_en: 'ETL without managing clusters → Glue. Fine-grained control of Spark or Hadoop clusters → EMR. "Minimize operational overhead" → Glue.' }
    ]
  },

  redshift: {
    summary_ko: '페타바이트급 데이터 웨어하우스. 복잡한 분석 쿼리 전용',
    summary_en: 'Petabyte-scale data warehouse for complex analytical queries',
    plain_ko: 'Redshift는 일반적인 데이터베이스 서버가 아니라, 대량의 과거 데이터를 모아 놓고 복잡한 집계·분석 질문에 답하도록 특화된 관리형 데이터 웨어하우스(클러스터)입니다. 매장 계산대(빠른 개별 거래 처리)가 아니라, 본사 뒤편에서 몇 달치 매출을 몰아서 파고드는 분석팀 전용 사무실이라고 생각하면 됩니다.',
    plain_en: 'Redshift is not a general-purpose database server — it is a managed data warehouse (a cluster) purpose-built to answer heavy aggregation and analysis questions over large amounts of historical data. Think of it not as the store checkout counter (fast individual transactions) but as the analytics team back office, built specifically to dig through months of sales data at once.',
    desc_ko: 'Redshift는 열 기반 저장과 병렬 처리로 대규모 집계·조인 쿼리를 빠르게 수행합니다. "BI 대시보드", "복잡한 조인", "과거 데이터 분석"이 신호이며, OLTP 트랜잭션에는 부적합합니다.',
    desc_en: 'Redshift uses columnar storage and massively parallel processing for large aggregations and joins. Signals are "BI dashboards", "complex joins", and "historical analysis"; it is wrong for OLTP.',
    points: [
      { ko: 'Redshift Spectrum', en: 'Redshift Spectrum',
        body_ko: '클러스터에 적재하지 않고 S3의 데이터를 직접 조회해 웨어하우스와 데이터 레이크를 함께 질의합니다. 저장 비용을 아끼는 정답 요소입니다.',
        body_en: 'Queries S3 data without loading it into the cluster, joining warehouse and data lake — a way to cut storage cost.' },
      { ko: 'OLTP에는 오답', en: 'Wrong for OLTP',
        body_ko: '초당 수천 건의 짧은 읽기·쓰기 트랜잭션에는 RDS나 DynamoDB가 맞습니다. Redshift는 소수의 무거운 분석 쿼리에 최적화되어 있습니다.',
        body_en: 'High-rate short transactions belong in RDS or DynamoDB. Redshift is tuned for a few heavy analytical queries.' }
    ]
  },

  emr: {
    summary_ko: 'Hadoop·Spark 클러스터를 관리형으로 실행',
    summary_en: 'Managed Hadoop and Spark clusters',
    plain_ko: 'EMR은 상시 운영되는 서버가 아니라, Spark나 Hadoop 같은 기존 빅데이터 도구를 그대로 쓰기 위해 필요한 순간에만 통째로 빌려 쓰는 관리형 클러스터입니다. 큰 공사가 있을 때만 동일한 장비와 인력을 임시로 불러 쓰고, 끝나면 돌려보내는 것과 같습니다.',
    plain_en: 'EMR is not an always-on server — it is a managed cluster rented, whole, only for the moment it is needed to run existing big-data tools like Spark or Hadoop exactly as before. It is like calling in the same equipment and crew temporarily for a big job and releasing them once it is done.',
    desc_ko: 'EMR은 Spark, Hadoop, Hive, Presto 클러스터를 띄워 대규모 데이터 처리를 수행합니다. 기존 빅데이터 도구와 코드를 그대로 써야 할 때 선택합니다.',
    desc_en: 'EMR provisions Spark, Hadoop, Hive, and Presto clusters for large-scale processing, chosen when existing big-data tooling and code must be preserved.',
    points: [
      { ko: 'Spot으로 비용 절감', en: 'Cut cost with Spot',
        body_ko: '코어 노드는 On-Demand로, 태스크 노드는 Spot으로 구성하면 비용을 크게 낮추면서 데이터 손실 위험을 피합니다. EMR 비용 문제의 정답입니다.',
        body_en: 'Run core nodes On-Demand and task nodes on Spot to cut cost without risking data loss — the answer for EMR cost questions.' },
      { ko: '일시적 클러스터', en: 'Transient clusters',
        body_ko: '작업이 끝나면 클러스터를 종료하고 데이터는 S3(EMRFS)에 남겨두면 유휴 비용이 사라집니다.',
        body_en: 'Terminate the cluster when the job finishes and keep data in S3 via EMRFS to eliminate idle cost.' }
    ]
  },

  quicksight: {
    summary_ko: '서버리스 BI 대시보드 도구',
    summary_en: 'Serverless business-intelligence dashboards',
    plain_ko: 'QuickSight는 데이터 저장소가 아니라, S3·Redshift 같은 곳의 데이터를 끌어와 보기 좋은 차트와 대시보드로 그려주는 서버리스 시각화 도구입니다. 숫자로 가득한 스프레드시트를 경영진이 한눈에 알아볼 그래프로 바꿔주는 사내 디자이너와 같은 역할입니다.',
    plain_en: 'QuickSight is not a data store — it is a serverless visualization tool that pulls data from places like S3 or Redshift and turns it into charts and dashboards. It plays the role of an in-house designer who converts a spreadsheet full of numbers into graphs executives can grasp at a glance.',
    desc_ko: 'QuickSight는 S3, Athena, Redshift, RDS 등을 연결해 대시보드와 시각화를 만듭니다. "경영진에게 시각화된 리포트를 제공하라"는 문제의 정답입니다.',
    desc_en: 'QuickSight connects to S3, Athena, Redshift, and RDS to build dashboards and visualisations — the answer to "give executives visual reports".',
    points: [
      { ko: '시각화 요구의 신호', en: 'The visualisation signal',
        body_ko: '"대시보드", "차트", "비즈니스 사용자가 직접 탐색"이 나오면 QuickSight입니다. 데이터 처리 자체는 Athena·Redshift가 담당합니다.',
        body_en: '"Dashboard", "charts", or "business users explore for themselves" mean QuickSight, while Athena or Redshift does the processing underneath.' }
    ]
  },

  opensearch: {
    summary_ko: '로그 검색과 전문 검색, 실시간 분석',
    summary_en: 'Log search, full-text search, and real-time analytics',
    plain_ko: 'OpenSearch는 파일 저장소가 아니라, 로그가 들어오는 즉시 색인을 만들어 두어 언제든 바로 검색할 수 있게 해주는 상시 가동형 관리형 검색·분석 서비스입니다. 손님이 오기 전에 이미 모든 책을 주제별로 정리해 둔 도서관 사서와 같아서, Athena처럼 매번 창고를 뒤지지 않고도 즉시 찾아낼 수 있는 대신 항상 켜져 있어야 해 비용이 더 듭니다.',
    plain_en: 'OpenSearch is not a file store — it is an always-on managed search and analytics service that indexes logs the moment they arrive so they can be searched instantly at any time. It is like a librarian who has already sorted every book by topic before visitors arrive: unlike Athena, which digs through the warehouse each time, it finds things instantly — but that means it must keep running around the clock, at a higher cost.',
    desc_ko: 'OpenSearch Service는 로그를 색인해 빠르게 검색·시각화합니다. "로그를 검색 가능하게", "전문 검색 기능", "실시간 로그 분석 대시보드"가 신호입니다.',
    desc_en: 'OpenSearch Service indexes logs for fast search and visualisation. Signals are "make logs searchable", "full-text search", and "real-time log dashboards".',
    points: [
      { ko: 'Athena와의 구분', en: 'Versus Athena',
        body_ko: '가끔 SQL로 조회하면 Athena, 상시 색인해 즉시 검색·대시보드가 필요하면 OpenSearch입니다. OpenSearch는 클러스터가 상시 돌아 비용이 더 듭니다.',
        body_en: 'Occasional SQL queries → Athena. Continuously indexed, instantly searchable dashboards → OpenSearch, which runs a always-on cluster and costs more.' },
      { ko: 'Firehose로 적재', en: 'Load with Firehose',
        body_ko: 'Kinesis Data Firehose를 OpenSearch 대상으로 지정하면 코드 없이 로그 파이프라인이 완성됩니다.',
        body_en: 'Pointing Kinesis Data Firehose at OpenSearch builds a log pipeline with no code.' }
    ]
  },

  /* ======================================================================
     MANAGEMENT & GOVERNANCE
     ====================================================================== */
  cloudwatch: {
    summary_ko: '지표·로그·알람의 중앙 창구',
    summary_en: 'The central place for metrics, logs, and alarms',
    plain_ko: 'CloudWatch는 저장 장치가 아니라, AWS 자원들의 상태를 계속 지켜보고 이상이 생기면 알람을 울리는 관리형 관제실 서비스입니다. 건물 중앙 관제실의 계기판과 경보 시스템처럼, 수치(지표)를 실시간으로 보여주고 임계값을 넘으면 경보를 울리며 필요하면 자동으로 대응 조치까지 연결할 수 있습니다.',
    plain_en: 'CloudWatch is not a storage device — it is a managed control-room service that continuously watches AWS resources and sounds an alarm when something goes wrong. Like a building central control room with gauges and alarm bells, it shows metrics in real time, alerts when a threshold is crossed, and can even trigger an automated response.',
    desc_ko: 'CloudWatch는 AWS 리소스의 지표를 수집하고 로그를 모으며 임계값을 넘으면 알람을 울립니다. Auto Scaling과 자동 대응의 방아쇠 역할을 합니다.',
    desc_en: 'CloudWatch collects metrics, aggregates logs, and raises alarms on thresholds, acting as the trigger for auto scaling and automated response.',
    points: [
      { ko: '메모리·디스크는 에이전트 필요', en: 'Memory and disk need the agent',
        body_ko: 'EC2의 CPU·네트워크는 기본 제공되지만 메모리 사용률과 디스크 여유 공간은 CloudWatch 에이전트를 설치해야 수집됩니다. 자주 나오는 함정입니다.',
        body_en: 'CPU and network come free, but memory utilisation and disk space require the CloudWatch agent — a frequent trap.' },
      { ko: '알람 → 자동 대응', en: 'Alarm to automated action',
        body_ko: '알람이 SNS로 알리거나 Auto Scaling 정책을 실행하거나 EC2를 재부팅·종료할 수 있습니다. EventBridge와 조합하면 Lambda로 임의 조치도 가능합니다.',
        body_en: 'An alarm can notify SNS, execute an auto scaling policy, or reboot and terminate instances; combined with EventBridge it can run arbitrary Lambda remediation.' },
      { ko: 'Logs Insights와 보존', en: 'Logs Insights and retention',
        body_ko: '로그 그룹의 보존 기간은 기본이 무기한이라 비용이 쌓입니다. 보존 정책을 설정하고 장기 보관은 S3로 내보내는 것이 비용 정답입니다.',
        body_en: 'Log group retention defaults to never expire, so costs accumulate. Set a retention policy and export long-term archives to S3.' }
    ]
  },

  organizations: {
    summary_ko: '여러 계정을 한 조직으로 묶어 통제와 결제를 중앙화',
    summary_en: 'Groups accounts into one organization for central control and billing',
    plain_ko: 'Organizations는 계정 하나가 아니라, 여러 개의 AWS 계정을 하나의 조직 아래로 묶어 함께 관리하는 추상적인 관리 구조입니다. 여러 자회사를 거느린 본사가 각 자회사의 예산과 규정을 한곳에서 총괄하는 것과 같아서, 계정별 결제를 합치고 공통 규칙(SCP)을 한 번에 적용할 수 있습니다.',
    plain_en: 'Organizations is not a single account — it is an abstract management structure that groups multiple AWS accounts under one organization. It works like a headquarters overseeing several subsidiaries budgets and rules from a single place, consolidating billing across accounts and applying common rules (SCPs) all at once.',
    desc_ko: 'Organizations는 계정을 OU로 묶고 서비스 제어 정책(SCP)으로 허용 범위를 제한하며 통합 결제를 제공합니다. 다중 계정 거버넌스 문제의 핵심입니다.',
    desc_en: 'Organizations groups accounts into OUs, constrains them with service control policies, and consolidates billing — the core of multi-account governance.',
    points: [
      { ko: 'SCP는 상한선일 뿐', en: 'SCPs are a ceiling, not a grant',
        body_ko: 'SCP는 권한을 주지 않고 최대 허용 범위만 정합니다. 실제 권한은 여전히 IAM 정책이 부여하며, 둘의 교집합만 허용됩니다.',
        body_en: 'An SCP grants nothing; it caps what IAM policies may allow. Effective permission is the intersection of both.' },
      { ko: '통합 결제의 이점', en: 'Consolidated billing benefits',
        body_ko: '조직 전체 사용량이 합산되어 볼륨 할인이 적용되고, RI·Savings Plans 혜택이 계정 간에 공유됩니다.',
        body_en: 'Usage aggregates for volume discounts, and RI or Savings Plans benefits are shared across accounts.' },
      { ko: '조직 내부만 허용', en: 'Restricting to the organization',
        body_ko: 'S3 버킷 정책에 aws:PrincipalOrgID 조건 키를 쓰면 계정 목록을 일일이 관리하지 않고 조직 구성원만 허용할 수 있습니다.',
        body_en: 'The aws:PrincipalOrgID condition key in a bucket policy admits only organization members without maintaining an account list.' },
      { ko: 'IAM Identity Center로 계정 접근 일원화', en: 'IAM Identity Center for account access',
        body_ko: '계정이 수십 개로 늘어나면 계정마다 IAM 사용자를 만드는 선택지는 오답입니다. IAM Identity Center(구 AWS SSO)를 조직에 붙여 사내 디렉터리나 외부 IdP로 한 번 로그인하고, 권한 세트를 계정과 그룹에 할당합니다. "하나의 자격 증명으로 여러 계정에 접근"과 "운영 부담 최소"가 함께 나오면 이것입니다.',
        body_en: 'Once accounts number in the dozens, creating IAM users per account is the wrong option. Attach IAM Identity Center (formerly AWS SSO) to the organization so users sign in once through a corporate directory or external IdP, then assign permission sets to accounts and groups. "One set of credentials across many accounts" plus "least operational overhead" points here.' }
    ]
  },

  ssm: {
    summary_ko: '서버 운영 자동화. 패치·원격 접속·파라미터 저장',
    summary_en: 'Operations automation: patching, remote access, and parameter storage',
    plain_ko: 'Systems Manager는 하드웨어가 아니라, 인스턴스를 원격으로 패치하고 명령을 실행하고 접속하게 해주는 관리형 운영 도구 모음(추상적 서비스)입니다. 직접 방문하거나 미리 열쇠(SSH 키)를 맡겨두지 않아도, 필요할 때 원격으로 출동해 정비를 마치고 돌아가는 유지보수 기사팀이라고 보면 됩니다.',
    plain_en: 'Systems Manager is not a piece of hardware — it is an abstract toolkit of managed operations services for remotely patching, running commands on, and connecting to instances. Think of it as a remote maintenance crew dispatched on demand, without ever visiting in person or leaving a spare key (an SSH key) lying around.',
    desc_ko: 'Systems Manager는 인스턴스 패치, 명령 일괄 실행, SSH 없는 원격 접속, 설정값 저장을 한데 묶습니다. "SSH 키와 배스천 호스트를 없애라"는 문제의 정답입니다.',
    desc_en: 'Systems Manager bundles patching, bulk command execution, SSH-free remote access, and configuration storage — the answer to "eliminate SSH keys and bastion hosts".',
    points: [
      { ko: 'Session Manager', en: 'Session Manager',
        body_ko: '인바운드 포트를 열지 않고 IAM 권한만으로 셸에 접속하며 세션 로그를 남깁니다. 배스천 호스트와 22번 포트를 제거하는 정답입니다.',
        body_en: 'Provides a shell with no inbound ports, authorised by IAM and logged — the answer that removes bastion hosts and port 22.' },
      { ko: 'Patch Manager', en: 'Patch Manager',
        body_ko: '패치 기준과 유지 관리 기간을 정해 인스턴스 패치를 자동화하고 규정 준수 보고서를 만듭니다.',
        body_en: 'Automates patching against a baseline during maintenance windows and reports compliance.' },
      { ko: 'Parameter Store', en: 'Parameter Store',
        body_ko: '설정값과 비밀을 계층적으로 저장하며 SecureString은 KMS로 암호화됩니다. 자동 교체가 필요 없으면 Secrets Manager보다 저렴합니다.',
        body_en: 'Stores configuration hierarchically, with SecureString encrypted by KMS — cheaper than Secrets Manager when rotation is not needed.' }
    ]
  },

  cloudtrail: {
    summary_ko: '누가 언제 어떤 API를 호출했는지 기록하는 감사 로그',
    summary_en: 'An audit log of who called which API and when',
    plain_ko: 'CloudTrail은 감시 카메라가 아니라, 계정에서 일어난 모든 API 호출("누가 무엇을 언제 했는가")을 기록으로 남기는 감사 로그 서비스입니다. 건물의 모든 출입문에 설치된 출입 기록부처럼, 누가 언제 어느 문을 드나들었는지를 남겨 나중에 되짚어 볼 수 있게 합니다.',
    plain_en: 'CloudTrail is not a security camera — it is an audit-logging service that records every API call in an account, capturing who did what and when. Like a logbook kept at every door of a building, it records who badged through which door and when, so it can be traced back later.',
    desc_ko: 'CloudTrail은 계정의 모든 API 호출을 기록해 감사·규정 준수·사고 조사에 씁니다. "누가 이 리소스를 삭제했는가"는 언제나 CloudTrail입니다.',
    desc_en: 'CloudTrail records every API call for audit, compliance, and incident investigation. "Who deleted this resource" is always CloudTrail.',
    points: [
      { ko: 'CloudWatch와의 구분', en: 'Versus CloudWatch',
        body_ko: 'CloudTrail은 "누가 무엇을 했나"(감사), CloudWatch는 "얼마나 잘 돌아가나"(성능·지표)입니다. 이 구분이 시험에서 반복됩니다.',
        body_en: 'CloudTrail answers "who did what" (audit); CloudWatch answers "how is it performing" (metrics). This split recurs throughout the exam.' },
      { ko: '로그 무결성 보호', en: 'Protecting log integrity',
        body_ko: '조직 추적을 켜고 로그를 별도 계정의 S3에 보내며 Object Lock과 로그 파일 검증을 적용하면 공격자도 흔적을 지울 수 없습니다.',
        body_en: 'An organization trail delivering to S3 in a separate account, with Object Lock and log-file validation, stops an attacker from erasing tracks.' }
    ]
  },

  backup: {
    summary_ko: '여러 서비스의 백업을 한곳에서 정책으로 관리',
    summary_en: 'Centralised, policy-driven backup across many services',
    plain_ko: 'AWS Backup은 저장 장치가 아니라, EBS·RDS·DynamoDB 등 여러 서비스의 백업을 하나의 정책으로 한꺼번에 관리해 주는 관리형 조정 서비스입니다. 물건마다 다른 이삿짐센터를 부르는 대신, 한 업체에 맡겨 집안의 모든 짐을 한 번에 포장·보관하게 하는 것과 같습니다.',
    plain_en: 'AWS Backup is not a storage device — it is a managed orchestration service that manages backups across many services, such as EBS, RDS, and DynamoDB, under a single policy. It is like hiring one moving company to pack and store everything in the house at once, instead of calling a different mover for each item.',
    desc_ko: 'AWS Backup은 EBS, RDS, DynamoDB, EFS, FSx 등의 백업을 하나의 백업 계획으로 일괄 관리하고 리전·계정 간 복사까지 처리합니다. "여러 서비스의 백업을 중앙에서"라는 문제의 정답입니다.',
    desc_en: 'AWS Backup manages backups for EBS, RDS, DynamoDB, EFS, FSx, and more under one plan, including cross-Region and cross-account copies — the answer to "centralise backups across services".',
    points: [
      { ko: '규정 준수 보고', en: 'Compliance reporting',
        body_ko: '백업 정책 준수 여부를 감사할 수 있고, Vault Lock으로 보존 기간 내 삭제를 차단할 수 있습니다.',
        body_en: 'It audits policy compliance, and Vault Lock blocks deletion within the retention period.' },
      { ko: '개별 스냅샷 스크립트 대체', en: 'Replaces per-service scripts',
        body_ko: 'Lambda로 서비스마다 스냅샷 스크립트를 짜는 선택지보다 운영 부담이 훨씬 적어 정답이 됩니다.',
        body_en: 'It beats writing per-service snapshot scripts in Lambda on operational overhead, making it the correct choice.' }
    ]
  },

  config: {
    summary_ko: '리소스 구성을 기록하고 규칙 위반을 탐지·교정',
    summary_en: 'Records resource configuration and detects or remediates rule violations',
    plain_ko: 'AWS Config는 파일 저장소가 아니라, 리소스의 설정이 시간에 따라 어떻게 바뀌었는지 기록하고 규칙 위반을 찾아내는 관리형 감시 서비스입니다. 건물의 각 방이 여전히 승인된 설계도대로인지 계속 확인하고 다니는 준공 검사관과 비슷해서, "누가 했는가"가 아니라 "지금 상태가 규칙에 맞는가"를 봅니다.',
    plain_en: 'AWS Config is not a file store — it is a managed monitoring service that records how a resource configuration changes over time and flags rule violations. It is like a compliance inspector who keeps checking whether every room in a building still matches the approved blueprint, focused on whether the current state follows the rule, not on who changed it.',
    desc_ko: 'AWS Config는 리소스의 설정 변경 이력을 남기고 "모든 S3 버킷은 암호화되어야 한다" 같은 규칙 위반을 찾아냅니다. 자동 교정까지 연결할 수 있습니다.',
    desc_en: 'AWS Config records configuration history and evaluates rules such as "every S3 bucket must be encrypted", optionally triggering automatic remediation.',
    points: [
      { ko: '구성 규정 준수 전담', en: 'Configuration compliance specifically',
        body_ko: '"규정을 위반한 리소스를 찾아라", "설정이 언제 바뀌었나"는 Config입니다. API 호출 기록은 CloudTrail, 취약점은 Inspector로 구분하세요.',
        body_en: '"Find non-compliant resources" and "when did this setting change" are Config. API call history is CloudTrail; vulnerabilities are Inspector.' },
      { ko: '자동 교정', en: 'Auto-remediation',
        body_ko: 'Config 규칙에 SSM Automation 문서를 연결하면 위반을 발견했을 때 자동으로 되돌립니다.',
        body_en: 'Attaching an SSM Automation document to a rule reverts violations automatically when detected.' }
    ]
  },

  cloudformation: {
    summary_ko: '인프라를 코드로 선언해 반복 배포',
    summary_en: 'Declare infrastructure as code for repeatable deployment',
    plain_ko: 'CloudFormation은 인프라 자체가 아니라, 어떤 인프라를 어떻게 구성할지 글로 적어둔 설계도(템플릿)를 실행해 AWS 자원을 자동으로 만들어 주는 서비스입니다. 이 설계도만 있으면 로봇 건설팀이 언제 어디서든 완전히 똑같은 건물을 다시 지어낼 수 있는 것과 같아서, 수작업 설정 실수를 없애고 환경을 그대로 복제할 수 있습니다.',
    plain_en: 'CloudFormation is not the infrastructure itself — it is a service that reads a written blueprint (a template) describing how infrastructure should look and automatically builds the AWS resources to match. With that blueprint alone, a robotic construction crew could rebuild the exact same building anywhere, anytime — eliminating manual setup mistakes and reproducing environments exactly.',
    desc_ko: 'CloudFormation은 템플릿으로 인프라를 정의해 동일한 환경을 여러 번, 여러 리전·계정에 만들 수 있게 합니다. "환경을 똑같이 재현하라", "수동 설정을 없애라"의 정답입니다.',
    desc_en: 'CloudFormation defines infrastructure in templates so identical environments can be created repeatedly across Regions and accounts — the answer to "reproduce the environment exactly" and "eliminate manual setup".',
    points: [
      { ko: 'StackSets', en: 'StackSets',
        body_ko: '하나의 템플릿을 여러 계정과 리전에 한 번에 배포합니다. 조직 전체에 표준 구성을 적용하라는 문제의 정답입니다.',
        body_en: 'Deploys one template to many accounts and Regions at once — the answer for rolling a standard baseline across an organization.' },
      { ko: '드리프트 감지', en: 'Drift detection',
        body_ko: '누군가 콘솔에서 수동으로 바꾼 부분을 찾아냅니다. 템플릿과 실제 상태의 차이를 감사할 때 씁니다.',
        body_en: 'Finds resources changed manually in the console, auditing the gap between template and reality.' }
    ]
  },

  costmgmt: {
    summary_ko: '비용을 보고, 예측하고, 한도를 넘으면 알리는 도구들',
    summary_en: 'Tools to see, forecast, and alert on spending',
    plain_ko: '비용 관리 도구들은 하나의 제품이 아니라, 지출을 보여주는 방식이 서로 다른 여러 개의 관리형 대시보드·알림 도구 묶음입니다. 가계부 앱(Cost Explorer, 추세와 예측), 카드 한도 초과 문자(Budgets, 한도 초과 알림), 상세 명세서(Cost and Usage Report, 원본 청구 데이터)를 각자 다른 목적으로 쓰는 것과 같습니다.',
    plain_en: 'The cost management tools are not one product — they are a family of managed dashboards and alerting tools, each showing spending differently. It is like using a budgeting app (Cost Explorer: trends and forecasts), a credit-limit text alert (Budgets: threshold notifications), and a detailed itemized statement (the Cost and Usage Report: raw billing data) — each for its own purpose.',
    desc_ko: 'Cost Explorer는 지출을 분석·예측하고, AWS Budgets는 예산 초과를 알리며, Cost and Usage Report는 상세 청구 데이터를 제공합니다. 시험에서는 셋을 목적별로 구분합니다.',
    desc_en: 'Cost Explorer analyses and forecasts spend, AWS Budgets alerts on overruns, and the Cost and Usage Report provides detailed billing data. The exam separates them by purpose.',
    points: [
      { ko: '용도별 구분', en: 'Which tool for what',
        body_ko: '"지출 추세 분석·예측"은 Cost Explorer, "한도 초과 시 알림"은 Budgets, "청구 데이터를 원본으로 분석"은 Cost and Usage Report입니다.',
        body_en: 'Trend analysis and forecasting → Cost Explorer. Alert on exceeding a threshold → Budgets. Raw billing data for analysis → Cost and Usage Report.' },
      { ko: '태그 기반 비용 배분', en: 'Cost allocation tags',
        body_ko: '비용 배분 태그를 활성화하면 부서·프로젝트별로 지출을 나눠 볼 수 있습니다. "어느 팀이 얼마 썼는지"의 정답입니다.',
        body_en: 'Activating cost allocation tags splits spend by department or project — the answer to "which team spent what".' },
      { ko: 'Budgets로 임계값 알림', en: 'Budgets for threshold alerts',
        body_ko: 'Budgets는 비용·사용량·예약 사용률에 한도를 걸고 넘어설 때 SNS로 알립니다. 실제 지출뿐 아니라 예측치를 기준으로도 알림을 걸 수 있는 것이 시험 포인트입니다. 조직 차원에서는 관리 계정에 예산을 만들고 계정이나 태그로 필터링합니다. "지출이 한도를 넘으면 통보"는 Budgets, "왜 늘었는지 분석"은 Cost Explorer입니다.',
        body_en: 'Budgets set limits on cost, usage, or reservation utilization and notify through SNS when they are crossed. The exam point is that alerts can fire on forecasts, not just actual spend. At organization level, create budgets in the management account and filter by account or tag. "Notify when spend exceeds a limit" is Budgets; "analyze why it grew" is Cost Explorer.' }
    ]
  },

  trustedadvisor: {
    summary_ko: '비용·보안·성능·내결함성을 점검하는 자동 권고',
    summary_en: 'Automated recommendations across cost, security, performance, and fault tolerance',
    plain_ko: 'Trusted Advisor는 사람이 아니라, 계정 전체를 자동으로 훑어 낭비되는 자원·뚫려 있는 보안 설정·한도 임박 상황을 짚어주는 관리형 점검 서비스입니다. 정기 건강검진처럼 계정 구석구석을 자동으로 진단해 문제가 될 만한 부분을 미리 알려주지만, 전체 검사 항목을 다 보려면 유료 지원 플랜이 필요합니다.',
    plain_en: 'Trusted Advisor is not a person — it is a managed checkup service that automatically scans an entire account for wasted resources, exposed security settings, and looming service limits. Like a routine physical exam, it automatically diagnoses trouble spots across the account before they become problems, though seeing the full set of checks requires a paid support plan.',
    desc_ko: 'Trusted Advisor는 계정을 훑어 유휴 리소스, 공개된 보안 그룹, 서비스 한도 임박 같은 항목을 권고합니다. 전체 점검 항목은 Business 이상 지원 플랜에서 열립니다.',
    desc_en: 'Trusted Advisor scans the account for idle resources, open security groups, and service limits nearing capacity. The full check set requires Business support or higher.',
    points: [
      { ko: '지원 플랜 제약', en: 'Support-plan gate',
        body_ko: '무료로는 일부 검사만 제공되고 전체 검사는 Business·Enterprise 플랜이 필요합니다. 이 조건이 정답 판단에 쓰입니다.',
        body_en: 'Only a subset is free; the complete checks require Business or Enterprise support — a condition used to pick the answer.' }
    ]
  },

  /* ======================================================================
     MIGRATION & TRANSFER
     ====================================================================== */
  storagegw: {
    summary_ko: '온프레미스에서 AWS 스토리지를 로컬처럼 쓰게 하는 하이브리드 관문',
    summary_en: 'A hybrid gateway making AWS storage look local to on-premises systems',
    plain_ko: 'Storage Gateway는 새로운 물리 저장 장치가 아니라, 온프레미스에 설치하는 가상 어플라이언스(소프트웨어)로, 로컬에서는 평범한 파일 서버처럼 보이지만 실제 데이터는 뒤에서 S3·Glacier로 흘려보내는 하이브리드 관문입니다. 사무실 안에 놓인 평범해 보이는 상자이지만, 사실 그 상자 뒤로 클라우드 창고까지 이어지는 파이프가 연결된 것과 같습니다.',
    plain_en: 'Storage Gateway is not new physical storage hardware — it is a virtual appliance (software) installed on-premises that looks like an ordinary file server locally, while actually streaming the real data behind the scenes into S3 or Glacier. It looks like a plain box sitting in an office, but that box is secretly piped straight through to a cloud warehouse.',
    desc_ko: 'Storage Gateway는 온프레미스에 가상 어플라이언스를 두고 NFS·SMB·iSCSI로 노출하면서 실제 데이터는 S3·Glacier에 저장합니다. 자주 쓰는 데이터는 로컬 캐시에 남아 지연시간이 낮습니다.',
    desc_en: 'Storage Gateway runs an appliance on-premises exposing NFS, SMB, or iSCSI while data lives in S3 or Glacier, with a local cache keeping hot data fast.',
    points: [
      { ko: '세 가지 유형', en: 'Three gateway types',
        body_ko: 'File Gateway는 NFS·SMB로 S3에 파일 저장, Volume Gateway는 iSCSI 블록 볼륨(캐시형·저장형), Tape Gateway는 기존 백업 소프트웨어의 가상 테이프 라이브러리입니다.',
        body_en: 'File Gateway stores files in S3 over NFS/SMB. Volume Gateway presents iSCSI block volumes (cached or stored). Tape Gateway emulates a tape library for existing backup software.' },
      { ko: '용량 확장 + 저지연 유지', en: 'Extend capacity while staying fast',
        body_ko: '"온프레미스 저장 공간이 부족한데 최근 파일은 빠르게 접근해야 한다"는 문제의 표준 정답입니다. 수명주기 정책과 함께 오래된 파일을 Glacier로 보냅니다.',
        body_en: 'The standard answer to "we are out of local capacity but recent files must stay fast", paired with lifecycle rules moving old files to Glacier.' },
      { ko: '테이프 교체', en: 'Replacing physical tape',
        body_ko: '기존 백업 소프트웨어를 그대로 쓰면서 물리 테이프를 없애라는 요구에는 Tape Gateway가 정답입니다.',
        body_en: 'When physical tape must go but the backup software must stay, Tape Gateway is the answer.' }
    ]
  },

  datasync: {
    summary_ko: '온프레미스와 AWS 사이 대량 파일을 빠르게 온라인 전송',
    summary_en: 'Fast online bulk file transfer between on-premises and AWS',
    plain_ko: 'DataSync는 물리 장비가 아니라, 온프레미스 저장소와 AWS 사이에서 대량의 파일을 온라인으로 빠르게 옮겨주는 관리형 전송 소프트웨어(에이전트)입니다. 온라인으로 짐을 옮겨주는 자동화된 이삿짐 트럭 서비스라고 생각하면 되며, 검증과 증분 전송까지 대신 처리해 줍니다.',
    plain_en: 'DataSync is not physical equipment — it is a managed transfer software (an agent) that moves large amounts of files quickly online between on-premises storage and AWS. Think of it as an automated moving-truck service that shuttles boxes over the internet, handling verification and incremental syncing along the way.',
    desc_ko: 'DataSync는 에이전트를 통해 NFS·SMB·HDFS의 대량 데이터를 S3·EFS·FSx로 자동 전송하며 검증과 증분 동기화를 지원합니다. 지속적인 동기화나 일회성 마이그레이션 모두에 씁니다.',
    desc_en: 'DataSync moves bulk data from NFS, SMB, or HDFS into S3, EFS, or FSx through an agent, with verification and incremental sync — for one-time migrations or ongoing replication.',
    points: [
      { ko: 'Snowball과의 갈림길', en: 'The fork with Snowball',
        body_ko: '네트워크 대역폭이 충분하면 DataSync, 대역폭이 부족하거나 데이터가 수십 TB 이상이라 전송에 몇 주 걸리면 Snowball입니다. "가장 적은 네트워크 대역폭 사용"이 Snowball 신호입니다.',
        body_en: 'Adequate bandwidth → DataSync. Insufficient bandwidth or tens of TB that would take weeks → Snowball. "Using the least network bandwidth" signals Snowball.' },
      { ko: 'Storage Gateway와의 구분', en: 'Versus Storage Gateway',
        body_ko: 'DataSync는 데이터를 옮기는 전송 도구, Storage Gateway는 계속 로컬처럼 접근하게 하는 상시 관문입니다. "마이그레이션"이면 DataSync, "계속 하이브리드로 쓴다"면 Storage Gateway입니다.',
        body_en: 'DataSync moves data; Storage Gateway keeps providing local-style access. "Migrate" → DataSync. "Keep using it in hybrid mode" → Storage Gateway.' }
    ]
  },

  dms: {
    summary_ko: '데이터베이스를 최소 다운타임으로 이전',
    summary_en: 'Migrates databases with minimal downtime',
    plain_ko: 'DMS는 새로운 데이터베이스가 아니라, 기존 데이터베이스를 서비스 중단 없이 새로운 데이터베이스로 옮겨주는 관리형 복제·이전 서비스입니다. 원래 사무실이 계속 영업하는 동안 서류를 조금씩 새 사무실로 옮기고, 마지막 순간에만 잠깐 문을 닫고 전환하는 이사 도우미와 같습니다.',
    plain_en: 'DMS is not a new database — it is a managed replication and migration service that moves data from an existing database into a new one without stopping service. It works like a moving assistant who gradually relocates files to the new office while the old one keeps operating, closing the doors only for a brief moment at the very end to complete the switch.',
    desc_ko: 'DMS는 원본 DB가 계속 서비스하는 동안 데이터를 복제해 옮기고, 전환 시점에만 잠깐 멈춥니다. 엔진이 다르면 Schema Conversion Tool과 함께 씁니다.',
    desc_en: 'DMS replicates while the source keeps serving, pausing only at cutover. When engines differ, it pairs with the Schema Conversion Tool.',
    points: [
      { ko: '동종 vs 이기종', en: 'Homogeneous vs heterogeneous',
        body_ko: 'Oracle→Oracle 같은 동종 이전은 DMS만으로 충분합니다. Oracle→Aurora PostgreSQL 같은 이기종은 SCT로 스키마를 변환한 뒤 DMS로 데이터를 옮깁니다.',
        body_en: 'Homogeneous moves such as Oracle to Oracle need only DMS. Heterogeneous moves such as Oracle to Aurora PostgreSQL convert the schema with SCT first, then move data with DMS.' },
      { ko: '지속적 복제(CDC)', en: 'Continuous replication (CDC)',
        body_ko: '변경 데이터 캡처로 원본의 변경을 계속 따라가므로 다운타임을 몇 분 수준으로 줄일 수 있습니다.',
        body_en: 'Change data capture keeps following the source, shrinking downtime to minutes.' }
    ]
  },

  snowball: {
    summary_ko: '물리 장비로 대용량 데이터를 실어 나르는 오프라인 전송',
    summary_en: 'Offline transfer that physically ships bulk data',
    plain_ko: 'Snowball은 가상의 서비스가 아니라, AWS가 실제로 우편으로 보내주는 물리 장비(휴대용 저장 장치)입니다. 데이터를 이 장치에 담아 다시 AWS로 부치면 그제야 S3에 업로드되는 방식으로, 네트워크가 아니라 트럭·택배로 데이터를 실어 나르는 진짜 오프라인 이사 방법입니다.',
    plain_en: 'Snowball is not a virtual service — it is genuine physical hardware (a portable storage appliance) that AWS actually ships out by mail. Data is loaded onto the device and shipped back, after which AWS uploads it into S3 — a real offline move that carries data by truck and courier rather than over the network.',
    desc_ko: 'Snow 제품군은 AWS가 보낸 장비에 데이터를 담아 되돌려주면 S3에 적재하는 방식입니다. 네트워크로 보내면 몇 주에서 몇 달이 걸리는 규모에서 정답이 됩니다.',
    desc_en: 'The Snow family ships a device you fill and return, after which AWS loads the data into S3. It wins when a network transfer would take weeks or months.',
    points: [
      { ko: '용량별 선택', en: 'Choosing by capacity',
        body_ko: 'Snowcone은 수 TB의 소형·엣지용, Snowball Edge는 수십 TB 규모의 표준 선택, Snowmobile은 100PB급 데이터센터 통째 이전용입니다.',
        body_en: 'Snowcone handles a few TB at the edge, Snowball Edge is the standard choice for tens of TB, and Snowmobile moves exabyte-class data centres.' },
      { ko: '대역폭이 결정적 단서', en: 'Bandwidth is the decisive clue',
        body_ko: '"제한된 대역폭", "네트워크를 최소한으로 사용", "전송에 수 주가 걸린다"가 명시되면 Snowball입니다. 그렇지 않으면 DataSync가 더 빠르고 간단합니다.',
        body_en: '"Limited bandwidth", "use the least network", or "would take weeks" mean Snowball. Otherwise DataSync is faster and simpler.' }
    ]
  },

  transferfamily: {
    summary_ko: 'SFTP·FTPS·FTP로 S3에 직접 올리게 해주는 관리형 서비스',
    summary_en: 'Managed SFTP, FTPS, and FTP endpoints writing straight into S3',
    plain_ko: 'Transfer Family는 새로운 프로토콜이 아니라, 거래처가 이미 쓰던 SFTP·FTP 방식 그대로 파일을 보낼 수 있게 해주면서 실제 저장 위치만 S3로 바꿔주는 관리형 서비스입니다. 우체통 투입구는 그대로 두고, 그 뒤에 있던 낡은 서류함만 몰래 클라우드 창고로 바꿔 놓은 것과 같습니다.',
    plain_en: 'Transfer Family is not a new protocol — it is a managed service that lets partners keep sending files exactly the way they always did, over SFTP or FTP, while the actual storage behind it becomes S3. It is like leaving the mail slot exactly as it was, but secretly swapping the old filing cabinet behind it for a cloud warehouse.',
    desc_ko: 'Transfer Family는 기존 SFTP 클라이언트와 파트너 워크플로를 그대로 두고 저장소만 S3·EFS로 바꿉니다. "파트너가 SFTP로 파일을 보낸다"는 조건의 정답입니다.',
    desc_en: 'Transfer Family keeps existing SFTP clients and partner workflows while the storage becomes S3 or EFS — the answer when partners upload over SFTP.',
    points: [
      { ko: 'FTP 서버 운영 제거', en: 'Removes FTP server operations',
        body_ko: 'EC2에 SFTP 서버를 직접 세우는 선택지보다 운영 부담이 적어 정답이 됩니다. 인증은 IAM이나 기존 디렉터리와 연동합니다.',
        body_en: 'It beats running an SFTP server on EC2 on operational overhead, with authentication tied to IAM or an existing directory.' }
    ]
  },

  /* ======================================================================
     EXAM INTENT — the "knots" that tie services together
     ====================================================================== */
  opex: {
    summary_ko: '문제에서 가장 자주 나오는 판단 기준. 관리형·서버리스가 이긴다',
    summary_en: 'The most common tie-breaker: managed and serverless win',
    plain_ko: '이것은 특정 서비스의 이름이 아니라, 시험 문제가 반복해서 요구하는 하나의 판단 기준("운영 부담을 최소화하라")을 가리키는 추상적인 개념입니다. 직접 관리하고 고쳐야 하는 자체 장비보다 관리와 유지보수를 남(AWS)에게 맡기는 서비스를 고르라는 원칙이며, 정비까지 맡겨서 렌트카를 빌리는 것과 차를 사서 직접 정비하는 것 중 부담이 적은 쪽을 고르는 것과 같습니다.',
    plain_en: 'This is not the name of a specific service — it is an abstract judging criterion the exam keeps testing: "minimize operational overhead." It is the principle of choosing a service where someone else (AWS) handles the upkeep, rather than equipment that must be maintained directly — like choosing a rental car with maintenance included over buying a car and servicing it personally.',
    desc_ko: '"LEAST operational overhead"는 684문제 중 134문제에 등장하는 최다 빈출 조건입니다. 기능이 같아 보이는 선택지가 둘 이상이면, 사람이 서버를 패치·확장·모니터링할 필요가 없는 쪽이 정답입니다.',
    desc_en: '"Least operational overhead" appears in 134 of the 684 questions — the single most common qualifier. When two options look functionally equal, the one requiring no human patching, scaling, or monitoring wins.',
    points: [
      { ko: '관리 부담 서열', en: 'The overhead ladder',
        body_ko: '서버리스(Lambda·Fargate·DynamoDB·Athena) < 관리형(RDS·ElastiCache·MSK) < 자체 운영(EC2에 직접 설치). 문제에 이 조건이 있으면 EC2에 무언가를 설치하는 선택지부터 지우세요.',
        body_en: 'Serverless (Lambda, Fargate, DynamoDB, Athena) < managed (RDS, ElastiCache, MSK) < self-hosted on EC2. When this qualifier appears, eliminate the "install it on EC2" options first.' },
      { ko: '자주 나오는 대체 쌍', en: 'Recurring substitutions',
        body_ko: '크론 서버 → EventBridge 스케줄, 자체 SFTP 서버 → Transfer Family, 직접 짠 스냅샷 스크립트 → AWS Backup, 자체 Hadoop → Glue/Athena.',
        body_en: 'Cron server → EventBridge schedule. Self-hosted SFTP → Transfer Family. Hand-written snapshot scripts → AWS Backup. Self-managed Hadoop → Glue or Athena.' },
      { ko: '비용과 충돌할 때', en: 'When it conflicts with cost',
        body_ko: '운영 부담 최소화와 최저 비용이 함께 나오면 문제의 대문자 강조(MOST/LEAST)를 보고 무엇이 진짜 기준인지 판단하세요. 대개 강조된 쪽이 우선입니다.',
        body_en: 'When both least overhead and lowest cost appear, the capitalised qualifier (MOST/LEAST) tells you which one actually decides.' }
    ]
  },

  latency: {
    summary_ko: '지연시간·처리량 요구. 캐시와 엣지가 답인 경우가 많다',
    summary_en: 'Latency and throughput requirements, usually answered by caching and edges',
    plain_ko: '이것은 하나의 서비스가 아니라, "응답이 느리다"는 문제를 어디서 왜 느린지에 따라 여러 서비스로 풀어내는 시험의 한 유형(추상적 주제)입니다. 사용자와의 물리적 거리 때문인지, 같은 질문을 매번 다시 계산해서인지, 디스크가 느려서인지에 따라 CDN·캐시·스토리지 중 정답이 달라집니다.',
    plain_en: 'This is not a single service — it is a category of exam question (an abstract theme) that solves "the response is slow" with different services depending on where the slowness actually lives. Whether it is physical distance to the user, recalculating the same answer every time, or a slow disk, the correct fix shifts among a CDN, a cache, or faster storage.',
    desc_ko: '108문제가 성능을 조건으로 겁니다. 어디에서 느린지 짚어내면 답이 정해집니다 — 사용자와 서버의 거리인가, 반복 DB 조회인가, 디스크 IOPS인가.',
    desc_en: '108 questions gate on performance. Identify where the slowness lives — distance to the user, repeated database reads, or disk IOPS — and the answer follows.',
    points: [
      { ko: '거리 문제', en: 'Distance problems',
        body_ko: '"전 세계 사용자가 느리다"면 캐시 가능한 HTTP는 CloudFront, 비-HTTP나 고정 IP는 Global Accelerator, DNS 수준 분배는 Route 53 지연시간 라우팅입니다.',
        body_en: 'For "global users see high latency": cacheable HTTP → CloudFront, non-HTTP or static IPs → Global Accelerator, DNS-level steering → Route 53 latency routing.' },
      { ko: '반복 조회 문제', en: 'Repeated-read problems',
        body_ko: '같은 쿼리가 반복되면 ElastiCache(범용)나 DAX(DynamoDB 전용)를 앞에 둡니다. 읽기 부하 자체를 나누려면 읽기 전용 복제본입니다.',
        body_en: 'Repeated queries call for ElastiCache (general) or DAX (DynamoDB). To split the read load itself, use read replicas.' },
      { ko: '스토리지 성능 문제', en: 'Storage performance',
        body_ko: 'IOPS가 부족하면 gp3에서 IOPS를 올리거나 io2로 바꿉니다. 대규모 병렬 처리량이 필요하면 FSx for Lustre입니다.',
        body_en: 'Insufficient IOPS → raise gp3 IOPS or move to io2. Massive parallel throughput → FSx for Lustre.' }
    ]
  },

  cost: {
    summary_ko: '비용 최적화 요구. 사용 패턴이 곧 정답의 근거',
    summary_en: 'Cost optimisation, where the usage pattern decides the answer',
    plain_ko: '이것은 하나의 서비스가 아니라, "어떻게 하면 더 싸게 할 수 있는가"라는 시험의 판단 기준(추상적 주제)입니다. 정답은 언제나 "이 자원을 얼마나 자주, 얼마나 오래 쓰는가"라는 사용 패턴을 먼저 읽고 그에 맞는 구매 옵션이나 스토리지 등급을 고르는 문제로 귀결됩니다.',
    plain_en: 'This is not a single service — it is an abstract exam theme: "how can this be done more cheaply." The answer always comes down to first reading the usage pattern — how often and how long a resource is used — and then picking the matching purchase option or storage tier.',
    desc_ko: '101문제가 비용을 기준으로 삼습니다. "얼마나 자주, 얼마나 오래 쓰는가"를 읽어내면 스토리지 클래스와 구매 옵션이 자동으로 결정됩니다.',
    desc_en: '101 questions turn on cost. Read how often and how long something is used, and the storage class or purchase option follows automatically.',
    points: [
      { ko: '컴퓨팅 비용 판단', en: 'Compute cost decisions',
        body_ko: '중단 가능·배치 → Spot. 24시간 상시 → Reserved·Savings Plans. 간헐적·예측 불가 → 서버리스(Lambda·Fargate·Aurora Serverless).',
        body_en: 'Interruptible batch → Spot. Always-on → Reserved or Savings Plans. Intermittent or unpredictable → serverless (Lambda, Fargate, Aurora Serverless).' },
      { ko: '스토리지 비용 판단', en: 'Storage cost decisions',
        body_ko: '접근 빈도가 떨어지면 수명주기로 IA·Glacier 전환. 패턴을 모르면 Intelligent-Tiering. 재생성 가능하면 One Zone-IA.',
        body_en: 'Declining access → lifecycle to IA then Glacier. Unknown pattern → Intelligent-Tiering. Reproducible data → One Zone-IA.' },
      { ko: '숨은 데이터 전송 비용', en: 'Hidden data-transfer cost',
        body_ko: 'NAT 게이트웨이 처리 요금, 리전 간 전송, 인터넷 아웃바운드가 큰 비용입니다. VPC 엔드포인트와 CloudFront가 이를 줄이는 정답입니다.',
        body_en: 'NAT processing, cross-Region transfer, and internet egress dominate. VPC endpoints and CloudFront are the answers that shrink them.' }
    ]
  },

  hybrid: {
    summary_ko: '온프레미스와 AWS를 잇는 요구. 연결·전송·확장 셋 중 하나',
    summary_en: 'On-premises integration, reducing to connectivity, transfer, or capacity',
    plain_ko: '이것은 특정 상품 이름이 아니라, 온프레미스와 AWS를 함께 쓰는 상황 전반을 가리키는 추상적인 주제입니다. 문제의 진짜 요구가 네트워크 연결인지, 일회성 데이터 이전인지, 상시 스토리지 확장인지에 따라 VPN·DataSync·Storage Gateway처럼 전혀 다른 서비스가 정답이 됩니다.',
    plain_en: 'This is not the name of a specific product — it is an abstract umbrella theme covering any scenario where on-premises and AWS work together. Depending on whether the real requirement is network connectivity, a one-time data move, or ongoing storage extension, the correct service is entirely different — VPN, DataSync, or Storage Gateway.',
    desc_ko: '98문제가 온프레미스를 언급합니다. 요구가 네트워크 연결인지, 일회성 데이터 이전인지, 상시 스토리지 확장인지 구분하면 서비스가 정해집니다.',
    desc_en: '98 questions mention on-premises. Separating network connectivity from one-time data movement from ongoing storage extension picks the service.',
    points: [
      { ko: '연결이 목적이면', en: 'When connectivity is the goal',
        body_ko: '빠르고 저렴하게는 Site-to-Site VPN, 일관된 대역폭·낮은 지연은 Direct Connect, VPC가 많으면 Transit Gateway입니다.',
        body_en: 'Quick and cheap → Site-to-Site VPN. Consistent bandwidth and low latency → Direct Connect. Many VPCs → Transit Gateway.' },
      { ko: '데이터 이전이 목적이면', en: 'When data movement is the goal',
        body_ko: '대역폭이 충분하면 DataSync, 부족하면 Snowball, 데이터베이스면 DMS입니다.',
        body_en: 'Enough bandwidth → DataSync. Not enough → Snowball. Databases → DMS.' },
      { ko: '상시 하이브리드 운영이면', en: 'When hybrid operation continues',
        body_ko: '로컬 접근을 유지하며 용량을 늘리려면 Storage Gateway, AWS 하드웨어가 현장에 있어야 하면 Outposts입니다.',
        body_en: 'Extend capacity while keeping local access → Storage Gateway. AWS hardware must sit on site → Outposts.' }
    ]
  },

  ha: {
    summary_ko: '고가용성 요구. 단일 AZ·단일 인스턴스 선택지는 전부 오답',
    summary_en: 'High availability: every single-AZ, single-instance option is wrong',
    plain_ko: '고가용성(HA)은 구매할 수 있는 제품이 아니라, "단일 지점이 죽어도 서비스는 계속되어야 한다"는 설계 목표(추상적 개념)입니다. 다리 하나가 부러져도 넘어지지 않는 의자를 만들려면 다리를 여러 개 두어야 하는 것처럼, 이 목표를 이루는 실제 수단은 다중 AZ·여러 인스턴스·여러 NAT 게이트웨이처럼 서비스마다 다릅니다.',
    plain_en: 'High availability (HA) is not a purchasable product — it is an abstract design goal: "the service must keep running even if one single point fails." Just as a chair needs more than one leg to stay standing if one leg breaks, the actual mechanisms that achieve this goal differ by service — multiple AZs, multiple instances, multiple NAT gateways, and so on.',
    desc_ko: '74문제가 고가용성이나 내결함성을 요구합니다. 이 조건이 보이면 단일 지점 장애가 남아 있는 선택지를 먼저 제거하는 것이 가장 빠른 풀이법입니다.',
    desc_en: '74 questions demand high availability or fault tolerance. The fastest approach is to eliminate every option that leaves a single point of failure.',
    points: [
      { ko: '계층별 이중화 방법', en: 'Redundancy per tier',
        body_ko: '웹·앱 계층은 ALB + ASG 다중 AZ, 관계형 DB는 RDS Multi-AZ 또는 Aurora, 파일은 EFS, 세션은 ElastiCache·DynamoDB로 빼기.',
        body_en: 'Web and app tiers → ALB with a multi-AZ ASG. Relational database → RDS Multi-AZ or Aurora. Files → EFS. Sessions → ElastiCache or DynamoDB.' },
      { ko: '자주 놓치는 단일 지점', en: 'Commonly missed single points',
        body_ko: 'NAT 게이트웨이 하나, Direct Connect 회선 하나, 단일 AZ 서브넷 구성이 대표적입니다. 각각 AZ별 NAT, VPN 백업, 다중 AZ 서브넷으로 해결합니다.',
        body_en: 'One NAT gateway, one Direct Connect circuit, or subnets in a single AZ. Fix with per-AZ NATs, a VPN backup, and subnets across AZs.' }
    ]
  },

  scalab: {
    summary_ko: '확장성 요구. 예측 불가한 부하는 자동 확장이나 서버리스로',
    summary_en: 'Scalability: unpredictable load calls for auto scaling or serverless',
    plain_ko: '확장성은 하나의 상품이 아니라, "부하가 얼마나 늘어나도 감당할 수 있어야 한다"는 설계 목표(추상적 개념)입니다. 좌석이 고정된 식당은 손님이 몰리면 대기줄이 생기지만, 필요할 때마다 테이블을 더 꺼내 쓸 수 있는 구조를 만드는 것이 핵심이며, 실제로는 오토스케일링이나 서버리스 서비스로 구현됩니다.',
    plain_en: 'Scalability is not a single product — it is an abstract design goal: "the system must absorb however much the load grows." A restaurant with a fixed number of seats forms a line when it gets busy, whereas the goal here is a setup that can pull out more tables whenever needed — in practice implemented through auto scaling or serverless services.',
    desc_ko: '63문제가 확장성을 조건으로 겁니다. "예측할 수 없다", "급증한다", "수백만 사용자" 같은 표현이 나오면 고정 용량 선택지는 모두 오답입니다.',
    desc_en: '63 questions gate on scalability. Phrases like "unpredictable", "spikes suddenly", or "millions of users" eliminate every fixed-capacity option.',
    points: [
      { ko: '계층별 확장 수단', en: 'Scaling per tier',
        body_ko: '컴퓨팅은 ASG나 Lambda, 데이터베이스는 DynamoDB On-Demand나 Aurora Serverless, 큐로 부하를 흡수하려면 SQS입니다.',
        body_en: 'Compute → ASG or Lambda. Database → DynamoDB on-demand or Aurora Serverless. Absorbing bursts → SQS.' },
      { ko: '수직 확장은 대개 오답', en: 'Vertical scaling is usually wrong',
        body_ko: '"더 큰 인스턴스로 바꾼다"는 상한이 있고 재시작이 필요해 확장성 문제의 정답이 되기 어렵습니다. 수평 확장 선택지를 우선 보세요.',
        body_en: '"Move to a larger instance" has a ceiling and needs a restart, so it rarely answers a scalability question. Prefer the horizontal option.' }
    ]
  },

  multiaz: {
    summary_ko: '가용 영역을 넘어 이중화하는 가장 기본적인 가용성 장치',
    summary_en: 'The most basic availability mechanism: redundancy across Availability Zones',
    plain_ko: 'Multi-AZ는 특정 서비스의 이름이 아니라, "물리적으로 떨어진 여러 데이터센터(가용 영역, AZ)에 똑같은 데이터를 동시에 복제해 두는 설계 방식"을 가리키는 추상적인 개념입니다. 건물 하나(AZ 하나)가 정전이나 화재로 통째로 멈춰도, 다른 건물에 있는 복사본이 곧바로 이어받아 서비스가 끊기지 않게 하는 게 핵심 아이디어입니다. RDS, Aurora 등 여러 서비스에 공통으로 적용되는 원칙이라, "Multi-AZ"라는 하나의 상품이 따로 있는 게 아닙니다.',
    plain_en: 'Multi-AZ is not the name of a specific product — it is an abstract design pattern: replicating the same data, at the same time, across multiple physically separate data centers (Availability Zones). The core idea is that if one building (one AZ) loses power or catches fire, the copy in another building takes over instantly so the service never goes down. It is a principle applied across many services (RDS, Aurora, and others), not a single purchasable item called "Multi-AZ."',
    desc_ko: 'AZ는 물리적으로 분리된 데이터센터 묶음입니다. 여러 AZ에 리소스를 두면 한 곳이 통째로 소실돼도 서비스가 유지됩니다. 56문제가 이 개념을 직접 다룹니다.',
    desc_en: 'An AZ is a physically separate cluster of data centres. Spreading resources across AZs keeps the service alive when one is lost entirely — the direct subject of 56 questions.',
    points: [
      { ko: 'RDS Multi-AZ의 정확한 의미', en: 'What RDS Multi-AZ actually does',
        body_ko: '동기 복제된 대기 인스턴스를 다른 AZ에 두고 장애 시 자동 전환합니다. 읽기 성능은 개선되지 않으며, 그건 읽기 전용 복제본의 역할입니다.',
        body_en: 'It keeps a synchronously replicated standby in another AZ and fails over automatically. It does not improve read performance — that is what read replicas do.' },
      { ko: '리전 장애는 못 막는다', en: 'It does not survive a Region failure',
        body_ko: 'Multi-AZ는 한 리전 안의 이중화입니다. 리전 전체 장애에 대비하려면 리전 간 복제(CRR, Aurora Global Database, Route 53 장애 조치)가 필요합니다.',
        body_en: 'Multi-AZ is redundancy within one Region. Surviving a Region-wide failure requires cross-Region replication such as CRR, Aurora Global Database, and Route 53 failover.' }
    ]
  },

  encryption: {
    summary_ko: '저장·전송 중 암호화 요구. 대부분 KMS 연동으로 해결',
    summary_en: 'Encryption at rest and in transit, usually solved through KMS',
    plain_ko: '이것은 하나의 서비스가 아니라, "저장된 데이터"와 "오가는 데이터"를 각각 읽을 수 없게 암호로 잠가야 한다는 요구(추상적 주제)입니다. 서류를 금고에 넣어 두는 것(저장 중 암호화)과 서류를 봉투에 넣어 배달하는 것(전송 중 암호화)은 서로 다른 문제이며, 실제 잠금장치 역할은 KMS 같은 서비스가 맡습니다.',
    plain_en: 'This is not a single service — it is an abstract requirement: data "at rest" and data "in transit" each need to be locked so nobody unauthorized can read them. Putting a document in a safe (encryption at rest) and sealing it in an envelope for delivery (encryption in transit) are two different problems, and the actual locking mechanism is provided by a service such as KMS.',
    desc_ko: '54문제가 암호화를 요구합니다. 저장 중(at rest)인지 전송 중(in transit)인지 구분하고, 키를 누가 통제해야 하는지 읽어내면 답이 정해집니다.',
    desc_en: '54 questions require encryption. Separate at-rest from in-transit and read who must control the keys, and the answer is determined.',
    points: [
      { ko: '저장 중 암호화', en: 'At rest',
        body_ko: 'S3는 SSE-S3(AWS 관리)·SSE-KMS(고객 키·감사 가능)·SSE-C(고객 제공 키), EBS·RDS·EFS는 KMS 키로 생성 시 활성화합니다. 이미 만든 RDS를 암호화하려면 스냅샷을 암호화 복사해 복원합니다.',
        body_en: 'S3 offers SSE-S3, SSE-KMS (customer key, auditable), and SSE-C. EBS, RDS, and EFS enable KMS encryption at creation. Encrypting an existing RDS means copying its snapshot with encryption and restoring.' },
      { ko: '전송 중 암호화', en: 'In transit',
        body_ko: 'ACM 인증서로 HTTPS/TLS를 종료하고, 내부 통신도 TLS를 요구하면 대상 그룹까지 HTTPS로 구성합니다.',
        body_en: 'Terminate HTTPS/TLS with ACM certificates, and configure HTTPS to the target group when internal traffic must also be encrypted.' },
      { ko: '키 통제 요구의 신호', en: 'Signals about key control',
        body_ko: '"키를 직접 관리·감사·교체해야 한다"면 고객 관리형 KMS 키, "AWS도 접근하면 안 된다"·"FIPS 140-2 레벨 3"이면 CloudHSM입니다.',
        body_en: '"We must manage, audit, and rotate the keys" → customer-managed KMS key. "Not even AWS may access it" or "FIPS 140-2 Level 3" → CloudHSM.' }
    ]
  },

  compliance: {
    summary_ko: '규정 준수·감사 요구. 기록·불변성·최소 권한이 핵심',
    summary_en: 'Compliance and audit: logging, immutability, and least privilege',
    plain_ko: '이것은 하나의 서비스가 아니라, 법이나 규정을 지키고 있음을 증명해야 하는 요구 전반(추상적 주제)을 가리킵니다. "누가 무엇을 했는가", "설정이 규칙을 따르는가", "민감 정보가 새어나가지 않았는가" 중 무엇을 증명해야 하느냐에 따라 CloudTrail·Config·Macie처럼 완전히 다른 서비스가 정답이 됩니다.',
    plain_en: 'This is not a single service — it is an abstract theme covering any requirement to prove that laws or regulations are being followed. Depending on what must be proven — who did what, whether the configuration follows the rule, or whether sensitive data has leaked — an entirely different service such as CloudTrail, Config, or Macie becomes the correct answer.',
    desc_ko: '53문제가 규제나 감사를 언급합니다. 무엇을 증명해야 하는지에 따라 서비스가 갈립니다 — 행위 기록인가, 구성 준수인가, 민감 데이터 탐지인가, 불변 보관인가.',
    desc_en: '53 questions mention regulation or audit. What must be proven picks the service: action history, configuration compliance, sensitive-data discovery, or immutable retention.',
    points: [
      { ko: '증명 대상별 서비스', en: 'Service by what must be proven',
        body_ko: '"누가 무엇을 했나" → CloudTrail. "설정이 규칙을 지키나" → Config. "S3에 개인정보가 있나" → Macie. "취약점이 있나" → Inspector.',
        body_en: '"Who did what" → CloudTrail. "Does the configuration follow the rule" → Config. "Is there PII in S3" → Macie. "Are there vulnerabilities" → Inspector.' },
      { ko: '불변 보관', en: 'Immutable retention',
        body_ko: 'S3 Object Lock의 Compliance 모드나 Glacier Vault Lock을 쓰면 보관 기간 내에는 루트 계정도 삭제할 수 없습니다.',
        body_en: 'S3 Object Lock in Compliance mode or Glacier Vault Lock prevents deletion within the retention period even by the root account.' },
      { ko: '데이터 상주 요구', en: 'Data residency',
        body_ko: '데이터가 특정 국가를 벗어나면 안 되면 해당 리전에만 저장하고, 리전 간 복제를 SCP로 차단하며, 필요하면 Outposts를 씁니다.',
        body_en: 'If data may not leave a country, store only in that Region, block cross-Region replication with an SCP, and use Outposts when required.' }
    ]
  },

  dr: {
    summary_ko: '재해 복구. RPO·RTO 숫자가 전략을 결정',
    summary_en: 'Disaster recovery, where the RPO and RTO numbers pick the strategy',
    plain_ko: '재해 복구(DR)는 하나의 상품이 아니라, "재해가 나면 얼마나 빨리, 얼마나 적은 손실로 복구할 것인가"를 두고 비용과 속도를 저울질하는 전략(추상적 개념)입니다. 화재보험처럼 등급이 나뉘어 있어, 예비 부품만 창고에 쌓아 둘지, 아예 똑같은 공장을 하나 더 돌리고 있을지를 요구 조건에 맞춰 고르는 것입니다.',
    plain_en: 'Disaster recovery (DR) is not a single product — it is an abstract strategy of trading cost against speed: "how fast, and with how little loss, must the service recover after a disaster." Like tiers of fire insurance, the choice ranges from simply keeping spare parts in a warehouse to running a second, fully duplicate factory at all times, picked to match the stated requirement.',
    desc_ko: '32문제가 재해 복구를 다룹니다. 문제에 적힌 RPO(허용 데이터 손실)와 RTO(허용 중단 시간)를 읽고 네 가지 전략 중 비용 대비 요건을 만족하는 최소 구성을 고르는 것이 요령입니다.',
    desc_en: '32 questions cover disaster recovery. Read the stated RPO (tolerable data loss) and RTO (tolerable downtime), then pick the cheapest of four strategies that still meets them.',
    points: [
      { ko: '네 가지 전략', en: 'The four strategies',
        body_ko: 'Backup & Restore(가장 저렴, 수 시간) → Pilot Light(핵심만 켜둠, 수십 분) → Warm Standby(축소판 상시 가동, 수 분) → Multi-Site Active-Active(즉시, 가장 비쌈).',
        body_en: 'Backup and restore (cheapest, hours) → pilot light (core only, tens of minutes) → warm standby (scaled-down but running, minutes) → multi-site active-active (immediate, priciest).' },
      { ko: 'RPO와 RTO 읽는 법', en: 'Reading RPO and RTO',
        body_ko: 'RPO는 "얼마나 오래된 데이터까지 잃어도 되는가", RTO는 "얼마나 빨리 복구해야 하는가"입니다. RPO가 거의 0이면 동기·준동기 복제(Aurora Global Database, CRR)가 필요합니다.',
        body_en: 'RPO is how much data loss is acceptable; RTO is how fast service must return. A near-zero RPO demands synchronous or near-synchronous replication such as Aurora Global Database or CRR.' },
      { ko: '과잉 설계도 오답', en: 'Over-engineering is also wrong',
        body_ko: 'RTO가 24시간인데 Active-Active를 고르면 비용 낭비로 오답입니다. 요건을 충족하는 가장 저렴한 전략이 정답입니다.',
        body_en: 'Choosing active-active when the RTO is 24 hours is wrong on cost. The answer is the cheapest strategy that still meets the requirement.' }
    ]
  },

  crossregion: {
    summary_ko: '리전 경계를 넘는 복제. 재해 복구와 전역 지연시간 해결',
    summary_en: 'Replication across Regions for disaster recovery and global latency',
    plain_ko: '이것은 하나의 서비스가 아니라, 데이터를 다른 리전(다른 지리적 지역의 데이터센터 묶음)에도 복제해 두는 기법 전반(추상적 개념)입니다. 중요한 서류의 사본을 다른 도시 사무실에도 보관해 두는 것과 같은 아이디어이며, 그 사본을 만드는 실제 방법은 S3의 CRR, DynamoDB의 Global Tables처럼 서비스마다 다릅니다.',
    plain_en: 'This is not a single service — it is an abstract technique of replicating data into another Region (a physically separate cluster of data centers) as well. The idea is like keeping a copy of an important document in an office in another city, and the actual mechanism differs by service — CRR for S3, Global Tables for DynamoDB, and so on.',
    desc_ko: '리전 간 복제는 리전 전체 장애에 대비하거나 먼 지역 사용자의 지연시간을 줄이려 할 때 씁니다. 서비스마다 수단이 다릅니다.',
    desc_en: 'Cross-Region replication guards against a Region-wide failure and cuts latency for distant users. Each service has its own mechanism.',
    points: [
      { ko: '서비스별 복제 수단', en: 'Mechanism per service',
        body_ko: 'S3는 CRR, RDS는 리전 간 읽기 복제본, Aurora는 Global Database, DynamoDB는 Global Tables, AMI·스냅샷은 복사입니다.',
        body_en: 'S3 → CRR. RDS → cross-Region read replica. Aurora → Global Database. DynamoDB → Global Tables. AMIs and snapshots → copy.' },
      { ko: '트래픽 전환은 별도', en: 'Traffic shifting is separate',
        body_ko: '데이터를 복제해도 사용자를 보조 리전으로 보내는 장치가 필요합니다. Route 53 장애 조치 라우팅이나 Global Accelerator가 그 역할입니다.',
        body_en: 'Replicating data still leaves the need to send users to the secondary Region — that is Route 53 failover routing or Global Accelerator.' }
    ]
  },

  leastpriv: {
    summary_ko: '필요한 최소 권한만 부여. 넓은 권한 선택지는 오답',
    summary_en: 'Grant only what is needed; broad-permission options are wrong',
    plain_ko: '최소 권한 원칙은 서비스가 아니라, "필요한 만큼만 열어주고 그 이상은 절대 주지 않는다"는 보안 설계 원칙(추상적 개념)입니다. 건물 전체 마스터키를 아무에게나 주는 대신, 그 사람이 들어가야 할 방의 열쇠만 딱 맞춰 주는 것과 같은 사고방식이며, IAM 정책의 범위를 좁히는 방식으로 구현됩니다.',
    plain_en: 'Least privilege is not a service — it is an abstract security design principle: "grant only what is needed, and never more." It is the mindset of handing someone the key to exactly the one room they need to enter, instead of a master key to the whole building, implemented in practice by narrowing the scope of IAM policies.',
    desc_ko: '최소 권한 원칙은 IAM 문제의 판단 기준입니다. 같은 기능을 하는 선택지가 여럿이면 권한 범위가 가장 좁은 쪽이 정답입니다.',
    desc_en: 'Least privilege is the tie-breaker in IAM questions: among functionally equivalent options, the narrowest scope wins.',
    points: [
      { ko: '즉시 오답인 표현', en: 'Instantly wrong phrasing',
        body_ko: '"AdministratorAccess 부여", "Action: *, Resource: *", "버킷을 퍼블릭으로", "루트 자격 증명 사용"은 거의 언제나 오답입니다.',
        body_en: '"Attach AdministratorAccess", "Action: * on Resource: *", "make the bucket public", and "use root credentials" are almost always wrong.' },
      { ko: '범위를 좁히는 도구', en: 'Tools that narrow scope',
        body_ko: '리소스 ARN 지정, 조건 키(SourceIp·PrincipalOrgID·MFA), 권한 경계, SCP를 조합해 필요한 만큼만 엽니다.',
        body_en: 'Combine specific resource ARNs, condition keys (SourceIp, PrincipalOrgID, MFA), permission boundaries, and SCPs to open only what is needed.' }
    ]
  },

  decouple: {
    summary_ko: '구성 요소 사이를 큐·토픽으로 끊어 서로의 장애를 격리',
    summary_en: 'Separating components with queues and topics so failures do not propagate',
    plain_ko: '디커플링은 특정 상품 이름이 아니라, 두 시스템이 서로의 상태를 몰라도 되도록 사이를 끊어 놓는 설계 방식(추상적 개념)입니다. 웨이터가 주방에 직접 요리를 시키는 대신 주문서를 주방 창구에 걸어 두기만 하면 주방이 자기 속도로 처리할 수 있는 것처럼, SQS나 SNS 같은 실제 서비스를 중간에 끼워 이 원리를 구현합니다.',
    plain_en: 'Decoupling is not the name of a product — it is an abstract design approach that separates two systems so neither needs to know the state of the other. Like a waiter clipping an order ticket to the kitchen window instead of personally directing the chef, letting the kitchen work at its own pace, this principle is implemented in practice by inserting a real service such as SQS or SNS in between.',
    desc_ko: '디커플링은 생산자가 소비자의 상태를 몰라도 되게 만드는 설계입니다. 한쪽이 느려지거나 죽어도 요청이 유실되지 않고 각자 독립적으로 확장할 수 있습니다.',
    desc_en: 'Decoupling lets a producer stay ignorant of its consumer, so a slow or failed component neither loses requests nor blocks independent scaling.',
    points: [
      { ko: '직접 호출을 큐로 바꾸기', en: 'Replace direct calls with a queue',
        body_ko: '"한 구성 요소의 장애가 전체를 멈춘다", "트래픽 급증에 뒷단이 무너진다"는 문제는 SQS를 사이에 넣는 것이 정답입니다.',
        body_en: '"A failure in one component stops everything" or "spikes overwhelm the backend" is answered by inserting SQS between them.' },
      { ko: '팬아웃이 필요하면 SNS', en: 'Use SNS when fan-out is needed',
        body_ko: '한 이벤트를 여러 시스템이 각자 처리해야 하면 SNS 토픽에 여러 SQS 큐를 구독시킵니다.',
        body_en: 'When several systems must each handle the same event, subscribe multiple SQS queues to one SNS topic.' }
    ]
  }
};

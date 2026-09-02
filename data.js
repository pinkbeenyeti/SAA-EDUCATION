/**
 * AWS SAA-C03 Study Hub - Comprehensive Data Bank
 * Contains 5 AWS Domains, 20+ Detailed Core Services, and Scenario-based Question Bank
 */

const AWS_DOMAINS = [
  {
    id: 'compute',
    title_ko: '컴퓨팅 (Compute)',
    title_en: 'Compute Services',
    icon: '⚡',
    color: '#a855f7',
    description_ko: '가상 머신, 컨테이너, 서버리스 등 클라우드 연산 리소스',
    description_en: 'Scalable computing capacity, containers, and serverless compute resources',
    services: [
      {
        id: 'ec2',
        name: 'Amazon EC2',
        badge: 'IaaS / Virtual Server',
        icon: '🖥️',
        summary_ko: '클라우드 내 안전하고 크기 조정 가능한 가상 컴퓨팅 용량 제공',
        summary_en: 'Secure and resizable compute capacity in the cloud',
        desc_ko: 'Amazon Elastic Compute Cloud(Amazon EC2)는 클라우드에서 확장 가능한 컴퓨팅 용량을 제공하여 하드웨어에 선투자할 필요 없이 더 빠르게 애플리케이션을 개발하고 배포할 수 있습니다. 다양한 인스턴스 패밀리(범용, 컴퓨팅 최적화, 메모리 최적화, 스토리지 최적화 등)와 유연한 구매 옵션을 지원합니다.',
        desc_en: 'Amazon Elastic Compute Cloud (EC2) provides scalable computing capacity in the cloud. It eliminates the need to invest in hardware up front, allowing you to develop and deploy applications faster. Offers multiple instance types (General Purpose, Compute, Memory, Storage Optimized) and pricing models.',
        exam_tips_ko: [
          'Spot 인스턴스: 최대 90% 할인. 중단 가능(2분 사전 경고 알림). 배치 작업 및 무상태(Stateless) 워크로드에 최적.',
          'Reserved Instances(RI) & Savings Plans: 1년/3년 약정 시 최대 72% 할인. 예측 가능한 연속 워크로드용.',
          'Dedicated Hosts: 규제 준수, 기존 보유 서버 라이선스(BYOL - per-socket/core) 유지 필요 시 사용.',
          '배치 그룹(Placement Groups): Cluster(낮은 지연시간, 단일 AZ 내 밀집), Spread(고가용성, 인스턴스별 별도 랙 분산, AZ당 최대 7개), Partition(대규모 분산 워크로드, 하드웨어 파티션 격리).'
        ],
        exam_tips_en: [
          'Spot Instances: Up to 90% discount, can be interrupted with a 2-minute warning. Best for fault-tolerant and stateless batch workloads.',
          'Reserved Instances & Savings Plans: 1 or 3-year commitment, up to 72% discount for steady-state workloads.',
          'Dedicated Hosts: Meet regulatory compliance and use existing server-bound software licenses (BYOL).',
          'Placement Groups: Cluster (low latency/high throughput in single AZ), Spread (high availability across distinct racks, max 7 instances per AZ), Partition (large distributed workloads across partitions).'
        ],
        architecture_patterns_ko: 'ALB + Auto Scaling Group(ASG) + Multi-AZ 배치를 통한 무중단 고가용성 웹 티어 구성.',
        architecture_patterns_en: 'ALB + Auto Scaling Group (ASG) across Multi-AZ for high availability and fault tolerance.',
        related_quiz_ids: ['q1', 'q2']
      },
      {
        id: 'lambda',
        name: 'AWS Lambda',
        badge: 'Serverless / FaaS',
        icon: 'λ',
        summary_ko: '서버 프로비저닝 없이 이벤트에 응답하여 코드를 실행하는 서버리스 컴퓨팅',
        summary_en: 'Run code in response to events without provisioning or managing servers',
        desc_ko: 'AWS Lambda는 서버를 프로비저닝하거나 관리하지 않고도 코드를 실행할 수 있는 이벤트 기반 서버리스 컴퓨팅 서비스입니다. 실행된 컴퓨팅 시간에 대해서만 비용을 지불하며, 0부터 초당 수천 개의 요청까지 자동으로 규모를 확장합니다.',
        desc_en: 'AWS Lambda is an event-driven serverless computing platform. You pay only for the compute time consumed. Scales automatically from zero to thousands of concurrent executions per second.',
        exam_tips_ko: [
          '최대 실행 시간 제한은 15분(900초). 초과 시 Step Functions나 ECS/Batch 고려.',
          '동시성 제어: Reserved Concurrency(특정 함수 전용 동시성 풀 보장) vs Provisioned Concurrency(콜드 스타트 방지).',
          'VPC 내 실행 시 ENI(Hyperplane)를 통해 프라이빗 서브넷 리소스(RDS 등)에 접근 가능.',
          '메모리(128MB ~ 10,240MB) 할당에 비례하여 vCPU 성능 및 네트워크 대역폭 자동 증가.'
        ],
        exam_tips_en: [
          'Maximum execution duration is 15 minutes (900 seconds). Use AWS Step Functions or ECS for longer tasks.',
          'Concurrency: Reserved Concurrency guarantees limit/capacity, Provisioned Concurrency eliminates cold starts.',
          'VPC Access: Uses Hyperplane ENIs to securely access private subnets (e.g. private RDS).',
          'CPU allocation scales proportionally with configured memory (128MB to 10GB).'
        ],
        architecture_patterns_ko: 'API Gateway + Lambda + DynamoDB로 완전 서버리스 RESTful API 구축.',
        architecture_patterns_en: 'API Gateway + Lambda + DynamoDB for fully serverless 3-tier architectures.',
        related_quiz_ids: ['q3']
      },
      {
        id: 'ecs',
        name: 'Amazon ECS & Fargate',
        badge: 'Containers',
        icon: '🐳',
        summary_ko: '확장성이 뛰어난 컨테이너 관리 서비스 및 서버리스 컨테이너 엔진',
        summary_en: 'Highly scalable container orchestration and serverless container compute engine',
        desc_ko: 'Amazon Elastic Container Service(ECS)는 AWS에서 Docker 컨테이너를 쉽게 실행, 중지 및 관리할 수 있게 해주는 오케스트레이션 서비스입니다. AWS Fargate를 실행 유형으로 선택하면 서버 인스턴스를 직접 관리할 필요 없이 컨테이너 단위로 실행할 수 있습니다.',
        desc_en: 'Amazon ECS is a highly scalable, fast container management service. AWS Fargate allows you to run containers serverlessly without managing underlying EC2 server infrastructure.',
        exam_tips_ko: [
          'ECS Launch Types: EC2 Launch Type(직접 인스턴스 및 패치 관리, 비용 최적화) vs Fargate(서버리스, OS 관리 불필요, 빠른 확장).',
          'IAM Roles: Task Execution Role(ECR 이미지 풀, CloudWatch 로그 전송용) vs Task Role(컨테이너 앱 내부에서 S3/DynamoDB 접근 시 사용).',
          'App Mesh 및 Cloud Map 연동으로 마이크로서비스 서비스 디스커버리 구현.'
        ],
        exam_tips_en: [
          'Launch Types: EC2 Type (full OS control, custom AMI) vs Fargate (serverless, no EC2 management).',
          'IAM Roles: Task Execution Role (ECR pulls, CloudWatch logs) vs Task Role (application AWS API calls).',
          'Seamless integration with AWS ALB for dynamic port mapping (Target Groups).'
        ],
        architecture_patterns_ko: 'ALB Path-based Routing + ECS Fargate 마이크로서비스 아키텍처.',
        architecture_patterns_en: 'ALB dynamic host/path routing connected to ECS Fargate container tasks.',
        related_quiz_ids: ['q4']
      },
      {
        id: 'elasticbeanstalk',
        name: 'AWS Elastic Beanstalk',
        badge: 'PaaS',
        icon: '🌱',
        summary_ko: '인프라 설정 없이 애플리케이션을 빠르게 배포하고 관리하는 PaaS 솔루션',
        summary_en: 'Platform as a Service (PaaS) to deploy and scale web apps and services',
        desc_ko: '개발자가 코드를 업로드하기만 하면 Elastic Beanstalk가 용량 프로비저닝, 로드 밸런싱, 조정(Scaling), 모니터링을 자동으로 처리합니다. 내부적으로 생성되는 기본 AWS 리소스(EC2, RDS, ASG 등)에 대한 전체 제어 권한도 유지됩니다.',
        desc_en: 'Elastic Beanstalk is an easy-to-use service for deploying and scaling web applications developed with Java, .NET, PHP, Node.js, Python, Ruby, Go, and Docker on familiar servers such as Apache, Nginx, Passenger, and IIS.',
        exam_tips_ko: [
          '배포 전략: All at once(가장 빠름, 다운타임 발생), Rolling(용량 감소), Rolling with additional batch(전체 용량 유지), Immutable(새 ASG 생성, 가장 안전), Blue/Green(Route 53 CNAME 스왑으로 롤백 즉시 가능).',
          'RDS 데이터베이스는 Beanstalk 환경 외부에 독립 생성하여 결합 분리 권장 (환경 삭제 시 DB 유지).'
        ],
        exam_tips_en: [
          'Deployment Strategies: All at once (downtime), Rolling, Rolling with additional batch, Immutable (zero downtime, new ASG), Blue/Green (via URL swap).',
          'Decouple RDS databases from Beanstalk environment lifecycle to prevent accidental data loss upon teardown.'
        ],
        architecture_patterns_ko: '개발 속도가 중요한 웹 앱을 빠르게 배포하고 Blue/Green 전략으로 무중단 릴리즈.',
        architecture_patterns_en: 'Fast web application deployment with Blue/Green zero-downtime releases via Route53 URL Swap.',
        related_quiz_ids: []
      }
    ]
  },
  {
    id: 'storage',
    title_ko: '스토리지 (Storage)',
    title_en: 'Storage Services',
    icon: '💾',
    color: '#06b6d4',
    description_ko: '객체, 블록, 파일 및 하이브리드 클라우드 스토리지 솔루션',
    description_en: 'Object, block, file, and hybrid cloud storage infrastructure',
    services: [
      {
        id: 's3',
        name: 'Amazon S3',
        badge: 'Object Storage',
        icon: '🪣',
        summary_ko: '업계 최고의 확장성, 데이터 가용성 및 99.999999999%(11 9s) 내구성 제공',
        summary_en: 'Industry-leading object storage with 99.999999999% (11 9s) data durability',
        desc_ko: 'Amazon Simple Storage Service(Amazon S3)는 어디서나 원하는 양의 데이터를 저장하고 검색할 수 있도록 구축된 객체 스토리지입니다. 수명 주기 정책, 버전 관리, 정적 웹 호스팅, 복제(CRR/SRR) 및 다양한 스토리지 계층을 지원합니다.',
        desc_en: 'Amazon Simple Storage Service (Amazon S3) offers industry-leading scalability, data availability, security, and performance. Supports Lifecycle policies, Versioning, Object Lock (WORM), and Replication across regions.',
        exam_tips_ko: [
          '스토리지 클래스: S3 Standard, S3 Intelligent-Tiering(액세스 패턴 불명확 시 비용 자동 최적화), S3 Standard-IA, S3 One Zone-IA, S3 Glacier Flexible Retrieval, S3 Glacier Deep Archive(가장 저렴, 복구에 12시간 소요).',
          'S3 Versioning: 실수로 인한 삭제/덮어쓰기 방지 (MFA Delete 지원).',
          '보안: S3 Block Public Access, Bucket Policy, Object ACL, SSE-S3 / SSE-KMS / SSE-C / Client-Side Encryption.',
          '성능 최적화: 접두사(Prefix) 분할(초당 3,500 PUT/5,500 GET per prefix), Multipart Upload(100MB 이상 권장, 5GB 필수), S3 Transfer Acceleration(CloudFront 엣지 경유).'
        ],
        exam_tips_en: [
          'Storage Classes: S3 Standard, Intelligent-Tiering (unknown access patterns), Standard-IA, One Zone-IA, Glacier Flexible, Glacier Deep Archive (lowest cost, 12-hour retrieval).',
          'S3 Versioning with MFA Delete ensures protection against accidental permanent deletions.',
          'Security: Block Public Access, Bucket Policies, SSE-S3/KMS/C.',
          'Performance: Multi-part upload (>100MB suggested, >5GB required), S3 Transfer Acceleration (via CloudFront edge network).'
        ],
        architecture_patterns_ko: 'S3 정적 웹 호스팅 + CloudFront CDN + Origin Access Control(OAC)로 안전한 콘텐츠 배포.',
        architecture_patterns_en: 'Static Website Hosting + CloudFront CDN with Origin Access Control (OAC).',
        related_quiz_ids: ['q5', 'q6']
      },
      {
        id: 'ebs',
        name: 'Amazon EBS',
        badge: 'Block Storage',
        icon: '💽',
        summary_ko: '단일 EC2 인스턴스에 연결하여 사용하는 고성능 블록 스토리지 볼륨',
        summary_en: 'High-performance block storage volumes for use with Amazon EC2',
        desc_ko: 'Amazon Elastic Block Store(EBS)는 EC2 인스턴스에 부착하여 파일 시스템, 데이터베이스, 부팅 볼륨 등으로 사용할 수 있는 영구 블록 스토리지 볼륨입니다. 특정 가용 영역(AZ)에 종속되며 스냅샷을 통해 S3에 백업할 수 있습니다.',
        desc_en: 'Amazon Elastic Block Store (Amazon EBS) provides block level storage volumes for use with EC2 instances. EBS volumes are availability zone (AZ) locked and can be backed up via point-in-time snapshots stored in Amazon S3.',
        exam_tips_ko: [
          '볼륨 유형: gp3/gp2(범용 SSD), io2/io2 Block Express(최대 256,000 IOPS 미션 크리티컬 DB용), st1(Throughput Optimized HDD - 빅데이터/로그), sc1(Cold HDD).',
          'AZ 종속성: EBS 볼륨은 특정 단일 AZ에만 연결 가능. 다른 AZ로 이동하려면 스냅샷 생성 후 대상 AZ에서 새 볼륨 생성 필요.',
          'EBS Multi-Attach: io1/io2 볼륨에 한해 동일 AZ 내 최대 16개 EC2 인스턴스에 동시 연결 가능(클러스터 파일 시스템 필요).'
        ],
        exam_tips_en: [
          'Volume Types: gp3 (general purpose SSD), io2 Block Express (highest IOPS for mission-critical DBs), st1 (throughput HDD for big data), sc1 (cold HDD).',
          'AZ Lock: EBS volumes exist in a single AZ. Move volumes across AZs via EBS Snapshots.',
          'Multi-Attach: Allowed only on io1/io2 volumes in the same AZ for clustered file systems.'
        ],
        architecture_patterns_ko: 'EBS Fast Snapshot Restore(FSR)를 활용하여 대규모 EC2 인스턴스 즉시 복구 및 확장.',
        architecture_patterns_en: 'EBS Fast Snapshot Restore (FSR) for instant initialization of volume data.',
        related_quiz_ids: ['q7']
      },
      {
        id: 'efs',
        name: 'Amazon EFS',
        badge: 'Shared File Storage (NFS)',
        icon: '📁',
        summary_ko: '수백 대의 EC2 및 온프레미스 서버에서 동시 마운트 가능한 관리형 NFS 파일 시스템',
        summary_en: 'Serverless, fully elastic NFS shared file system for concurrent compute mounts',
        desc_ko: 'Amazon Elastic File System(EFS)은 여러 AZ에 걸쳐 데이터를 자동으로 복제하며, 수백 개의 EC2 인스턴스, Lambda 함수, ECS 태스크가 POSIX 호환 NFSv4 프로토콜로 동시에 읽고 쓸 수 있는 완전 관리형 공유 파일 시스템입니다.',
        desc_en: 'Amazon EFS is a serverless, set-and-forget elastic file system that lets you share file data without provisioning or managing storage. Compatible with NFSv4 across multiple AZs.',
        exam_tips_ko: [
          '다중 AZ 동시 마운트: 동일 리전 내 여러 AZ의 인스턴스가 동시 마운트 가능 (EBS는 단일 AZ).',
          '스토리지 클래스: EFS Standard vs EFS Infrequent Access (EFS Lifecycle Management로 자동 이동).',
          'OS 호환: Linux 인스턴스 전용. (Windows 워크로드의 공유 파일 스토리지는 FSx for Windows File Server 선택 필수).'
        ],
        exam_tips_en: [
          'Multi-AZ Concurrent Mount: Mountable across multiple AZs and instances concurrently (unlike EBS).',
          'Lifecycle Management: Automatically moves files to EFS Infrequent Access (IA) after inactivity.',
          'OS Support: Linux only. For Windows SMB file shares, use FSx for Windows File Server.'
        ],
        architecture_patterns_ko: '다중 AZ 웹 서버 플릿의 공용 미디어 파일 공유 스토리지로 EFS 마운트.',
        architecture_patterns_en: 'Cross-AZ WordPress or CMS shared media uploads repository using EFS mount targets.',
        related_quiz_ids: ['q7']
      }
    ]
  },
  {
    id: 'database',
    title_ko: '데이터베이스 (Database)',
    title_en: 'Database Services',
    icon: '🛢️',
    color: '#10b981',
    description_ko: '관계형(RDBMS), NoSQL, 인메모리 캐시 및 데이터 웨어하우스 솔루션',
    description_en: 'Managed Relational (SQL), NoSQL, In-Memory Caching, and Analytics Data Warehouses',
    services: [
      {
        id: 'rds',
        name: 'Amazon RDS',
        badge: 'Managed Relational DB',
        icon: '🐬',
        summary_ko: '클라우드에서 관계형 데이터베이스를 간편하게 설정, 운영 및 확장',
        summary_en: 'Easy to set up, operate, and scale relational databases in the cloud',
        desc_ko: 'Amazon Relational Database Service(RDS)는 MySQL, PostgreSQL, MariaDB, Oracle, SQL Server 엔진을 지원하는 완전 관리형 관계형 데이터베이스입니다. 자동 패치, 백업, 복제, 고가용성 장애 조치(Multi-AZ) 기능을 제공합니다.',
        desc_en: 'Amazon RDS makes it easy to set up, operate, and scale a relational database in the cloud. Supports 6 popular database engines with automated backups, patching, and Multi-AZ failover.',
        exam_tips_ko: [
          'Multi-AZ 배포: 고가용성 및 재해 복구(DR) 목적. 동기식 복제(Synchronous), 장애 시 DNS 자동 장애 조치(Failover). 읽기 트래픽 분산용이 아님!',
          'Read Replica(읽기 전용 복제본): 성능 확장(Read Scale-out) 목적. 비동기식 복제(Asynchronous). 최대 15개까지 생성 가능하며 자체 승격 가능. 리전 간 복제(Cross-Region)도 가능.',
          '백업: 자동 백업(보존 기간 1~35일, 시점 복구 지원) vs 수동 DB 스냅샷(사용자가 삭제할 때까지 영구 보존).'
        ],
        exam_tips_en: [
          'Multi-AZ: For High Availability (HA) & Disaster Recovery. Synchronous replication, automatic DNS failover. NOT for read traffic scaling.',
          'Read Replicas: For Read Performance Scaling. Asynchronous replication, up to 15 replicas, can be cross-region or promoted to standalone.',
          'Backups: Automated backups (1-35 days retention, Point-In-Time recovery) vs Manual DB Snapshots (retained indefinitely).'
        ],
        architecture_patterns_ko: 'RDS Multi-AZ(Primary+Standby) + 다중 Read Replica로 읽기/쓰기 분리 아키텍처 구현.',
        architecture_patterns_en: 'RDS Multi-AZ with Read Replicas behind Route53/Application for read/write splitting.',
        related_quiz_ids: ['q8']
      },
      {
        id: 'aurora',
        name: 'Amazon Aurora',
        badge: 'High Performance Cloud DB',
        icon: '🌌',
        summary_ko: 'MySQL 및 PostgreSQL과 완벽 호환되는 클라우드 네이티브 고성능 엔터프라이즈 RDBMS',
        summary_en: 'High performance MySQL & PostgreSQL compatible cloud-native enterprise database',
        desc_ko: 'Amazon Aurora는 오픈 소스 데이터베이스의 단순성과 비용 효율성에 엔터프라이즈급 데이터베이스의 성능과 가용성을 결합한 관계형 데이터베이스 엔진입니다. 표준 MySQL보다 최대 5배, PostgreSQL보다 최대 3배 빠른 처리량을 제공합니다.',
        desc_en: 'Amazon Aurora is a MySQL and PostgreSQL-compatible relational database built for the cloud. Up to 5x throughput of standard MySQL and 3x of standard PostgreSQL with auto-scaling storage (up to 128TiB).',
        exam_tips_ko: [
          '스토리지 복제: 3개 AZ에 걸쳐 6개의 데이터 복제본을 자동 저장 (4/6 Quorum 쓰기, 3/6 Quorum 읽기). 10GB 단위 자동 확장.',
          'Aurora Serverless v2: 트래픽 급증 및 가변적 워크로드에 맞춰 ACU(Aurora Capacity Units)를 밀리초 단위로 자동 확장.',
          'Aurora Global Database: 리전 간 복제 지연시간 1초 미만, 재해 복구(DR) 시 1분 이내 승격 가능.',
          'Aurora Read Replicas: 최대 15개, 수 밀리초 미만의 낮은 복제 지연, 장애 시 자동으로 Primary 승격 대상.'
        ],
        exam_tips_en: [
          'Storage Architecture: 6 copies across 3 AZs automatically. Self-healing, continuous backup to S3.',
          'Aurora Serverless v2: Instant scaling in fractions of a second for unpredictable workloads.',
          'Aurora Global Database: Cross-region replication latency <1 second, RTO < 1 minute.',
          'Failover: Aurora Replicas serve as instant failover targets without data loss.'
        ],
        architecture_patterns_ko: 'Aurora Global Database + Route 53 지연 시간 라우팅으로 글로벌 멀티 리전 액티브-패시브 DR 구축.',
        architecture_patterns_en: 'Aurora Global Database + Route53 Latency routing for active-passive multi-region DR.',
        related_quiz_ids: ['q9']
      },
      {
        id: 'dynamodb',
        name: 'Amazon DynamoDB',
        badge: 'NoSQL / Key-Value',
        icon: '⚡',
        summary_ko: '규모와 상관없이 한 자릿수 밀리초의 일관된 지연 시간을 제공하는 완전 관리형 NoSQL DB',
        summary_en: 'Fully managed NoSQL key-value and document database with single-digit millisecond latency',
        desc_ko: 'Amazon DynamoDB는 원활한 확장성과 빠르고 예측 가능한 성능을 제공하는 완전 관리형 비관계형 데이터베이스입니다. 대규모 분산 환경에서 초당 수천만 건의 요청을 처리할 수 있으며, 서버 관리나 패치 작업이 전혀 필요 없습니다.',
        desc_en: 'Amazon DynamoDB is a fast and flexible NoSQL database service for all applications that need consistent, single-digit millisecond latency at any scale. Fully managed, serverless, and supports document and key-value store models.',
        exam_tips_ko: [
          '용량 모드: 온디맨드 모드(예측 불가 트래픽, 요청당 과금) vs 프로비저닝 모드(예측 가능한 트래픽, RCU/WCU 예약 및 Auto Scaling).',
          'DAX(DynamoDB Accelerator): 완전 관리형 인메모리 캐시. 읽기 응답 시간을 밀리초에서 마이크로초(Microsecond) 단위로 단축.',
          'Global Tables: 다중 리전(Multi-Region) 액티브-액티브(Active-Active) 완전 동기화 복제 제공 (DynamoDB Streams 활성화 필수).',
          'TTL(Time to Live): 특정 타임스탬프 이후 비용 없이 오래된 아이템 자동 만료/삭제.'
        ],
        exam_tips_en: [
          'Capacity Modes: On-demand (unpredictable workloads, pay-per-request) vs Provisioned (predictable, RCU/WCU).',
          'DAX (DynamoDB Accelerator): In-memory cache delivering microsecond latency for read-heavy workloads.',
          'Global Tables: Multi-Region Active-Active replication using DynamoDB Streams.',
          'TTL (Time to Live): Automatic expiration and deletion of items without consuming write throughput.'
        ],
        architecture_patterns_ko: 'Lambda + DynamoDB + DAX를 이용한 글로벌 초저지연 모바일 게임 리더보드/세션 스토어.',
        architecture_patterns_en: 'Serverless event ingestion with Lambda, DynamoDB, and DAX for microsecond query response.',
        related_quiz_ids: ['q10']
      },
      {
        id: 'elasticache',
        name: 'Amazon ElastiCache',
        badge: 'In-Memory Caching',
        icon: '⚡',
        summary_ko: 'Redis 및 Memcached와 호환되는 초고속 인메모리 데이터 스토어 및 캐시',
        summary_en: 'Ultra-fast in-memory data store and cache compatible with Redis and Memcached',
        desc_ko: 'Amazon ElastiCache는 클라우드에서 인메모리 데이터 스토어를 손쉽게 배포, 운영 및 확장할 수 있는 서비스입니다. 느린 디스크 기반 데이터베이스의 쿼리 결과를 캐싱하여 읽기 성능을 비약적으로 개선합니다.',
        desc_en: 'Amazon ElastiCache allows you to seamlessly set up, run, and scale popular open-Source compatible in-memory data stores in the cloud. Greatly accelerates read-intensive application performance.',
        exam_tips_ko: [
          'Redis vs Memcached: Redis(영속성, Multi-AZ 복제, 자동 장애 조치, Pub/Sub, 정렬 집합 데이터 구조 지원) vs Memcached(단순 순수 캐시, 멀티스레드, 영속성 없음).',
          '캐싱 전략: Lazy Loading(Cache-Aside, 읽을 때 캐시 확인 후 DB 조회), Write-Through(데이터 쓸 때마다 캐시와 DB 동시 갱신).'
        ],
        exam_tips_en: [
          'Redis vs Memcached: Redis (persistence, Multi-AZ failover, complex data types, pub/sub) vs Memcached (simple key-value, multi-threaded, non-persistent).',
          'Patterns: Lazy Loading (Cache-Aside) vs Write-Through.'
        ],
        architecture_patterns_ko: 'RDS/Aurora 앞단에 ElastiCache Redis를 배치하여 DB 읽기 부하 80% 이상 경감.',
        architecture_patterns_en: 'Caching tier in front of RDS/Aurora to offload repetitive query operations.',
        related_quiz_ids: []
      }
    ]
  },
  {
    id: 'networking',
    title_ko: '네트워킹 (Networking)',
    title_en: 'Networking & Content Delivery',
    icon: '🌐',
    color: '#f59e0b',
    description_ko: '가상 프라이빗 클라우드 격리, 트래픽 라우팅, CDN 및 글로벌 가속 솔루션',
    description_en: 'Isolated Virtual Private Clouds, DNS routing, CDN, and high-speed network connectivity',
    services: [
      {
        id: 'vpc',
        name: 'Amazon VPC',
        badge: 'Virtual Network Isolation',
        icon: '🛡️',
        summary_ko: '사용자 정의 가상 네트워크에서 AWS 리소스를 격리 및 제어하는 기본 네트워킹 인프라',
        summary_en: 'Logically isolated virtual network provisioned for your AWS resources',
        desc_ko: 'Amazon Virtual Private Cloud(VPC)를 통해 사용자가 정의한 가상 네트워크로 AWS 리소스를 안전하게 프로비저닝할 수 있습니다. IP 주소 범위 선택, 서브넷 생성, 라우팅 테이블 및 네트워크 게이트웨이 구성을 완벽히 제어할 수 있습니다.',
        desc_en: 'Amazon VPC enables you to launch AWS resources into a virtual network that you have defined. Complete control over IP address ranges, subnets, route tables, and network gateways.',
        exam_tips_ko: [
          '보안 그룹(Security Group) vs 네트워크 ACL(NACL): 보안 그룹(인스턴스 레벨, 상태 저장 Stateful, 허용 규칙만 가능) vs NACL(서브넷 레벨, 상태 비저장 Stateless, 허용 및 명시적 거부 Deny 규칙 지원, 번호순 평가).',
          'NAT Gateway: 프라이빗 서브넷 인스턴스가 인터넷 아웃바운드 통신을 수행할 수 있게 함(퍼블릭 서브넷에 위치해야 함, 인바운드 인터넷 접속 차단). EIP 필수.',
          'VPC Endpoints: 인터넷 게이트웨이나 NAT 없이 AWS 서비스에 프라이빗 통신. Gateway Endpoint(S3, DynamoDB 전용, 무료) vs Interface Endpoint(AWS PrivateLink 기반 ENI 생성, 유료).',
          'VPC Peering: 두 VPC 간 1:1 비공개 연결 (비전이적 Transitive 라우팅 불가, IP 대역 중첩 불가).'
        ],
        exam_tips_en: [
          'Security Groups vs NACLs: SG (Instance level, Stateful, Allow only) vs NACL (Subnet level, Stateless, Allow/Deny, evaluated in numerical order).',
          'NAT Gateway: Provides outbound internet access for private subnets. Placed in public subnet with Elastic IP.',
          'VPC Endpoints: Gateway Endpoints (Free, S3 and DynamoDB only, route table target) vs Interface Endpoints (PrivateLink ENI, costs apply).',
          'VPC Peering: 1-to-1 non-transitive peering connection with no CIDR overlap.'
        ],
        architecture_patterns_ko: '3-Tier VPC 아키텍처: Public Web Subnets + Private App Subnets + Isolated DB Subnets.',
        architecture_patterns_en: '3-Tier VPC Architecture: Public (ALB/NAT), Private (App), Isolated (DB) subnets across Multi-AZ.',
        related_quiz_ids: ['q11', 'q12']
      },
      {
        id: 'route53',
        name: 'Amazon Route 53',
        badge: 'DNS & Traffic Routing',
        icon: '🧭',
        summary_ko: '가용성과 확장성이 뛰어난 클라우드 DNS 웹 서비스 및 글로벌 트래픽 매니저',
        summary_en: 'Highly available and scalable cloud Domain Name System (DNS) web service',
        desc_ko: 'Amazon Route 53은 100% 가용성 SLA를 제공하는 관리형 DNS 서비스입니다. 도메인 등록, DNS 라우팅 및 리소스 상태 확인(Health Checks) 기능을 통합 제공하여 전 세계 사용자 트래픽을 최적의 엔드포인트로 유도합니다.',
        desc_en: 'Amazon Route 53 is a highly available and scalable cloud DNS web service. Effectively connects user requests to infrastructure running in AWS as well as outside AWS.',
        exam_tips_ko: [
          '라우팅 정책: Simple(단순), Weighted(가중치 기반 배분), Latency(사용자 기준 최저 지연시간 리전), Failover(액티브-패시브 헬스체크 장애조치), Geolocation(사용자 국가/대륙 기준), Geoproximity(GPS 거리 및 Bias 기반), Multi-Value Answer(다중 IP 반환 + 헬스체크).',
          'Alias 레코드 vs CNAME: Alias 레코드는 Route 53 전용 확장으로 Apex/Root 도메인(예: example.com)을 AWS 리소스(ALB, CloudFront, S3 버킷)에 매핑 가능(무료 쿼리). CNAME은 루트 도메인에 설정 불가.'
        ],
        exam_tips_en: [
          'Routing Policies: Simple, Weighted, Latency-based, Failover (Active-Passive), Geolocation (by country/continent), Multi-Value (multiple healthy IPs).',
          'Alias Records vs CNAME: Alias records can point directly to AWS resources (ALB, CloudFront, S3) at Zone Apex (naked domain example.com), free DNS queries.'
        ],
        architecture_patterns_ko: 'Route 53 Failover Routing + Primary 리전 ALB + Secondary 리전 S3 정적 에러 페이지 DR 구성.',
        architecture_patterns_en: 'Route 53 Failover routing pointing to Primary ALB with secondary backup to S3 static maintenance page.',
        related_quiz_ids: ['q13']
      },
      {
        id: 'cloudfront',
        name: 'Amazon CloudFront',
        badge: 'Global CDN',
        icon: '🌍',
        summary_ko: '전 세계 엣지 로케이션을 통해 정적 및 동적 웹 콘텐츠를 초저지연으로 전송하는 글로벌 CDN',
        summary_en: 'Fast, secure, and programmable Content Delivery Network (CDN) globally',
        desc_ko: 'Amazon CloudFront는 데이터, 비디오, 애플리케이션 및 API를 전 세계 사용자에게 안전하게 전송하는 글로벌 콘텐츠 전송 네트워크(CDN) 서비스입니다. 전 세계 엣지 네트워크를 통해 레이턴시를 획기적으로 줄이고 DDoS 공격을 차단합니다.',
        desc_en: 'Amazon CloudFront is a fast content delivery network (CDN) service that securely delivers data, videos, applications, and APIs to customers globally with low latency and high transfer speeds.',
        exam_tips_ko: [
          'Origin Access Control(OAC) / OAI: S3 버킷의 퍼블릭 액세스를 완전히 차단하고 오직 CloudFront를 통해서만 객체에 접근하도록 강제.',
          'CloudFront Signed URLs vs Signed Cookies: Signed URL(단일 개별 파일 보호용) vs Signed Cookie(여러 프리미엄 미디어 파일 일괄 권한 부여용).',
          '엣지 컴퓨팅: CloudFront Functions(경량 JS, 헤더 조작 및 URL 리다이렉트, 1ms 미만) vs Lambda@Edge(Node.js/Python, 응답 본문 수정, 외부 네트워크 호출 가능).'
        ],
        exam_tips_en: [
          'Origin Access Control (OAC): Enforces secure S3 access exclusively through CloudFront distributions.',
          'Signed URLs vs Signed Cookies: Signed URLs for individual file access vs Signed Cookies for multiple streaming/premium files.',
          'Edge Computing: CloudFront Functions (<1ms, lightweight viewer request/response header rewrites) vs Lambda@Edge (full runtime, network calls, origin request/response).'
        ],
        architecture_patterns_ko: 'CloudFront + AWS WAF + S3 OAC로 구축하는 완벽한 보안 정적 웹 사이트 호스팅.',
        architecture_patterns_en: 'CloudFront + AWS WAF + S3 with OAC for secure, highly cached edge distribution.',
        related_quiz_ids: ['q14']
      }
    ]
  },
  {
    id: 'security',
    title_ko: '보안 및 IAM (Security & IAM)',
    title_en: 'Security, Identity & Compliance',
    icon: '🛡️',
    color: '#f43f5e',
    description_ko: '신원 및 접근 제어, 암호화 키 관리, 민감 정보 보호 및 위협 방어',
    description_en: 'Identity access management, cryptographic keys, secret rotation, and threat defense',
    services: [
      {
        id: 'iam',
        name: 'AWS IAM',
        badge: 'Identity & Access Control',
        icon: '🔑',
        summary_ko: 'AWS 리소스에 대한 개별 사용자 및 애플리케이션의 접근 권한을 안전하게 관리',
        summary_en: 'Securely manage access to AWS services and resources with granular permissions',
        desc_ko: 'AWS Identity and Access Management(IAM)은 AWS 리소스에 대한 액세스를 안전하게 제어할 수 있는 웹 서비스입니다. IAM을 사용하여 리소스를 사용하도록 인증(로그인) 및 권한 부여(권한 보유)된 대상을 중앙에서 제어합니다.',
        desc_en: 'AWS Identity and Access Management (IAM) provides fine-grained access control across all of AWS. Manage users, groups, roles, policies, and federated identity permissions.',
        exam_tips_ko: [
          'IAM Role(역할): 임시 자격증명(STS)을 발급. EC2 인스턴스 프로파일, Lambda 함수 등에 권한을 부여할 때 절대 하드코딩된 Access Key를 사용하지 말고 IAM Role 사용 필수.',
          '최소 권한의 원칙(Principle of Least Privilege): 필요한 최소한의 작업 및 리소스 ARN만 명시하여 권한 부여.',
          '권한 평가 순서: 명시적 거부(Explicit Deny)가 언제나 우선 승리 > 명시적 허용(Explicit Allow) > 기본 묵시적 거부(Implicit Deny).',
          'SCP (Service Control Policies): AWS Organizations에서 하위 계정 및 OU의 최대 허용 권한 경계를 설정(Root 계정에도 적용 가능).'
        ],
        exam_tips_en: [
          'IAM Roles: Provide temporary credentials via STS. Never store hard-coded credentials on EC2 instances or Lambda functions.',
          'Least Privilege Principle: Grant only the permissions required to complete a specific task.',
          'Policy Evaluation: Explicit Deny always overrides any Explicit Allow.',
          'SCPs (Service Control Policies): Enforce permission boundaries across AWS Organizations member accounts.'
        ],
        architecture_patterns_ko: 'EC2 Instance Profile에 IAM Role을 연결하여 S3 및 DynamoDB에 안전하게 자격증명 없이 접근.',
        architecture_patterns_en: 'EC2 Instance Profiles with IAM Roles eliminating hardcoded AWS secrets in code.',
        related_quiz_ids: ['q15']
      },
      {
        id: 'kms',
        name: 'AWS KMS',
        badge: 'Key Management & Encryption',
        icon: '🔐',
        summary_ko: '데이터 암호화에 사용되는 암호화 키를 손쉽게 생성하고 제어하는 완전 관리형 키 서비스',
        summary_en: 'Create and control the cryptographic keys used to encrypt your data',
        desc_ko: 'AWS Key Management Service(KMS)는 FIPS 140-2 인증 하드웨어 보안 모듈(HSM)로 보호되는 키 관리 서비스입니다. AWS 대부분의 서비스(S3, EBS, RDS 등)와 긴밀히 통합되어 봉투 암호화(Envelope Encryption)를 지원합니다.',
        desc_en: 'AWS Key Management Service (KMS) makes it easy for you to create and manage cryptographic keys and control their use across a wide range of AWS services and in your applications.',
        exam_tips_ko: [
          '고객 관리형 키(Customer Managed Keys - CMK): 키 생성, 자동 로테이션(1년 주기), 키 정책 변경, 활성화/비활성화 제어 가능.',
          'AWS 관리형 키(AWS Managed Keys): 무료, AWS가 관리(`aws/s3`, `aws/ebs` 등), 키 로테이션 및 세부 정책 수정 불가.',
          '봉투 암호화(Envelope Encryption): Customer Master Key(KMS)로 데이터 암호화용 데이터 키(Data Key)를 암호화하여 대용량 데이터를 안전하고 빠르게 처리.',
          'Cross-Account 접근: KMS Key Policy에서 대상 계정 허용 + 대상 계정의 IAM Policy에서 `kms:Decrypt` 허용 양방향 구성 필요.'
        ],
        exam_tips_en: [
          'Customer Managed Keys (CMK): Full control over rotation, key policies, enabling/disabling.',
          'AWS Managed Keys: Used by default by AWS services, free, non-configurable policy.',
          'Envelope Encryption: KMS key encrypts a plaintext Data Key which encrypts raw data.',
          'Cross-Account Access: Requires permission both in KMS Key Policy and recipient IAM Policy.'
        ],
        architecture_patterns_ko: 'EBS 볼륨 및 S3 버킷에 KMS CMK 적용하여 규제 준수(Compliance) 충족.',
        architecture_patterns_en: 'KMS CMK integration with EBS, RDS, and S3 for complete at-rest data compliance.',
        related_quiz_ids: ['q16']
      },
      {
        id: 'secretsmanager',
        name: 'AWS Secrets Manager',
        badge: 'Secrets & Credential Rotation',
        icon: '🔒',
        summary_ko: '데이터베이스 자격 증명, API 키 및 비밀번호를 안전하게 저장하고 자동 교체(Rotation)',
        summary_en: 'Rotate, manage, and retrieve database credentials, API keys, and other secrets',
        desc_ko: 'AWS Secrets Manager는 수명 주기 동안 데이터베이스 자격 증명, API 키 및 기타 암호 정보를 보호하고 Lambda 함수와 연계하여 주기적으로 자동 교체(Automatic Rotation)해 주는 보안 서비스입니다.',
        desc_en: 'AWS Secrets Manager helps you protect secrets needed to access your applications, services, and IT resources. Supports out-of-the-box automatic rotation for RDS, Aurora, and Redshift.',
        exam_tips_ko: [
          '자동 로테이션(Automatic Rotation): 내장된 Lambda 템플릿을 통해 RDS, Aurora, Redshift 암호를 주기적으로 자동 변경.',
          'Secrets Manager vs SSM Parameter Store: Secrets Manager(비용 발생, 자동 로테이션 내장, RDS 통합 강력) vs Parameter Store(기본 무료, 계층형 키-값 저장소, 자동 로테이션을 직접 구현해야 함).'
        ],
        exam_tips_en: [
          'Automatic Rotation: Uses built-in Lambda functions to automatically rotate credentials for RDS/Aurora.',
          'Secrets Manager vs SSM Parameter Store: Secrets Manager has built-in auto rotation and costs $0.40/secret/mo; SSM Parameter Store is free/low-cost with standard tier but requires custom rotation code.'
        ],
        architecture_patterns_ko: 'ECS/Lambda 앱이 Secrets Manager에서 최신 RDS 암호를 런타임에 안전하게 호출.',
        architecture_patterns_en: 'Decoupled application secrets pulled at runtime via Secrets Manager API calls.',
        related_quiz_ids: []
      }
    ]
  }
];

/**
 * Question Bank - Realistic SAA-C03 Exam Scenario Questions
 */
const QUESTION_BANK = [
  {
    id: 'q1',
    service_id: 'ec2',
    conceptIds: ['ec2'],
    domain_id: 'compute',
    difficulty: 'Medium',
    question_ko: '한 기업이 야간에 대규모 배치 이미지 렌더링 작업을 수행하려고 합니다. 이 작업은 중단되어도 다시 시작할 수 있으며 내결함성을 갖추고 있습니다. 비용을 최대한 절감하면서 이 작업을 실행하기 위한 가장 경제적인 EC2 구매 옵션은 무엇입니까?',
    question_en: 'A company needs to run a large batch image rendering job overnight. The workload is fault-tolerant and can withstand interruptions. Which Amazon EC2 purchasing option is the MOST cost-effective for this workload?',
    options_ko: [
      'On-Demand Instances (온디맨드 인스턴스)',
      'Spot Instances (스팟 인스턴스)',
      'Reserved Instances with 3-year term (3년 약정 예약 인스턴스)',
      'Dedicated Hosts (전용 호스트)'
    ],
    options_en: [
      'On-Demand Instances',
      'Spot Instances',
      'Reserved Instances with a 3-year term',
      'Dedicated Hosts'
    ],
    answer: 1,
    explanation_ko: '스팟 인스턴스는 AWS의 미사용 EC2 용량을 온디맨드 대비 최대 90% 할인된 가격으로 제공합니다. 중단이 허용되는 배치 작업 및 무상태 워크로드에 가장 비용 효율적입니다.',
    explanation_en: 'Spot Instances provide up to 90% discount compared to On-Demand pricing. They are ideal for stateless, fault-tolerant batch workloads that can handle interruptions.'
  },
  {
    id: 'q2',
    service_id: 'ec2',
    conceptIds: ['ec2'],
    domain_id: 'compute',
    difficulty: 'Hard',
    question_ko: '한 연구소에서 극도로 낮은 네트워크 지연 시간과 높은 네트워크 처리량이 요구되는 고성능 컴퓨팅(HPC) 애플리케이션을 단일 가용 영역(AZ)에 배포하려고 합니다. 어떤 EC2 배치 그룹(Placement Group) 전략을 사용해야 합니까?',
    question_en: 'A research organization is deploying a High-Performance Computing (HPC) application that requires extremely low network latency and high throughput within a single Availability Zone (AZ). Which EC2 Placement Group strategy should be chosen?',
    options_ko: [
      'Spread Placement Group (분산형 배치 그룹)',
      'Cluster Placement Group (클러스터 배치 그룹)',
      'Partition Placement Group (파티션 배치 그룹)',
      'Auto Scaling Placement Group'
    ],
    options_en: [
      'Spread Placement Group',
      'Cluster Placement Group',
      'Partition Placement Group',
      'Auto Scaling Placement Group'
    ],
    answer: 1,
    explanation_ko: '클러스터 배치 그룹(Cluster Placement Group)은 단일 가용 영역 내에서 인스턴스들을 물리적으로 인접하게 배치하여 노드 간 가장 낮은 지연 시간과 최대 100Gbps의 높은 네트워크 처리량을 제공합니다.',
    explanation_en: 'Cluster Placement Groups pack instances close together inside an Availability Zone, achieving the lowest latency and highest network throughput required for HPC workloads.'
  },
  {
    id: 'q3',
    service_id: 'lambda',
    conceptIds: ['lambda'],
    domain_id: 'compute',
    difficulty: 'Medium',
    question_ko: '한 솔루션 아키텍트가 매시간 수만 건의 이미지 업로드 이벤트를 처리하는 완전 서버리스 아키텍처를 설계하고 있습니다. 이벤트 처리 시간이 10초 미만인 경우, 인프라 관리 부담을 최소화하고 유휴 비용이 전혀 발생하지 않는 최적의 서비스 조합은 무엇입니까?',
    question_en: 'A solutions architect is designing a serverless architecture to process tens of thousands of image upload events per hour. Processing each image takes less than 10 seconds. Which service combination eliminates server management and idle costs?',
    options_ko: [
      'Amazon S3 Event Notifications + AWS Lambda',
      'Amazon EC2 Auto Scaling + Amazon SQS',
      'AWS Elastic Beanstalk Worker Environment',
      'Amazon ECS on EC2 Launch Type'
    ],
    options_en: [
      'Amazon S3 Event Notifications + AWS Lambda',
      'Amazon EC2 Auto Scaling + Amazon SQS',
      'AWS Elastic Beanstalk Worker Environment',
      'Amazon ECS on EC2 Launch Type'
    ],
    answer: 0,
    explanation_ko: 'S3 이벤트 알림과 AWS Lambda를 연계하면 S3에 객체가 업로드될 때마다 서버리스 함수가 즉시 트리거되어 실행된 밀리초 단위 시간만 과금되며, 유휴 상태에서는 비용이 0원입니다.',
    explanation_en: 'S3 Event Notifications integrated with AWS Lambda creates a purely event-driven serverless pipeline with zero idle cost and automatic scaling.'
  },
  {
    id: 'q4',
    service_id: 'ecs',
    conceptIds: ['ecs'],
    domain_id: 'compute',
    difficulty: 'Medium',
    question_ko: '개발팀이 Docker 마이크로서비스를 실행할 인프라를 구축하려고 합니다. EC2 가상 서버의 운영체제 패치나 클러스터 용량 관리 없이 오직 컨테이너 애플리케이션 실행에만 집중하고자 할 때 가장 적합한 ECS 실행 유형(Launch Type)은?',
    question_en: 'A development team wants to deploy Docker microservices on AWS. They want to avoid managing EC2 server OS patching, provisioning, and cluster scaling. Which ECS Launch Type is appropriate?',
    options_ko: [
      'Amazon ECS with EC2 Launch Type',
      'Amazon ECS with AWS Fargate Launch Type',
      'AWS Elastic Beanstalk Multicontainer Docker',
      'Amazon Lightsail Container Service'
    ],
    options_en: [
      'Amazon ECS with EC2 Launch Type',
      'Amazon ECS with AWS Fargate Launch Type',
      'AWS Elastic Beanstalk Multicontainer Docker',
      'Amazon Lightsail Container Service'
    ],
    answer: 1,
    explanation_ko: 'AWS Fargate는 ECS 및 EKS를 위한 서버리스 컨테이너 컴퓨팅 엔진으로, 기본 가상 머신(EC2)을 프로비저닝하거나 관리하지 않고도 컨테이너를 직접 실행할 수 있습니다.',
    explanation_en: 'AWS Fargate is a serverless compute engine for containers that works with Amazon ECS, removing the operational overhead of provisioning and managing EC2 servers.'
  },
  {
    id: 'q5',
    service_id: 's3',
    conceptIds: ['s3'],
    domain_id: 'storage',
    difficulty: 'Medium',
    question_ko: '한 금융 기업이 규정 준수를 위해 고객 금융 거래 기록을 7년 동안 안전하게 보관해야 합니다. 첫 30일 동안은 빈번하게 조회되지만, 그 이후에는 거의 조회되지 않습니다. 그러나 필요 시 수 분 내에 검색할 수 있어야 합니다. 가장 비용 효율적인 S3 수명 주기 정책은?',
    question_en: 'A financial institution must retain transaction records for 7 years for compliance. Records are accessed frequently during the first 30 days, rarely thereafter, but must remain retrievable within minutes when requested. What is the most cost-effective S3 Lifecycle policy?',
    options_ko: [
      '30일 후 S3 Standard에서 S3 Glacier Deep Archive로 전환',
      '30일 후 S3 Standard에서 S3 Standard-IA로 전환하고, 7년 후 만료(삭제)',
      '30일 후 S3 Standard에서 S3 One Zone-IA로 전환',
      '영구히 S3 Intelligent-Tiering에 유지'
    ],
    options_en: [
      'Transition from S3 Standard to S3 Glacier Deep Archive after 30 days',
      'Transition from S3 Standard to S3 Standard-IA after 30 days, expire after 7 years',
      'Transition from S3 Standard to S3 One Zone-IA after 30 days',
      'Keep files in S3 Intelligent-Tiering permanently without expiration'
    ],
    answer: 1,
    explanation_ko: 'S3 Standard-IA(Infrequent Access)는 접근 빈도가 낮지만 즉각적인(밀리초) 검색이 필요한 데이터에 적합하며, 다중 AZ 내구성을 유지합니다. Glacier Deep Archive는 복구에 최대 12시간이 걸리므로 수 분 내 복구 요구사항을 충족하지 못합니다.',
    explanation_en: 'S3 Standard-IA is ideal for infrequently accessed data requiring rapid (millisecond) retrieval with multi-AZ resilience. Deep Archive takes hours to retrieve.'
  },
  {
    id: 'q6',
    service_id: 's3',
    conceptIds: ['s3'],
    domain_id: 'storage',
    difficulty: 'Hard',
    question_ko: '회사가 실수로 인한 객체 삭제 및 악의적인 직원의 데이터 변조를 원천 방지하기 위해 S3 버킷에 최고 수준의 데이터 보호 정책을 적용하고자 합니다. 구현해야 하는 두 가지 핵심 기능은?',
    question_en: 'A company needs to prevent accidental object deletion and malicious overwriting by privileged users on an S3 bucket. Which two features should be enabled together?',
    options_ko: [
      'S3 Bucket Policy 와 AWS KMS SSE-KMS',
      'S3 Versioning(버전 관리) 과 MFA Delete 활성화',
      'S3 Intelligent-Tiering 과 S3 ACL',
      'S3 Transfer Acceleration 과 CORS 정책'
    ],
    options_en: [
      'S3 Bucket Policy and AWS KMS SSE-KMS',
      'S3 Versioning and MFA Delete enabled',
      'S3 Intelligent-Tiering and S3 ACL',
      'S3 Transfer Acceleration and CORS policy'
    ],
    answer: 1,
    explanation_ko: 'S3 Versioning은 객체의 이전 버전을 보존하며, MFA Delete를 활성화하면 객체 영구 삭제나 버전 관리 상태를 변경할 때 반드시 루트 계정과 물리/가상 MFA 인증 코드를 입력해야 하므로 최고 수준의 삭제 방어벽을 제공합니다.',
    explanation_en: 'S3 Versioning combined with MFA Delete requires multi-factor authentication codes to permanently delete object versions or change bucket versioning state.'
  },
  {
    id: 'q7',
    service_id: 'efs',
    conceptIds: ['efs'],
    domain_id: 'storage',
    difficulty: 'Medium',
    question_ko: 'Auto Scaling 그룹에 속한 다중 가용 영역(Multi-AZ)의 여러 Linux EC2 웹 서버 인스턴스가 동일한 공유 파일 디렉토리에 동시에 읽고 쓰기 작업을 수행해야 합니다. 어떤 스토리지 서비스를 선택해야 합니까?',
    question_en: 'Multiple Linux EC2 web server instances distributed across multiple Availability Zones in an Auto Scaling Group need concurrent read/write access to a shared directory. Which storage service should be selected?',
    options_ko: [
      'Amazon EBS gp3 Volume with Multi-Attach',
      'Amazon Elastic File System (Amazon EFS)',
      'Amazon S3 Glacier Flexible Retrieval',
      'Amazon FSx for Windows File Server'
    ],
    options_en: [
      'Amazon EBS gp3 Volume with Multi-Attach',
      'Amazon Elastic File System (Amazon EFS)',
      'Amazon S3 Glacier Flexible Retrieval',
      'Amazon FSx for Windows File Server'
    ],
    answer: 1,
    explanation_ko: 'Amazon EFS는 POSIX 호환 관리형 NFS 파일 시스템으로, 여러 가용 영역(AZ)에 걸쳐 있는 다수의 Linux EC2 인스턴스가 동시에 안전하게 마운트하여 사용할 수 있습니다. EBS는 단일 AZ에 종속됩니다.',
    explanation_en: 'Amazon EFS is a multi-AZ POSIX-compliant NFS file system designed for concurrent access across multiple instances and AZs. EBS volumes are locked to a single AZ.'
  },
  {
    id: 'q8',
    service_id: 'rds',
    conceptIds: ['rds'],
    domain_id: 'database',
    difficulty: 'Hard',
    question_ko: '전자상거래 웹 사이트의 트래픽이 폭증하여 Amazon RDS PostgreSQL 데이터베이스에 심각한 읽기 병목 현상이 발생하고 있습니다. 쓰기 작업에는 영향 없이 읽기 쿼리 성능을 대규모로 확장하기 위해 솔루션 아키텍트가 취해야 할 조치는?',
    question_en: 'An e-commerce website is experiencing high read latency on its primary Amazon RDS PostgreSQL database due to heavy traffic surges. What should a solutions architect do to scale read performance without impacting writes?',
    options_ko: [
      'RDS Multi-AZ 배포를 활성화하여 대기(Standby) 인스턴스로 읽기 트래픽을 라우팅한다.',
      '하나 이상의 RDS Read Replica(읽기 전용 복제본)를 생성하고 애플리케이션의 읽기 쿼리를 복제본 엔드포인트로 유도한다.',
      '인스턴스 유형을 더 큰 컴퓨팅 인스턴스로 변경하기 위해 데이터베이스를 재부팅한다.',
      'RDS 자동 백업 보존 기간을 늘린다.'
    ],
    options_en: [
      'Enable RDS Multi-AZ deployment and route read traffic to the standby instance.',
      'Create one or more RDS Read Replicas and point read traffic to the replica endpoints.',
      'Increase instance type by stopping and resizing the primary DB instance.',
      'Increase the automated backup retention period.'
    ],
    answer: 1,
    explanation_ko: 'RDS Read Replica는 비동기식 복제를 통해 읽기 전용 트래픽을 처리하는 전용 엔드포인트를 제공하여 Primary DB의 읽기 부하를 완벽하게 분산합니다. Multi-AZ의 Standby 인스턴스는 장애 조치 전용으로 읽기 트래픽을 수신할 수 없습니다.',
    explanation_en: 'RDS Read Replicas scale read throughput by offloading read queries to asynchronous replicas. Multi-AZ standby instances are passive and cannot accept read queries.'
  },
  {
    id: 'q9',
    service_id: 'aurora',
    conceptIds: ['aurora'],
    domain_id: 'database',
    difficulty: 'Hard',
    question_ko: '글로벌 게임 기업이 북미(Primary)와 유럽(Secondary) 리전에 걸쳐 데이터베이스 재해 복구(DR) 및 초저지연 읽기를 지원하고자 합니다. 리전 간 복제 지연 시간을 1초 미만으로 유지하고 1분 이내에 장애 조치(Failover)를 수행할 수 있는 솔루션은?',
    question_en: 'A global gaming company needs cross-region Disaster Recovery and low-latency local reads across US (Primary) and EU (Secondary). The solution must maintain cross-region replication latency under 1 second and allow fast failover in <1 minute. Which database service meets these requirements?',
    options_ko: [
      'Amazon RDS MySQL with Cross-Region Read Replica',
      'Amazon Aurora Global Database',
      'Amazon DynamoDB with Single Region Tables',
      'Amazon DocumentDB Cluster'
    ],
    options_en: [
      'Amazon RDS MySQL with Cross-Region Read Replica',
      'Amazon Aurora Global Database',
      'Amazon DynamoDB with Single Region Tables',
      'Amazon DocumentDB Cluster'
    ],
    answer: 1,
    explanation_ko: 'Amazon Aurora Global Database는 전용 스토리지 레벨 복제 인프라를 사용하여 1초 미만의 복제 지연 시간을 제공하며, 재해 발생 시 보조 리전을 1분 이내에 완전한 읽기/쓰기 데이터베이스로 승격(RTO < 1분)시킬 수 있습니다.',
    explanation_en: 'Amazon Aurora Global Database uses dedicated storage-level infrastructure to achieve sub-second cross-region replication and allows promoting secondary regions in under 1 minute.'
  },
  {
    id: 'q10',
    service_id: 'dynamodb',
    conceptIds: ['dynamodb'],
    domain_id: 'database',
    difficulty: 'Hard',
    question_ko: '모바일 실시간 퀴즈 애플리케이션에서 특정 인기 퀴즈 진행 중 Amazon DynamoDB 테이블에 수십만 건의 동일 키 조회 요청(Hot Key Read)이 발생하여 응답 속도가 느려지고 있습니다. DynamoDB 읽기 지연시간을 밀리초에서 마이크로초 단위로 단축하기 위한 가장 적합한 서비스는?',
    question_en: 'A live mobile quiz app generates massive read bursts on specific popular items (hot keys) in Amazon DynamoDB. Which caching service should be introduced to reduce read latency from milliseconds down to microseconds without application redesign?',
    options_ko: [
      'Amazon ElastiCache for Memcached',
      'Amazon DynamoDB Accelerator (DAX)',
      'Amazon CloudFront API Cache',
      'Amazon RDS Proxy'
    ],
    options_en: [
      'Amazon ElastiCache for Memcached',
      'Amazon DynamoDB Accelerator (DAX)',
      'Amazon CloudFront API Cache',
      'Amazon RDS Proxy'
    ],
    answer: 1,
    explanation_ko: 'DynamoDB Accelerator(DAX)는 DynamoDB 전용 완전 관리형 인메모리 캐시로, 기존 DynamoDB API와 100% 호환되면서 읽기 응답 시간을 마이크로초 단위로 극대화하여 핫 파티션 키 병목을 완벽히 해결합니다.',
    explanation_en: 'DynamoDB Accelerator (DAX) is an in-memory cache purpose-built for DynamoDB that delivers microsecond response times for read-heavy workloads with full API compatibility.'
  },
  {
    id: 'q11',
    service_id: 'vpc',
    conceptIds: ['vpc'],
    domain_id: 'networking',
    difficulty: 'Medium',
    question_ko: '보안 정책상 프라이빗 서브넷에 위치한 EC2 인스턴스들이 퍼블릭 인터넷(인바운드)에 노출되지 않으면서, 외부 OS 보안 패치 서버로부터 아웃바운드 업데이트를 다운로드받아야 합니다. 어떤 구성을 적용해야 합니까?',
    question_en: 'Instances in a private subnet must download software updates from the internet without allowing inbound internet traffic to reach them. Which network component setup satisfies this requirement?',
    options_ko: [
      '프라이빗 서브넷에 Internet Gateway(IGW)를 직접 연결한다.',
      '퍼블릭 서브넷에 NAT Gateway를 배포하고, 프라이빗 서브넷 라우팅 테이블의 0.0.0.0/0 대상을 NAT Gateway로 지정한다.',
      '프라이빗 서브넷의 모든 인스턴스에 Elastic IP(탄력적 IP)를 할당한다.',
      'VPC Peering을 인터넷 게이트웨이에 연결한다.'
    ],
    options_en: [
      'Attach an Internet Gateway directly to the private subnet.',
      'Deploy a NAT Gateway in a public subnet and route 0.0.0.0/0 traffic from the private subnet route table to the NAT Gateway.',
      'Assign Elastic IPs to all private EC2 instances.',
      'Connect a VPC Peering connection to an Internet Gateway.'
    ],
    answer: 1,
    explanation_ko: 'NAT Gateway는 퍼블릭 서브넷에 배포되어 프라이빗 서브넷 리소스의 아웃바운드 인터넷 트래픽을 주소 변환하여 전달하며, 외부 인터넷에서 시작되는 인바운드 연결은 철저히 차단합니다.',
    explanation_en: 'A NAT Gateway deployed in a public subnet allows private subnet resources to initiate outbound requests to the internet while preventing inbound internet initiations.'
  },
  {
    id: 'q12',
    service_id: 'vpc',
    conceptIds: ['vpc'],
    domain_id: 'networking',
    difficulty: 'Hard',
    question_ko: '프라이빗 서브넷의 애플리케이션이 인터넷 게이트웨이나 NAT Gateway를 거치지 않고 오직 AWS 내부 사설 네트워크 백본만을 통해 Amazon S3 버킷에 안전하고 무료로 통신하고자 합니다. 어떤 VPC 기능을 생성해야 합니까?',
    question_en: 'An application in a private subnet must securely access Amazon S3 buckets over the private AWS network backbone without routing through an Internet Gateway or NAT Gateway. Which VPC feature should be created?',
    options_ko: [
      'S3용 VPC Gateway Endpoint (게이트웨이 엔드포인트)',
      'AWS Direct Connect 전용 회선',
      'AWS Transit Gateway',
      'VPC Egress-Only Internet Gateway'
    ],
    options_en: [
      'VPC Gateway Endpoint for Amazon S3',
      'AWS Direct Connect Dedicated Link',
      'AWS Transit Gateway',
      'VPC Egress-Only Internet Gateway'
    ],
    answer: 0,
    explanation_ko: 'VPC Gateway Endpoint(게이트웨이 엔드포인트)는 S3 및 DynamoDB에 대해 무료로 제공되며, 라우팅 테이블에 엔드포인트 대상을 추가함으로써 인터넷 통신 없이 프라이빗 네트워크 경로로 안전하게 연결합니다.',
    explanation_en: 'VPC Gateway Endpoints for S3 and DynamoDB route traffic directly across the AWS private network without using NAT Gateways or Internet Gateways at no additional charge.'
  },
  {
    id: 'q13',
    service_id: 'route53',
    conceptIds: ['route53'],
    domain_id: 'networking',
    difficulty: 'Medium',
    question_ko: '도메인 이름의 루트(Apex/Naked domain, 예: mycompany.com)를 Application Load Balancer(ALB)의 DNS 이름으로 연결하고자 합니다. 표준 DNS CNAME 규칙 제약을 극복하고 이를 지원하는 Route 53 전용 레코드 유형은?',
    question_en: 'A company wants to map its apex/naked domain (e.g. mycompany.com) to an Application Load Balancer (ALB). Which Amazon Route 53 record type allows this without violating standard DNS CNAME specifications?',
    options_ko: [
      'CNAME Record',
      'Alias Record (A 레코드 별칭)',
      'TXT Record',
      'PTR Record'
    ],
    options_en: [
      'CNAME Record',
      'Alias Record (A record Alias)',
      'TXT Record',
      'PTR Record'
    ],
    answer: 1,
    explanation_ko: 'Route 53 Alias(별칭) 레코드는 표준 DNS 규격상 CNAME을 사용할 수 없는 Zone Apex(도메인 루트)에서도 ALB, CloudFront, S3 등의 AWS 리소스를 직접 가리킬 수 있는 강력한 전용 기능입니다.',
    explanation_en: 'Route 53 Alias records can point zone apex domains (naked domains) directly to supported AWS resources such as ALBs and CloudFront distributions.'
  },
  {
    id: 'q14',
    service_id: 'cloudfront',
    conceptIds: ['cloudfront'],
    domain_id: 'networking',
    difficulty: 'Hard',
    question_ko: '정적 웹 사이트 미디어 파일이 S3 버킷에 저장되어 있으며, CloudFront CDN을 통해 전 세계에 배포되고 있습니다. 사용자가 S3 버킷 URL로 직접 접근하는 것을 철저히 차단하고 오직 CloudFront URL을 통해서만 콘텐츠에 접근하도록 강제하는 최신 권장 보안 설정은?',
    question_en: 'Static web media files are hosted in Amazon S3 and distributed globally via Amazon CloudFront. What is the AWS-recommended method to restrict direct S3 URL access so users can ONLY access files via the CloudFront distribution?',
    options_ko: [
      'S3 버킷에 퍼블릭 읽기 ACL을 부여하고 CloudFront에 Geo Restriction을 건다.',
      'CloudFront Origin Access Control(OAC)을 구성하고 S3 버킷 정책에서 해당 CloudFront 배포 ARN만 읽기를 허용한다.',
      'S3 버킷의 정적 웹 호스팅을 활성화한다.',
      'CloudFront 도메인에 대한 CORS 허용 헤더만 추가한다.'
    ],
    options_en: [
      'Grant Public Read ACL to S3 bucket and use CloudFront Geo Restriction.',
      'Configure CloudFront Origin Access Control (OAC) and update S3 bucket policy to allow only the CloudFront distribution ARN.',
      'Enable S3 static website hosting.',
      'Add CORS allow headers for the CloudFront domain.'
    ],
    answer: 1,
    explanation_ko: 'Origin Access Control(OAC)은 최신 S3-CloudFront 보안 표준으로, S3 버킷을 완전 비공개로 유지하면서 오직 인증된 CloudFront 배포만이 S3 객체를 읽을 수 있도록 서명된 요청을 전달합니다.',
    explanation_en: 'Origin Access Control (OAC) is the current AWS best practice that secures S3 buckets by authenticating requests from CloudFront distributions while keeping the bucket private.'
  },
  {
    id: 'q15',
    service_id: 'iam',
    conceptIds: ['iam'],
    domain_id: 'security',
    difficulty: 'Medium',
    question_ko: 'EC2 인스턴스에서 실행 중인 Node.js 웹 백엔드 애플리케이션이 Amazon DynamoDB 테이블에 데이터를 쓰고 S3 버킷에 파일을 업로드해야 합니다. 보안 모범 사례(Best Practice)를 준수하는 가장 안전한 인증 자격증명 부여 방식은?',
    question_en: 'A Node.js backend application running on Amazon EC2 instances must write data to DynamoDB and upload files to S3. What is the MOST secure credential management practice for granting these permissions?',
    options_ko: [
      'IAM 사용자를 생성하여 Access Key ID와 Secret Access Key를 발급받은 뒤 EC2 서버 소스코드 환경 변수에 저장한다.',
      '필요한 S3 및 DynamoDB 권한 정책이 연결된 IAM Role(역할)을 생성하고, 이를 EC2 인스턴스 프로파일로 인스턴스에 연결한다.',
      'S3와 DynamoDB의 모든 리소스 권한을 Public Allow로 설정한다.',
      '루트 계정 자격 증명을 EC2의 `~/.aws/credentials` 파일에 저장한다.'
    ],
    options_en: [
      'Create an IAM User, generate access keys, and hardcode them in the application environment variables.',
      'Create an IAM Role with least-privilege policies for S3 and DynamoDB, and attach it to the EC2 instance profile.',
      'Set public write permissions on both S3 and DynamoDB tables.',
      'Save the AWS account root credentials in the EC2 instance `~/.aws/credentials` file.'
    ],
    answer: 1,
    explanation_ko: 'EC2 인스턴스에 IAM Role을 연결하면 AWS Security Token Service(STS)를 통해 임시 보안 자격증명이 자동으로 교체 제공되므로 하드코딩된 영구 자격증명 유출 위험을 근본적으로 제거합니다.',
    explanation_en: 'Attaching an IAM Role via an EC2 Instance Profile automatically provides rotating temporary STS credentials, eliminating the critical risks associated with long-term hardcoded API keys.'
  },
  {
    id: 'q16',
    service_id: 'kms',
    conceptIds: ['kms'],
    domain_id: 'security',
    difficulty: 'Hard',
    question_ko: '금융 규제 준수를 위해 회사는 모든 EBS 볼륨과 RDS 데이터베이스의 암호화에 사용되는 암호화 키의 생성, 연간 자동 로테이션 및 세부 키 정책(Key Policy) 감사 제어 권한을 자체적으로 보유해야 합니다. 어떤 유형의 KMS 키를 사용해야 합니까?',
    question_en: 'To comply with financial regulatory standards, a company must manage its own encryption keys with annual automatic rotation, customizable key policies, and full audit control for EBS and RDS data at rest. Which KMS key type should be used?',
    options_ko: [
      'AWS 소유 키 (AWS Owned Keys)',
      '고객 관리형 키 (Customer Managed CMK)',
      'AWS 관리형 키 (AWS Managed Keys, 예: aws/ebs)',
      '클라이언트 측 SSL/TLS 인증서'
    ],
    options_en: [
      'AWS Owned Keys',
      'Customer Managed Keys (CMK)',
      'AWS Managed Keys (e.g. aws/ebs)',
      'Client-side TLS Certificates'
    ],
    answer: 1,
    explanation_ko: '고객 관리형 CMK(Customer Managed Key)는 사용자가 직접 키 정책을 수정하고, 연간 자동 로테이션을 활성화하며, 키 활성화/비활성화 및 삭제 일정을 통제할 수 있어 엄격한 규제 준수에 필수적입니다.',
    explanation_en: 'Customer Managed Keys (CMKs) provide granular control over key policies, annual automatic rotation, enable/disable status, and CloudTrail auditing needed for strict compliance.'
  },
  {
    id: "gen1",
    service_id: "autoscaling",
    conceptIds: ["autoscaling"],
    domain_id: "compute",
    difficulty: "Medium",
    question_ko: "한 전자의무기록(EHR) 헬스케어 스타트업이 Application Load Balancer(ALB) 뒤의 Amazon EC2 인스턴스에서 웹 애플리케이션을 운영하고 있습니다. 병원 진료 시간 동안 트래픽이 예측 불가능하게 급증하는 현상이 발생하고 있습니다. 최근 한 가용 영역(AZ)에 장애가 발생하여 서비스 중단이 일어났습니다. 또한 일부 EC2 인스턴스에서 웹 서버 프로세스가 다운되어 애플리케이션 응답이 멈췄으나, 인스턴스의 하드웨어 및 OS 상태 확인(EC2 status check)은 정상이었기 때문에 인스턴스가 자동으로 교체되지 않았습니다. 솔루션 아키텍트는 가용 영역 장애에 복원력을 갖추고, 평균 CPU 사용률을 60%로 유지하도록 용량을 자동 확장하며, 애플리케이션 계층에서 응답하지 않는 인스턴스를 자동으로 교체하는 고가용성의 비용 효율적인 아키텍처를 설계해야 합니다.\n\n가장 적은 운영 오버헤드로 이러한 요구 사항을 충족하는 솔루션은 무엇입니까?",
    question_en: "A healthcare records startup operates an Electronic Health Record (EHR) web application running on Amazon EC2 instances behind an Application Load Balancer (ALB). The platform experiences unpredictable spikes in web traffic during clinic operating hours. During a recent incident, an Availability Zone outage caused service downtime. In addition, several EC2 instances experienced web server software crashes that caused the application to stop responding, but the instances were not replaced because the underlying hardware and OS status checks remained healthy. A solutions architect must design a highly available and cost-effective architecture that automatically scales compute capacity to maintain an average CPU utilization of 60% and automatically replaces instances that fail application-level health checks.\n\nWhich solution meets these requirements with the LEAST operational overhead?",
    options_ko: [
      "ALB 뒤의 여러 가용 영역에 걸쳐 있는 Auto Scaling 그룹에 EC2 인스턴스를 배포합니다. Auto Scaling 그룹의 상태 확인 유형(Health Check Type)을 ELB로 구성합니다. 평균 CPU 사용률을 60%로 유지하도록 구성된 대상 추적 조정(Target Tracking Scaling) 정책을 연결합니다.",
      "Network Load Balancer(NLB) 뒤의 단일 가용 영역 내 여러 서브넷에 EC2 인스턴스를 배포합니다. HTTP 500 오류를 감지하는 Amazon CloudWatch 경보를 생성하고 응답하지 않는 인스턴스를 재부팅하는 AWS Lambda 함수를 트리거합니다. 진료 시간 동안 인스턴스를 확장하도록 예약된 조정(Scheduled Scaling) 정책을 사용합니다.",
      "여러 가용 영역에 걸쳐 EC2 인스턴스를 배포합니다. 애플리케이션 로그 파일에 대한 Amazon CloudWatch 지표 필터를 생성하여 응답하지 않는 웹 프로세스를 모니터링합니다. 장애가 발생한 인스턴스를 종료하고 새 인스턴스를 시작하는 단순 조정(Simple Scaling) 정책을 트리거하도록 AWS Systems Manager Automation 문서를 구성합니다.",
      "ALB 뒤의 여러 가용 영역에 걸쳐 있는 Auto Scaling 그룹에 EC2 인스턴스를 배치합니다. Auto Scaling 그룹의 상태 확인 유형(Health Check Type)을 EC2로 설정합니다. CPU 사용률이 60%를 초과할 때 인스턴스 용량을 늘리도록 단계별 조정(Step Scaling) 정책을 연결합니다."
    ],
    options_en: [
      "Deploy the EC2 instances in an Auto Scaling group that spans multiple Availability Zones behind the ALB. Configure the Auto Scaling group health check type to ELB. Attach a Target Tracking scaling policy configured to maintain the average CPU utilization at 60%.",
      "Deploy the EC2 instances in a single Availability Zone across multiple subnets behind a Network Load Balancer (NLB). Configure an Amazon CloudWatch alarm to detect HTTP 500 errors and trigger an AWS Lambda function to reboot unresponsive instances. Use a Scheduled Scaling policy during clinic operating hours.",
      "Deploy the EC2 instances across multiple Availability Zones. Create an Amazon CloudWatch metric filter on application log files to monitor unresponsive web processes. Configure an AWS Systems Manager Automation document to terminate failed instances and trigger a Simple Scaling policy to launch new instances.",
      "Deploy the EC2 instances in an Auto Scaling group that spans multiple Availability Zones behind the ALB. Configure the Auto Scaling group health check type to EC2. Attach a Step Scaling policy that increases instance capacity when CPU utilization exceeds 60%."
    ],
    answer: 0,
    explanation_ko: "**정답: 세 번째 항목 (Index 2)**\n\n- **대상 추적 조정 정책(Target Tracking Scaling Policy):** 대상 추적 조정 정책은 특정 지표(예: 평균 CPU 사용률 60%)를 목표값으로 유지하도록 인스턴스 수를 동적으로 자동 조정합니다. 단계별 조정(Step Scaling)이나 단순 조정에 비해 설정이 간단하고 최소한의 운영 오버헤드로 동작합니다.\n- **Auto Scaling 그룹의 ELB 상태 확인(Health Check):** 기본적으로 Auto Scaling 그룹은 EC2 상태 확인(하드웨어/하이퍼바이저 수준)만 수행합니다. 상태 확인 유형을 `ELB`로 구성하면 ALB의 대상 그룹 헬스 체크 결과를 반영하므로, 웹 애플리케이션 프로세스가 다운되어 HTTP 요청에 응답하지 못할 때 비정상(Unhealthy)으로 감지하고 자동으로 종료 및 교체할 수 있습니다.\n- **다중 가용 영역(Multi-AZ) 배포:** ALB 뒤의 여러 가용 영역에 걸쳐 Auto Scaling 그룹을 배치하면 단일 가용 영역 장애 시에도 서비스 중단 없이 고가용성을 유지할 수 있습니다.\n\n**오답 분석:**\n- **첫 번째 항목 (Index 0):** 상태 확인 유형이 `EC2`로 설정되어 있으면 OS/하드웨어 수준의 상태만 점검하므로, 웹 서버 프로세스가 중단되어도 인스턴스가 교체되지 않습니다. 또한 단계별 조정(Step Scaling)은 임곗값 구간을 직접 관리해야 하므로 대상 추적 정책에 비해 운영 오버헤드가 큽니다.\n- **두 번째 항목 (Index 1):** 단일 가용 영역(Single AZ) 배포는 가용 영역 장애에 대응할 수 없어 고가용성 요건을 만족하지 못합니다. 또한 CloudWatch 경보와 Lambda를 활용한 재부팅은 불필요한 운영 오버헤드를 유발하며, 예측 불가능한 트래픽 변동에는 예약된 조정(Scheduled Scaling)이 적합하지 않습니다.\n- **네 번째 항목 (Index 3):** 로그 기반 지표 필터와 Systems Manager Automation 문서를 사용하는 방식은 Auto Scaling의 내장 기능(ELB 상태 확인 및 대상 추적 정책)으로 간단히 해결할 수 있는 요구사항을 지나치게 복잡하게 구현하여 높은 운영 오버헤드를 초래합니다.",
    explanation_en: "**Correct Answer: Option 3 (Index 2)**\n\n- **Target Tracking Scaling Policy:** A target tracking scaling policy adjusts capacity to maintain a specified metric (e.g., Average CPU Utilization at 60%) relative to a target value. It adds and removes capacity dynamically with the least operational complexity compared to manual step scaling or simple scaling.\n- **ELB Health Checks on Auto Scaling Group:** By default, an Auto Scaling group only performs EC2 status checks (hypervisor/hardware level). When the health check type is configured to `ELB`, the Auto Scaling group also monitors the Application Load Balancer's target health checks. If the web server process crashes and fails the HTTP health check, the instance is marked unhealthy and replaced automatically.\n- **Multi-AZ Deployment:** Spanning the Auto Scaling group across multiple Availability Zones in private subnets behind an ALB provides high availability and fault tolerance against AZ outages.\n\n**Why the other options are incorrect:**\n- **Option 1 (Index 0):** Setting the health check type to `EC2` only checks instance reachability and underlying hardware; it will not detect or replace instances where the web server software has crashed. Additionally, Step Scaling requires defining and managing manual threshold steps, which introduces more operational overhead than Target Tracking.\n- **Option 2 (Index 1):** Deploying in a single Availability Zone violates the high availability requirement and fails to protect against AZ outages. Using custom CloudWatch alarms and Lambda functions to reboot instances introduces unnecessary operational overhead and does not cleanly replace faulty instances. Scheduled scaling does not adapt to unpredictable spikes in traffic.\n- **Option 4 (Index 3):** Implementing CloudWatch log metric filters combined with AWS Systems Manager Automation to manually terminate instances adds significant complexity and management overhead when native ELB health check integration in Auto Scaling already solves this out-of-the-box."
  },
  {
    id: "gen2",
    service_id: "autoscaling",
    conceptIds: ["autoscaling"],
    domain_id: "compute",
    difficulty: "Medium",
    question_ko: "한 지역 항공사가 Application Load Balancer(ALB) 뒤의 Amazon EC2 인스턴스에서 항공권 예약 웹 플랫폼을 운영하고 있습니다. 특가 프로모션이나 기상 악화로 인한 항공편 지연/결항이 발생할 때 트래픽이 예측 불가능하게 급증합니다. 이러한 트래픽 급증 시 기본 EC2 시스템 상태 검사는 정상(OK)으로 유지되지만, 일부 웹 서버 프로세스가 멈추거나 사용자에게 HTTP 500 오류를 반환하는 문제가 발생합니다. 항공사는 예측할 수 없는 수요 변화에 맞춰 컴퓨팅 용량을 자동으로 조정하고, 응답하지 않는 애플리케이션 인스턴스를 자동으로 교체하며, 유휴 비용을 최소화하면서 고가용성을 유지하고자 합니다.\n\n이러한 요구 사항을 가장 비용 효율적이고 안정적으로 충족하는 솔루션은 무엇입니까?",
    question_en: "A regional airline operates a flight booking web platform hosted on Amazon EC2 instances behind an Application Load Balancer (ALB). Web traffic spikes unpredictably during flash promotions and severe weather disruptions. During these spikes, some web server processes freeze and return HTTP 500 errors to users, even though the underlying EC2 system status checks remain healthy. The airline wants to automatically adjust compute capacity to handle unpredictable demand, replace unresponsive application instances, and maintain high availability while minimizing idle compute costs.\n\nWhich combination of steps should a solutions architect recommend to meet these requirements?",
    options_ko: [
      "Application Load Balancer 뒤의 단일 가용 영역(AZ) 내 Auto Scaling 그룹에 EC2 인스턴스를 배포합니다. 네트워크 인/아웃 지표를 기반으로 단계별 확장(Step scaling) 정책을 구성하고, Auto Scaling 그룹의 상태 검사 유형을 ELB로 설정합니다.",
      "Application Load Balancer 뒤의 여러 가용 영역(AZ)에 걸쳐 Auto Scaling 그룹에 EC2 인스턴스를 배포합니다. 대상별 Application Load Balancer 요청 수 지표를 기반으로 대상 추적 확장(Target tracking scaling) 정책을 구성하고, Auto Scaling 그룹의 상태 검사 유형을 ELB로 설정합니다.",
      "Application Load Balancer 뒤의 여러 가용 영역(AZ)에 걸쳐 Auto Scaling 그룹에 EC2 인스턴스를 배포합니다. 예상 피크 시간에 맞춰 예약된 확장(Scheduled scaling) 정책을 구성하고, Auto Scaling 그룹의 상태 검사 유형을 EC2로 설정합니다.",
      "Application Load Balancer 뒤의 여러 가용 영역(AZ)에 걸쳐 Auto Scaling 그룹에 EC2 인스턴스를 배포합니다. 평균 CPU 사용률 지표를 기반으로 대상 추적 확장 정책을 구성하고, Auto Scaling 그룹의 상태 검사 유형을 EC2로 설정합니다."
    ],
    options_en: [
      "Deploy the EC2 instances in an Auto Scaling group within a single Availability Zone behind the Application Load Balancer. Configure a step scaling policy based on network in/out metrics, and set the Auto Scaling group health check type to ELB.",
      "Deploy the EC2 instances in an Auto Scaling group across multiple Availability Zones behind the Application Load Balancer. Configure a target tracking scaling policy based on the Application Load Balancer request count per target metric, and set the Auto Scaling group health check type to ELB.",
      "Deploy the EC2 instances in an Auto Scaling group across multiple Availability Zones behind the Application Load Balancer. Configure scheduled scaling policies for expected peak hours, and set the Auto Scaling group health check type to EC2.",
      "Deploy the EC2 instances in an Auto Scaling group across multiple Availability Zones behind the Application Load Balancer. Configure a target tracking scaling policy based on the Average CPU Utilization metric, and set the Auto Scaling group health check type to EC2."
    ],
    answer: 1,
    explanation_ko: "**정답:** Application Load Balancer 뒤의 여러 가용 영역(AZ)에 걸쳐 Auto Scaling 그룹에 EC2 인스턴스를 배포합니다. 대상별 Application Load Balancer 요청 수 지표를 기반으로 대상 추적 확장(Target tracking scaling) 정책을 구성하고, Auto Scaling 그룹의 상태 검사 유형을 ELB로 설정합니다.\n\n**해설:**\n1. **고가용성 확보:** 여러 가용 영역(Multi-AZ)의 서브넷에 걸쳐 Auto Scaling 그룹(ASG)을 배포하면 단일 가용 영역 장애 시에도 항공권 예약 서비스가 중단 없이 지속됩니다.\n2. **예측 불가능한 트래픽 동적 처리:** 대상별 ALB 요청 수(`ALBRequestCountPerTarget`) 지표를 기반으로 하는 **대상 추적 확장 정책(Target Tracking Scaling Policy)**을 사용하면 트래픽 급증 시 자동으로 인스턴스를 증설(Scale-out)하고, 트래픽 감소 시 유휴 인스턴스를 종료(Scale-in)하여 성능과 비용을 모두 최적화할 수 있습니다.\n3. **애플리케이션 계층 장애 감지 및 자동 교체:** 기본 EC2 상태 검사는 하이퍼바이저와 인스턴스 하드웨어 상태만 확인하므로, 웹 서버 프로세스가 멈추거나 HTTP 500 오류를 반환하더라도 정상(OK)으로 판별합니다. Auto Scaling 그룹의 상태 검사 유형을 **`ELB`**로 구성하면 ALB의 대상 그룹 상태 검사 결과를 활용하여 웹 서비스가 응답하지 않는 인스턴스를 비정상으로 표시하고 자동으로 새 인스턴스로 교체합니다.\n\n**오답 분석:**\n- **선택지 0번이 오답인 이유:** 상태 검사 유형이 기본 EC2로 설정되어 있어 웹 서버 프로세스가 멈추거나 HTTP 5xx 에러를 반환하는 애플리케이션 수준 장애 인스턴스를 감지하여 교체하지 못합니다.\n- **선택지 1번이 오답인 이유:** 단일 가용 영역에 인스턴스를 배포하면 가용 영역 전체 장애 시 서비스가 중단되므로 고가용성 요건을 만족하지 못합니다.\n- **선택지 3번이 오답인 이유:** 예약된 확장(Scheduled Scaling)은 주기적이고 예측 가능한 일정에만 적합하며, 기상 악화나 불시 프로모션과 같은 예측 불가능한 급증에 대응할 수 없습니다. 또한 EC2 상태 검사만으로는 웹 프로세스 먹통 현상을 감지할 수 없습니다.",
    explanation_en: "**Correct Answer:** Deploy the EC2 instances in an Auto Scaling group across multiple Availability Zones behind the Application Load Balancer. Configure a target tracking scaling policy based on the Application Load Balancer request count per target metric, and set the Auto Scaling group health check type to ELB.\n\n**Explanation:**\n1. **High Availability:** Spanning the Auto Scaling group (ASG) across subnets in multiple Availability Zones ensures that the platform remains resilient if an entire Availability Zone experiences an outage.\n2. **Handling Unpredictable Traffic Dynamically:** A Target Tracking Scaling Policy configured on the `ALBRequestCountPerTarget` metric automatically adds capacity as booking requests spike and removes instances when traffic drops, optimizing both performance and cost.\n3. **Application-Level Health Detection & Replacement:** Default EC2 status checks only monitor hypervisor and underlying host hardware health. When a web server application crashes, freezes, or throws HTTP 500 errors while the operating system is still running, EC2 checks will still report `OK`. Enabling **ELB health checks** on the Auto Scaling group instructs the ASG to use Application Load Balancer health check results to identify unresponsive web servers and automatically terminate and replace them.\n\n**Distractor Analysis:**\n- **Option 0 is incorrect:** It retains default EC2 status checks, meaning the ASG will not detect or replace instances when the web application process freezes or fails HTTP health checks.\n- **Option 1 is incorrect:** Deploying in a single Availability Zone creates a single point of failure and violates high availability requirements.\n- **Option 3 is incorrect:** Scheduled scaling is only appropriate for predictable, recurring schedules and cannot dynamically respond to sudden weather disruptions or flash promotion traffic. Additionally, default EC2 status checks fail to catch application process hangs."
  },
  {
    id: "gen3",
    service_id: "autoscaling",
    conceptIds: ["autoscaling"],
    domain_id: "compute",
    difficulty: "Medium",
    question_ko: "한 모바일 게임 개발사가 Application Load Balancer(ALB) 뒤의 Amazon EC2 Auto Scaling 그룹에서 멀티플레이어 매치메이킹 및 로비 서비스를 호스팅하고 있습니다. 인스턴스는 여러 가용 영역에 분산 배포되어 있습니다. 예기치 않은 인플루언서 라이브 방송 등으로 인해 플레이어 트래픽이 급증하곤 합니다. 트래픽이 몰릴 때 간헐적인 메모리 누수로 인해 매치메이킹 애플리케이션 프로세스가 멈추고 ALB로 HTTP 500 오류를 반환하지만, 기본 EC2 인스턴스는 여전히 정상 작동하여 EC2 시스템 및 인스턴스 상태 확인을 통과하기 때문에 Auto Scaling 그룹이 해당 인스턴스를 교체하지 않습니다.\n\n비정상 인스턴스를 자동으로 교체하고 예측할 수 없는 트래픽에 맞춰 플릿을 동적으로 확장할 수 있는 솔루션 중 최소한의 운영 오버헤드를 수반하는 것은 무엇입니까?",
    question_en: "A mobile game studio hosts its multiplayer matchmaking and lobby service on an Auto Scaling group of Amazon EC2 instances behind an Application Load Balancer (ALB). The instances are deployed across multiple Availability Zones. During unexpected viral streaming events, player traffic spikes dramatically. Under heavy load, memory leaks occasionally cause the matchmaking application process to freeze and return HTTP 500 errors to the ALB. However, the underlying EC2 instances remain reachable and pass EC2 system and instance status checks, so the Auto Scaling group does not replace them.\n\nWhich solution should a solutions architect recommend to automatically replace failing instances and scale the fleet to handle unpredictable traffic with the LEAST operational overhead?",
    options_ko: [
      "Amazon S3에 저장된 ALB 액세스 로그를 분석하는 Amazon EventBridge 규칙을 구성하여 비정상 인스턴스를 종료하고 Auto Scaling 그룹의 희망 용량(Desired Capacity)을 수동으로 업데이트하는 AWS Systems Manager Run Command 스크립트를 트리거합니다.",
      "프로모션 전에 인스턴스 용량을 늘리도록 예약된 조정(Scheduled Scaling) 정책을 구성하고, Amazon Route 53 DNS 장애 조치 상태 확인을 사용하여 응답하지 않는 EC2 인스턴스를 종료 및 재생성합니다.",
      "Auto Scaling 그룹이 적절한 유예 기간(Grace Period)과 함께 ELB 상태 확인을 사용하도록 구성하고, Application Load Balancer의 RequestCountPerTarget 지표를 기반으로 하는 대상 추적 조정 정책을 구현합니다.",
      "Auto Scaling 그룹에서 기본 EC2 상태 확인을 유지하고, EC2 CPUUtilization에 대한 Amazon CloudWatch 경보를 생성하여 단계별 조정(Step Scaling)을 트리거하며, HTTP 500 오류를 반환하는 인스턴스를 재부팅하는 AWS Lambda 함수를 호출합니다."
    ],
    options_en: [
      "Configure an Amazon EventBridge rule that analyzes ALB access logs stored in Amazon S3 to trigger an AWS Systems Manager Run Command script that terminates faulty instances and manually updates the Auto Scaling group's desired capacity.",
      "Configure a scheduled scaling policy to increase instance capacity before promotions, and use Amazon Route 53 DNS failover health checks to terminate and recreate unresponsive EC2 instances.",
      "Configure the Auto Scaling group to use ELB health checks with an appropriate grace period, and implement a target tracking scaling policy based on the Application Load Balancer RequestCountPerTarget metric.",
      "Retain the default EC2 health checks on the Auto Scaling group, create an Amazon CloudWatch alarm for EC2 CPUUtilization to trigger step scaling, and invoke an AWS Lambda function to reboot instances that return HTTP 500 errors."
    ],
    answer: 2,
    explanation_ko: "**정답: Auto Scaling 그룹이 적절한 유예 기간(Grace Period)과 함께 ELB 상태 확인을 사용하도록 구성하고, Application Load Balancer의 RequestCountPerTarget 지표를 기반으로 하는 대상 추적 조정 정책을 구현합니다.**\n\n### 정답 해설:\n1. **ELB 상태 확인(ELB Health Checks)**: 기본적으로 EC2 Auto Scaling 그룹은 하이퍼바이저 및 OS 도달 가능성만 점검하는 EC2 상태 확인을 사용합니다. OS가 살아 있는 상태에서 애플리케이션 프로세스가 멈추거나 HTTP 500 오류를 반환하면 EC2 상태 확인은 통과되므로 인스턴스가 교체되지 않습니다. 상태 확인 유형을 `ELB`로 변경하면 Auto Scaling 그룹이 ALB 대상 그룹의 상태 확인 결과를 사용합니다. 특정 인스턴스가 대상 그룹 상태 확인에 실패하면 Auto Scaling 그룹이 이를 비정상(Unhealthy)으로 표시하고 자동으로 종료한 후 새 인스턴스로 교체합니다. 적절한 상태 확인 유예 기간(Grace Period)을 설정하면 새 인스턴스가 부팅 및 초기화되는 동안 비정상으로 오판정되는 것을 방지할 수 있습니다.\n2. **대상 추적 조정 정책(`ALBRequestCountPerTarget`)**: ALB 뒤에 위치한 웹/API 서비스의 경우, 사전 정의된 `ALBRequestCountPerTarget` 지표를 활용한 대상 추적(Target Tracking) 정책을 적용하면 대상당 적정 요청 수를 유지하도록 인스턴스를 자동으로 확장/축소합니다. 이는 복잡한 임계값 계산 없이 예측 불가능한 트래픽 급증을 가장 적은 운영 오버헤드로 처리합니다.\n\n---\n\n### 오답 분석:\n- **예약된 조정(Scheduled Scaling) 및 Route 53 장애 조치**: 예약된 조정은 바이럴 방송과 같은 불규칙하고 예측 불가능한 트래픽 급증에 동적으로 대응할 수 없습니다. 또한 Route 53 DNS 장애 조치는 엔드포인트 간 DNS 라우팅을 전환하는 용도이며, Auto Scaling 그룹 내의 개별 비정상 EC2 인스턴스를 종료하고 교체하지 못합니다.\n- **기본 EC2 상태 확인 유지 및 CPU 경보/Lambda 재부팅**: 기본 EC2 상태 확인은 애플리케이션 프로세스 정지나 HTTP 500 반환과 같은 애플리케이션 계층 장애를 감지하지 못합니다. 또한 Lambda 함수를 만들어 인스턴스를 재부팅하는 방식은 네이티브 ELB 상태 확인 기능에 비해 불필요한 운영 복잡도를 초래합니다.\n- **S3 로그 분석 기반 EventBridge 및 Systems Manager**: S3 액세스 로그 전송에는 지연이 수반되며, 로그를 파싱하여 스크립트로 인스턴스를 종료하고 희망 용량을 수동으로 조절하는 방식은 AWS의 기본 Auto Scaling 기능에 비해 과도하게 복잡하고 불안정합니다.",
    explanation_en: "**Correct Answer: Configure the Auto Scaling group to use ELB health checks with an appropriate grace period, and implement a target tracking scaling policy based on the Application Load Balancer RequestCountPerTarget metric.**\n\n### Why this is the correct solution:\n1. **ELB Health Checks**: By default, an Amazon EC2 Auto Scaling group uses standard EC2 status checks, which only evaluate hypervisor and operating system reachability. If an application process crashes, freezes due to memory exhaustion, or responds with HTTP 500 errors while the OS remains functional, EC2 status checks continue to pass. Changing the Auto Scaling group's health check type to `ELB` enables the group to utilize the health check results from the ALB target group. When an instance fails target health checks, the Auto Scaling group marks it unhealthy, terminates it, and launches a fresh replacement instance. Configuring a health check grace period gives new instances sufficient time to initialize before health checks start triggering replacements.\n2. **Target Tracking Scaling Policy (`ALBRequestCountPerTarget`)**: For web/API workloads behind an ALB with unpredictable request surges, a target tracking policy based on the predefined `ALBRequestCountPerTarget` metric automatically scales instance count to maintain an optimal request load per target. This requires minimal configuration and operational overhead compared to manual step scaling alarms.\n\n---\n\n### Why other options are incorrect:\n- **Scheduled Scaling & Route 53 DNS Failover**: Scheduled scaling requires predictable, known schedules and cannot dynamically react to unexpected viral traffic spikes. Route 53 DNS failover routes traffic across different endpoints/regions at the DNS level and cannot terminate or replace individual unhealthy EC2 instances within an Auto Scaling group.\n- **Default EC2 Health Checks with CloudWatch CPU Alarm & Lambda**: Standard EC2 health checks fail to detect application-layer crashes (such as frozen processes returning HTTP 500). Writing custom Lambda scripts to detect 500 errors and reboot instances adds substantial maintenance and operational complexity over native ELB health checks. Additionally, CPU utilization does not directly scale with request count for all workloads.\n- **S3 Access Log Analysis via EventBridge & Systems Manager**: S3 log delivery introduces latency and delay. Building custom log-parsing rules and Systems Manager scripts to manually terminate instances and adjust desired capacity creates excessive operational overhead and is fragile compared to native Auto Scaling features."
  },
  {
    id: "gen4",
    service_id: "ec2",
    conceptIds: ["ec2"],
    domain_id: "compute",
    difficulty: "Medium",
    question_ko: "한 헬스케어 전자의무기록(EHR) 스타트업이 환자 접수 및 의료 문서 분석 플랫폼을 AWS 환경에 구축하고 있습니다. 이 애플리케이션은 Amazon EC2에서 실행되는 다음과 같은 두 가지 주요 컴퓨팅 워크로드로 구성됩니다.\n\n1. 향후 1년간 연중무휴(24/7) 지속적으로 실행되며 예측 가능한 기준(baseline) 트래픽을 처리하는 핵심 웹 및 API 서비스\n2. 스캔된 진료 기록에서 텍스트를 추출하고 분석 보고서를 생성하는 심야 배치 처리 파이프라인 (해당 작업은 무상태(stateless) 및 내결함성을 갖추고 있으며, 수분마다 진행 상황을 Amazon S3에 체크포인트로 저장하므로 예기치 못한 인스턴스 중단에도 데이터 손실 없이 복구 가능)\n\n솔루션스 아키텍트는 핵심 API의 고가용성을 보장하면서 전체 인프라 비용을 최소화하는 컴퓨팅 구매 전략을 설계해야 합니다.\n\n이러한 요구 사항을 가장 비용 효율적으로 충족하는 Amazon EC2 구매 옵션 조합은 무엇입니까?",
    question_en: "A healthcare records startup is deploying a cloud-native patient intake and medical document analysis platform on AWS. The application consists of two primary compute workloads running on Amazon EC2:\n\n1. A core web and API service that operates continuously 24/7 with a predictable, steady baseline traffic load over a 1-year contract period.\n2. A nightly batch data-processing pipeline that performs OCR on scanned clinical records and generates analytics reports. This batch job is stateless, fault-tolerant, checkpoints progress to Amazon S3 every few minutes, and can gracefully tolerate sudden instance terminations.\n\nA solutions architect needs to design a compute purchasing strategy that minimizes total infrastructure costs while maintaining high availability for the core API.\n\nWhich combination of Amazon EC2 purchase options meets these requirements MOST cost-effectively?",
    options_ko: [
      "핵심 API 기준 워크로드에는 Compute Savings Plans 또는 예약 인스턴스(Reserved Instances)를 구매하여 적용하고, 심야 배치 처리 파이프라인에는 스팟 인스턴스(Spot Instances)를 활용한다.",
      "핵심 API 워크로드에는 Auto Scaling 그룹 기반 스팟 인스턴스(Spot Instances)를 사용하고, 심야 배치 처리 파이프라인에는 전용 호스트(Dedicated Hosts)를 사용한다.",
      "핵심 API 워크로드에는 온디맨드 인스턴스(On-Demand Instances)를 사용하고, 심야 배치 처리 파이프라인에는 1년 약정 표준 예약 인스턴스(Standard Reserved Instances)를 구매한다.",
      "핵심 API 워크로드에는 전용 인스턴스(Dedicated Instances)를 프로비저닝하고, 심야 배치 처리 파이프라인에는 온디맨드 인스턴스(On-Demand Instances)를 실행한다."
    ],
    options_en: [
      "Purchase Compute Savings Plans or Reserved Instances for the baseline core API workload, and launch Spot Instances for the nightly batch processing pipeline.",
      "Use Spot Instances with an Auto Scaling group for the core API workload, and use Dedicated Hosts for the nightly batch processing pipeline.",
      "Use On-Demand Instances for the core API workload, and purchase 1-year Standard Reserved Instances for the nightly batch processing pipeline.",
      "Use Dedicated Instances for the core API workload, and launch On-Demand Instances for the nightly batch processing pipeline."
    ],
    answer: 0,
    explanation_ko: "### 정답 해설: 보기 3 (인덱스 2)\n\n- **핵심 API 기준 워크로드에 Compute Savings Plans 또는 예약 인스턴스(RI) 적용**: 1년 이상 연중무휴(24/7)로 예측 가능한 기준(baseline) 트래픽을 처리하는 상시 가동 워크로드(Steady-state workload)에는 1년 약정을 통해 온디맨드 대비 최대 72%의 할인 혜택을 제공하는 Compute Savings Plans 또는 예약 인스턴스를 사용하는 것이 가장 적합하고 비용 효율적입니다.\n- **심야 배치 처리에 스팟 인스턴스(Spot Instances) 활용**: 스팟 인스턴스는 여유 EC2 용량을 온디맨드 대비 최대 90% 저렴하게 제공합니다. 문제의 심야 배치 파이프라인은 무상태(stateless)이며, 내결함성을 갖추고 수분마다 Amazon S3에 작업 상태를 체크포인트로 저장하므로 인스턴스 중단이 발생하더라도 안전하게 복구할 수 있어 스팟 인스턴스의 최적 사용 사례입니다.\n\n---\n\n### 오답 분석:\n\n- **보기 1 (핵심 API에 온디맨드 + 배치 처리에 예약 인스턴스)**: 24/7 지속 실행되는 API에 온디맨드를 사용하면 약정 할인을 받지 못해 비용이 과다 청구됩니다. 또한 야간에만 짧게 실행되는 배치 작업에 예약 인스턴스를 구매하면 낮 시간 동안 인스턴스가 유휴(Idle) 상태임에도 요금이 계속 발생하여 비효율적입니다.\n- **보기 2 (핵심 API에 스팟 인스턴스 + 배치 처리에 전용 호스트)**: 핵심 프로덕션 API에 스팟 인스턴스를 적용하면 용량 회수로 인한 2분 전 알림 후 인스턴스가 강제 종료될 수 있어 가용성에 치명적입니다. 또한 전용 호스트(Dedicated Hosts)는 소켓/코어 단위의 BYOL 소프트웨어 라이선스나 물리적 규제 준수가 요구될 때 사용하는 고비용 옵션으로, 일반 배치 처리에 사용하는 것은 부적절합니다.\n- **보기 4 (핵심 API에 전용 인스턴스 + 배치 처리에 온디맨드)**: 전용 인스턴스(Dedicated Instances)는 물리적 하드웨어 격리 규정이 요구되지 않는 한 불필요하게 높은 비용이 발생합니다. 또한 중단 가능한 배치 작업에 온디맨드 인스턴스를 사용하는 것은 스팟 인스턴스 대비 비용 효율성이 크게 떨어집니다.",
    explanation_en: "### Correct Answer: Option 3 (Index 2)\n\n- **Compute Savings Plans / Reserved Instances for the Core API**: The core API and web tier runs continuously 24/7 with a predictable, steady baseline utilization over a 1-year contract. Committing to a 1-year Compute Savings Plan or Reserved Instance provides the highest discount (up to 72% compared to On-Demand) for steady-state production workloads without risking service availability.\n- **Spot Instances for Nightly Batch Processing**: Spot Instances provide unused EC2 capacity at up to a 90% discount compared to On-Demand pricing. Because the batch processing workload is stateless, highly fault-tolerant, and checkpoints state to Amazon S3 every few minutes, it can easily handle the 2-minute interruption notice if capacity is reclaimed, making it the most cost-effective compute option.\n\n---\n\n### Distractor Analysis:\n\n- **Option 1 (On-Demand for API + Reserved Instances for Batch)**: Incorrect. Running a 24/7 steady-state API on On-Demand fails to leverage significant commitment discounts. Furthermore, purchasing Reserved Instances for nightly batch processing is wasteful because the instances would sit idle and bill continuously during non-batch daytime hours.\n- **Option 2 (Spot for API + Dedicated Hosts for Batch)**: Incorrect. Spot Instances can be terminated with a 2-minute notice when AWS needs the capacity back, making them unsuitable for critical customer-facing production APIs that require high availability. Dedicated Hosts are designed for compliance or BYOL (Bring Your Own License) requirements at the physical server level and are extremely expensive for a basic batch job.\n- **Option 4 (Dedicated Instances for API + On-Demand for Batch)**: Incorrect. Dedicated Instances incur additional tenancy fees and are unnecessary unless strict compliance or hardware isolation is mandated. Running interruptible, fault-tolerant batch workloads on On-Demand Instances results in significantly higher costs than leveraging Spot Instances."
  },
  {
    id: "gen5",
    service_id: "ec2",
    conceptIds: ["ec2"],
    domain_id: "compute",
    difficulty: "Medium",
    question_ko: "한 지역 항공사가 AWS에서 운영 중인 항공권 예약 플랫폼의 호스팅 아키텍처를 재설계하고 있습니다. 이 플랫폼은 사용자 대상의 웹 애플리케이션과 비동기 백그라운드 처리 서비스로 구성되어 있습니다. 웹 애플리케이션은 연중 연중무휴(24/7)로 지속 실행되는 8대의 Amazon EC2 인스턴스라는 안정적인 기준(Baseline) 용량이 필요하며, 사용자 트랜잭션 중단이 발생해서는 안 되는 계절별 특가 프로모션 기간에는 예측할 수 없는 트래픽 급증을 처리하기 위해 최대 25대의 인스턴스가 동적으로 추가 확장되어야 합니다. 비동기 백그라운드 서비스는 항공권 정산 및 마일리지 재계산 작업을 처리하며, 이 배치 작업은 무상태(Stateless)이고 내결함성을 갖추고 있으며 수 분마다 체크포인트를 저장하므로 예기치 않은 중단을 견딜 수 있습니다.\n\n이러한 요구 사항을 가장 비용 효율적으로 충족하는 Amazon EC2 구매 옵션 조합은 무엇입니까?",
    question_en: "A regional airline is redesigning the hosting architecture for its flight booking platform on AWS. The platform consists of a customer-facing web application and an asynchronous background processing service. The web application requires a steady baseline capacity of 8 Amazon EC2 instances running continuously 24/7 throughout the year, with dynamic scaling up to 25 additional instances to handle unpredictable traffic spikes during seasonal fare promotions where user transactions cannot tolerate interruptions. The asynchronous background service processes ticket reconciliation and flight mileage recalculations; this batch job is stateless, fault-tolerant, checkpoints its progress every few minutes, and can tolerate unexpected interruptions.\n\nWhich combination of Amazon EC2 purchase options will meet these requirements MOST cost-effectively?",
    options_ko: [
      "기준 용량 8대의 인스턴스에 대해 Compute Savings Plans 또는 예약 인스턴스(Reserved Instances)를 구매하고, 프로모션 트래픽 급증에는 Auto Scaling 그룹의 온디맨드 인스턴스를 사용하며, 비동기 배치 처리 서비스에는 스팟 인스턴스를 사용합니다.",
      "기준 용량 8대의 인스턴스에는 온디맨드 인스턴스(On-Demand Instances)를 사용하고, 프로모션 트래픽 급증에는 스팟 인스턴스(Spot Instances)를 사용하며, 비동기 배치 처리 서비스에는 Compute Savings Plans를 사용합니다.",
      "기준 용량 8대의 인스턴스에는 전용 호스트(Dedicated Hosts)를 사용하고, 프로모션 트래픽 급증에는 온디맨드 인스턴스를 사용하며, 비동기 배치 처리 서비스에는 예약 인스턴스(Reserved Instances)를 사용합니다.",
      "최대 33대의 웹 인스턴스 전체에 대해 3년 예약 인스턴스(Reserved Instances)를 구매하고, 비동기 배치 처리 서비스에는 스팟 인스턴스를 사용합니다."
    ],
    options_en: [
      "Purchase Compute Savings Plans or Reserved Instances for the 8 baseline instances, use On-Demand Instances in an Auto Scaling group for promotional traffic spikes, and use Spot Instances for the asynchronous batch processing service.",
      "Use On-Demand Instances for the 8 baseline instances, Spot Instances for the promotional traffic spikes, and Compute Savings Plans for the asynchronous batch processing service.",
      "Use Dedicated Hosts for the 8 baseline instances, On-Demand Instances for the promotional traffic spikes, and Reserved Instances for the asynchronous batch processing service.",
      "Purchase 3-year Reserved Instances for all maximum 33 web instances, and use Spot Instances for the asynchronous batch processing service."
    ],
    answer: 0,
    explanation_ko: "### 해설\n\n**정답: 3번 (인덱스 2)**\n\nAmazon EC2에서 가장 비용 효율적인 아키텍처를 구성하려면 워크로드의 특성과 패턴을 분석하여 각 구성 요소에 최적의 구매 옵션을 매핑해야 합니다:\n\n1. **연중 24/7 지속 실행되는 기준 용량(Baseline, 8대)**:\n   - 1년 내내 예측 가능하고 중단 없이 지속적으로 실행되는 워크로드는 1년 또는 3년 약정을 통해 온디맨드 대비 최대 72% 할인을 제공하는 **Compute Savings Plans**, **EC2 Instance Savings Plans** 또는 **예약 인스턴스(Reserved Instances, RI)**를 사용하는 것이 가장 경제적입니다.\n2. **예측할 수 없는 프로모션 트래픽 급증(최대 25대 추가)**:\n   - 프로모션 트래픽은 일시적이며 변동성이 큽니다. 또한 실시간 예약 트랜잭션은 중간에 끊겨서는 안 됩니다. **EC2 Auto Scaling 그룹의 온디맨드 인스턴스(On-Demand Instances)**를 사용하면 트래픽이 급증할 때만 동적으로 인스턴스를 확장하고 사용한 만큼만 초 단위로 지불하며, 스팟 인스턴스와 같은 강제 회수 위험 없이 안정적인 트랜잭션을 보장할 수 있습니다.\n3. **비동기 배치 처리 작업(무상태, 체크포인트 저장, 내결함성 지원)**:\n   - **스팟 인스턴스(Spot Instances)**는 온디맨드 대비 최대 90% 저렴합니다. 이 배치 작업은 무상태이고 수 분마다 체크포인트를 저장하여 중단을 허용하므로, 스팟 인스턴스를 활용하는 것이 최적의 비용 절감 방안입니다.\n\n---\n\n### 오답 분석:\n\n- **1번 (인덱스 0)**: 기준 용량에 온디맨드를 사용하면 약정 할인을 받지 못해 비용이 낭비됩니다. 또한 웹 예약 계층에 스팟 인스턴스를 사용하면 2분 전 회수 알림 후 인스턴스가 종료되어 사용자의 결제 및 예약 트랜잭션이 중단될 위험이 있습니다. 간헐적 배치 작업에 Savings Plans를 약정하면 작업이 없는 시간에도 비용이 청구됩니다.\n- **2번 (인덱스 1)**: 전용 호스트(Dedicated Hosts)는 규정 준수 요건이나 기존 소켓/코어 단위 소프트웨어 라이선스(BYOL) 반입을 위한 물리적 서버 격리용으로, 일반 웹 호스팅에 사용하기에는 지나치게 고비용입니다. 주기적인 배치 작업에 예약 인스턴스를 사용하는 것도 사용하지 않는 시간의 유휴 비용을 발생시킵니다.\n- **4번 (인덱스 3)**: 최대 피크 용량(33대) 전체에 대해 3년 예약 인스턴스를 구매하면 평상시 유휴 상태인 25대 인스턴스에 대해서도 3년 내내 지속적으로 비용을 지불하게 되므로 극심한 비용 낭비가 발생합니다.",
    explanation_en: "### Explanation\n\n**Correct Answer: Option 3 (Index 2)**\n\nTo achieve the most cost-effective architecture on Amazon EC2, you must evaluate the workload patterns and match each component to the optimal purchase option:\n\n1. **24/7 Steady-State Baseline (8 instances)**:\n   - Workloads with predictable, continuous 24/7 usage throughout the year benefit most from **Compute Savings Plans**, **EC2 Instance Savings Plans**, or **Reserved Instances (RIs)**, which offer discounts up to 72% compared to On-Demand pricing in exchange for a 1- or 3-year commitment.\n2. **Dynamic / Unpredictable Promotional Spikes (up to 25 additional instances)**:\n   - Promotional traffic is short-lived and unpredictable. Furthermore, customer booking transactions cannot tolerate interruptions. **On-Demand Instances** orchestrated by an **EC2 Auto Scaling group** are ideal because they launch dynamically only when demand spikes, pay per second with no upfront commitment, and do not risk termination like Spot Instances.\n3. **Asynchronous Batch Processing (stateless, checkpointed, fault-tolerant)**:\n   - **Spot Instances** provide up to a 90% discount compared to On-Demand pricing. Because this batch workload is stateless, implements regular checkpoints, and can tolerate unexpected interruptions, Spot Instances offer the highest cost savings with zero impact on data integrity.\n\n---\n\n### Why the Other Options Are Incorrect:\n\n- **Option 1 (Index 0)** is incorrect: Using On-Demand for baseline capacity fails to leverage 1- or 3-year commitment discounts. Using Spot Instances for the live booking tier is risky because Spot instances can be reclaimed with a 2-minute notice, which would disrupt user transactions. Committing to Savings Plans for intermittent batch jobs results in paying for unused capacity.\n- **Option 2 (Index 1)** is incorrect: Dedicated Hosts are designed for dedicated physical hardware tenancy, regulatory compliance, and server-bound software licenses (BYOL), making them unnecessarily expensive for standard web hosting. Purchasing Reserved Instances for periodic batch jobs commits to paying 24/7 for resources only used periodically.\n- **Option 4 (Index 3)** is incorrect: Committing to 3-year Reserved Instances for peak capacity (33 instances) wastes money because the 25 burst instances would sit idle and still be billed at the committed rate during normal traffic periods."
  },
  {
    id: "gen6",
    service_id: "ec2",
    conceptIds: ["ec2"],
    domain_id: "compute",
    difficulty: "Medium",
    question_ko: "한 모바일 게임 개발사가 플레이어 매치메이킹 및 순위표 동기화를 위한 무상태(stateless) 백엔드 API를 AWS에서 호스팅하고 있습니다. 이 애플리케이션은 Application Load Balancer 뒤에서 Auto Scaling 그룹에 의해 관리되는 Amazon EC2 인스턴스에서 실행됩니다. 과거 트래픽 분석 결과, 연중무휴 24시간 실행되는 최소 8개의 EC2 인스턴스로 구성된 예측 가능한 기준(baseline) 부하가 항상 필요합니다. 주말 커뮤니티 이벤트 및 저녁 피크 시간대에는 플레이어 활동이 급증하여 최대 16개의 추가 EC2 인스턴스가 필요합니다. 백엔드 아키텍처는 무상태이며 장애 복원력을 갖추고 있어, 피크 시간대의 인스턴스 중단이 발생하더라도 전체 플레이어 경험에 영향을 주지 않고 복구할 수 있습니다.\n\n가장 저렴한 비용(LOWEST operational cost)으로 용량 요구사항을 충족하기 위해 솔루션 아키텍트가 권장해야 하는 방안은 무엇입니까?",
    question_en: "A mobile game studio hosts a stateless backend API for player matchmaking and leaderboard synchronization on AWS. The application runs on Amazon EC2 instances managed by an Auto Scaling group behind an Application Load Balancer. Historical traffic analysis indicates that the platform requires a predictable baseline of 8 EC2 instances running 24/7 year-round. During weekend community events and evening peak hours, player activity surges, requiring up to an additional 16 EC2 instances. The backend architecture is stateless and resilient, capable of handling instance interruptions during peak spikes without impacting the overall player experience.\n\nWhich strategy should a solutions architect recommend to satisfy the capacity requirements with the LOWEST operational cost?",
    options_ko: [
      "기준 용량과 급증 용량 모두를 온디맨드 인스턴스로 배포하고, 피크 트래픽을 처리하기 위해 예약된 조정(scheduled scaling)과 연계된 동적 대상 추적 조정 정책을 구성합니다.",
      "기준 용량인 8개의 EC2 인스턴스를 처리하기 위해 Compute Savings Plans를 구매합니다. Auto Scaling 그룹에 혼합 인스턴스 정책(mixed instances policy)을 구성하여 기본 용량은 온디맨드 인스턴스로 충족하고 급증 용량은 스팟 인스턴스로 확장하도록 설정합니다.",
      "전체 인스턴스에 걸친 시간당 할인율을 극대화하기 위해 최대 용량인 24개 인스턴스 전부에 대해 3년 전액 선결제(All Upfront) EC2 예약 인스턴스(Reserved Instances)를 구매합니다.",
      "이웃 간섭(noisy neighbor) 문제를 방지하기 위해 전용 호스트(Dedicated Hosts)를 할당하여 기준 인스턴스 8개를 실행하고, 급증 용량에 대해서는 공유 테넌시의 스팟 인스턴스를 시작하도록 Auto Scaling 그룹을 구성합니다."
    ],
    options_en: [
      "Deploy the baseline and surge capacity using On-Demand Instances, and configure dynamic target tracking scaling policies combined with scheduled scaling to handle peak traffic.",
      "Purchase Compute Savings Plans to cover the baseline capacity of 8 EC2 instances. Configure the Auto Scaling group with a mixed instances policy to fulfill the base capacity with On-Demand Instances and the surge capacity with Spot Instances.",
      "Purchase 3-year All Upfront EC2 Reserved Instances for the maximum capacity of 24 instances to maximize the hourly discount rate across the entire fleet.",
      "Allocate Dedicated Hosts to run the baseline 8 instances to avoid noisy neighbor issues, and configure the Auto Scaling group to launch Spot Instances on shared tenancy for the surge capacity."
    ],
    answer: 1,
    explanation_ko: "- **기준 용량(24/7 항시 실행 워크로드)**: 연중무휴 24시간 실행되는 8개의 인스턴스는 예측 가능한 정상 상태(steady-state) 부하입니다. 이러한 지속적인 워크로드에는 온디맨드 대비 최대 72% 저렴한 **Savings Plans**(또는 예약 인스턴스)를 적용하는 것이 가장 비용 효율적입니다.\n- **급증 용량(무상태 및 장애 허용 워크로드)**: 주말 및 피크 시간대에 일시적으로 필요한 16개의 추가 인스턴스는 무상태(stateless)이며 인스턴스 중단을 견딜 수 있습니다. **스팟 인스턴스(Spot Instances)**는 온디맨드 대비 최대 90%의 비용 절감 효과가 있어 확장형 워크로드에 최적입니다.\n- **Auto Scaling 그룹 혼합 인스턴스 정책(Mixed Instances Policy)**: 기본 용량은 온디맨드 인스턴스(Savings Plans 할인 자동 적용)로 유지하고, 추가 확장되는 급증 용량은 스팟 인스턴스로 프로비저닝하도록 단일 ASG 내에서 혼합 인스턴스 정책을 구성할 수 있습니다.\n\n**오답 분석:**\n- *최대 24개 인스턴스 전부에 대해 3년 예약 인스턴스를 구매하는 방안*: 피크 시간대에만 필요한 16개 인스턴스에 대해서도 유휴 시간 동안 24시간 내내 비용을 지불해야 하므로 심각한 비용 낭비가 발생합니다.\n- *기준 용량과 급증 용량 모두 온디맨드 인스턴스를 사용하는 방안*: 기준 부하에 대한 Savings Plans 할인과 피크 부하에 대한 스팟 인스턴스 할인을 전혀 활용하지 않아 운영 비용이 높습니다.\n- *전용 호스트(Dedicated Hosts)를 할당하는 방안*: 전용 호스트는 규정 준수 요구사항이나 BYOL 라이선스 반입을 위한 물리적 서버 격리 옵션으로, 일반적인 비용 절감 목적에는 불필요하게 높은 비용이 발생합니다.",
    explanation_en: "- **Baseline Capacity (24/7 Steady-State)**: The 8 instances running continuously year-round represent predictable steady-state compute. **Savings Plans** (or Reserved Instances) provide up to 72% cost savings over On-Demand rates for steady-state workloads.\n- **Surge Capacity (Stateless & Fault-Tolerant)**: The 16 additional instances needed during peak hours and weekend events are temporary, stateless, and tolerant of interruptions. **Spot Instances** offer up to 90% savings over On-Demand pricing and are ideal for fault-tolerant, scalable workloads.\n- **Auto Scaling Group Mixed Instances Policy**: An Auto Scaling group with a mixed instances policy allows fulfilling base capacity with On-Demand Instances (which automatically benefit from the Savings Plans commitment) while scaling out additional capacity using Spot Instances.\n\n**Why other options are incorrect:**\n- *Purchasing 3-year Reserved Instances for all 24 instances*: Commits to paying for 16 peak instances 24/7 even when they are idle during non-peak hours, resulting in significant wasted expenditure.\n- *Using On-Demand Instances for both baseline and surge*: Incurs full On-Demand hourly prices without taking advantage of Savings Plans for baseline traffic or Spot discounts for transient peak traffic.\n- *Allocating Dedicated Hosts for baseline capacity*: Dedicated Hosts are designed for compliance, regulatory tenancy, and socket/core-based BYOL software licensing, making them unnecessarily expensive for general cost optimization."
  },
  {
    id: "gen7",
    service_id: "ec2",
    conceptIds: ["ec2"],
    domain_id: "compute",
    difficulty: "Medium",
    question_ko: "한 대학교에서 AWS 기반의 온라인 학습 관리 시스템(LMS)과 강의 동영상 스트리밍 플랫폼을 운영하고 있습니다. 이 플랫폼은 크게 두 가지 컴퓨팅 워크로드로 구성되어 있습니다:\n\n- 강의 계획서, 과제 제출, 토론 게시판을 제공하는 상태 비저장(stateless) 웹 티어: 학년도 내내 연중무휴(24/7)로 실행되는 일정한 최소 기준 용량(baseline capacity)이 필요하며, 수강 신청 기간과 기말고사 주간에는 예측 불가능한 대규모 트래픽 급증이 발생합니다.\n- 고화질 강의 녹화본을 다양한 비트레이트로 트랜스코딩하는 야간 배치 작업: 이 트랜스코딩 워크로드는 상태 비저장이며 내결함성을 갖추고 있어 작업이 중단되더라도 데이터 손실 없이 안전하게 재개할 수 있습니다.\n\n솔루션스 아키텍트는 성능 및 가용성 요구사항을 모두 충족하면서 운영 비용을 최소화할 수 있는 Amazon EC2 구매 전략을 설계해야 합니다.\n\n솔루션스 아키텍트가 추천해야 하는 가장 비용 효율적인 EC2 구매 옵션 조합은 무엇입니까?",
    question_en: "A university is hosting its online learning management system (LMS) and video streaming platform on AWS. The platform's architecture consists of two primary compute workloads:\n\n- A stateless web tier that serves course syllabi, assignments, and discussion boards. The web tier requires a minimum baseline capacity running 24/7 throughout the academic year, but experiences sudden, unpredictable surges in traffic during course registration periods and final exam weeks.\n- A nightly batch processing job that transcodes high-definition lecture recordings into multiple bitrates. The transcoding process is stateless, fault-tolerant, and can be safely interrupted and resumed without data loss.\n\nA solutions architect must design an Amazon EC2 compute purchasing strategy that minimizes operational costs while meeting all performance and availability requirements.\n\nWhich combination of EC2 purchasing options should the solutions architect recommend?",
    options_ko: [
      "성능을 보장하기 위해 기준 웹 티어에 전용 인스턴스(Dedicated Instances)를 프로비저닝합니다. 피크 웹 트래픽에는 온디맨드 인스턴스 기반의 Auto Scaling 그룹을 구성하고, 야간 강의 트랜스코딩 워크로드에는 EC2 용량 예약(Capacity Reservations)이 적용된 온디맨드 인스턴스를 사용합니다.",
      "기준 용량과 피크 시 웹 티어 용량 모두에 대해 Compute Savings Plans를 구매합니다. 야간 강의 트랜스코딩 워크로드에는 Auto Scaling 그룹을 통해 시작되는 스팟 인스턴스(Spot Instances)를 사용합니다.",
      "기준 웹 티어 용량에는 EC2 온디맨드 인스턴스(On-Demand Instances)를 사용합니다. 수강 신청 및 시험 주간의 예측 불가능한 트래픽 급증에는 스팟 인스턴스를 사용합니다. 야간 강의 트랜스코딩 워크로드에는 EC2 예약 인스턴스(Reserved Instances)를 사용합니다.",
      "기준 웹 티어 용량에 대해 Compute Savings Plans를 구매합니다. 수강 신청 및 시험 주간의 트래픽 급증을 처리하기 위해 온디맨드 인스턴스로 구성된 Auto Scaling 그룹을 구성합니다. 야간 강의 트랜스코딩 워크로드에는 스팟 인스턴스를 사용합니다."
    ],
    options_en: [
      "Provision Dedicated Instances for the baseline web tier to ensure maximum performance. Configure an Auto Scaling group with On-Demand Instances for peak web traffic. Use On-Demand Instances with EC2 Capacity Reservations for the nightly lecture transcoding workload.",
      "Purchase Compute Savings Plans for both the baseline and peak web tier capacity. Use Spot Instances launched via an Auto Scaling group for the nightly lecture transcoding workload.",
      "Use EC2 On-Demand Instances for the baseline web tier capacity. Use Spot Instances for the unpredictable traffic spikes during registration and exam weeks. Use EC2 Reserved Instances for the nightly lecture transcoding workload.",
      "Purchase Compute Savings Plans for the baseline web tier capacity. Configure an Auto Scaling group with On-Demand Instances to handle traffic surges during registration and exam weeks. Use Spot Instances for the nightly lecture transcoding workload."
    ],
    answer: 3,
    explanation_ko: "**정답: 세 번째 보기 (인덱스 2)**\n\n- **기준 웹 티어에 대한 Compute Savings Plans**: 웹 티어는 학년도 내내 24/7 상시 실행되는 예측 가능한 최소 기준 용량(Baseline)을 필요로 합니다. 1년 또는 3년 약정의 Compute Savings Plans(또는 EC2 Instance Savings Plans)를 적용하면 온디맨드 대비 최대 66~72%의 비용을 절감할 수 있어 가장 경제적입니다.\n- **피크 트래픽을 위한 온디맨드 기반 Auto Scaling**: 수강 신청 및 기말고사 기간의 트래픽은 단기적이며 급격하고 예측하기 어렵습니다. 중요한 학사 일정 중 인스턴스 중단 위험 없이 탄력적으로 대응하기 위해 장기 약정이 필요 없는 온디맨드 인스턴스(On-Demand Instances) 기반의 Auto Scaling 그룹을 사용하는 것이 적합합니다.\n- **야간 동영상 트랜스코딩을 위한 스팟 인스턴스(Spot Instances)**: 강의 녹화본 트랜스코딩 작업은 상태 비저장(Stateless)이고 내결함성(Fault-tolerant)을 갖추고 있어 중단 및 재개가 가능합니다. 온디맨드 대비 최대 90% 저렴한 스팟 인스턴스를 활용하는 것이 배치 처리에 가장 비용 효율적입니다.\n\n---\n\n**오답 분석:**\n\n- **첫 번째 보기 (인덱스 0)**: 피크 시의 급증 용량까지 모두 포함하여 Savings Plans를 약정하면, 트래픽이 적은 평상시에도 피크 수준의 시간당 약정 요금을 계속 지불해야 하므로 비용 낭비가 발생합니다.\n- **두 번째 보기 (인덱스 1)**: 연중무휴 상시 가동되는 기준 용량에 온디맨드를 사용하면 약정 할인 혜택을 받지 못합니다. 또한 수강 신청 및 시험 주간과 같은 중요 웹 서비스에 스팟 인스턴스를 사용할 경우 인스턴스 회수(Reclaim)로 인한 서비스 장애 위험이 있으며, 야간에만 일시적으로 도는 작업에 예약 인스턴스를 구매하는 것은 비효율적입니다.\n- **네 번째 보기 (인덱스 3)**: 전용 인스턴스(Dedicated Instances)는 하드웨어 격리나 특정 규제/라이선스 준수가 필요한 경우에 사용되며 불필요하게 높은 비용이 발생합니다. 또한 중단 가능한 야간 배치 작업에 EC2 용량 예약(Capacity Reservations)과 온디맨드를 결합하는 것은 스팟 인스턴스의 비용 절감 효과를 완전히 무시한 과도한 아키텍처입니다.",
    explanation_en: "**Correct Answer: Option 3 (Index 2)**\n\n- **Compute Savings Plans for Baseline Web Tier**: The web tier requires a steady, predictable minimum capacity running 24/7 throughout the academic year. Compute Savings Plans (or EC2 Instance Savings Plans) provide up to 66%–72% discounts on predictable, steady-state compute usage in exchange for a 1- or 3-year commitment.\n- **On-Demand Instances with Auto Scaling for Peak Surges**: Traffic during course registration and final exam weeks is sudden, short-lived, and unpredictable. Using Auto Scaling with On-Demand Instances provides high availability and elasticity without requiring long-term financial commitments or risking capacity reclaim interruptions during critical academic events.\n- **Spot Instances for Nightly Video Transcoding**: The lecture transcoding workload is stateless, fault-tolerant, and capable of being paused/resumed without data loss. Spot Instances provide up to a 90% discount compared to On-Demand prices, making them the most cost-effective choice for interruptible batch processing workloads.\n\n---\n\n**Incorrect Options Analysis:**\n\n- **Option 1 (Index 0)**: Purchasing Compute Savings Plans sized to cover both baseline and peak burst traffic is financially inefficient because the university would be committed to paying for peak-level hourly capacity even during low-traffic off-peak periods.\n- **Option 2 (Index 1)**: Using On-Demand Instances for steady 24/7 baseline capacity misses out on significant long-term commitment discounts. Furthermore, using Spot Instances for mission-critical web traffic during registration and exam periods exposes the university to service disruptions due to Spot capacity reclaims. Purchasing Reserved Instances for an intermittent nightly batch workload is also wasteful.\n- **Option 4 (Index 3)**: Dedicated Instances are meant for meeting strict compliance, regulatory, or licensing requirements (tenancy isolation) and carry a significant price premium. Using On-Demand Capacity Reservations for an interruptible, non-critical nightly batch workload is unnecessarily expensive and ignores the massive cost savings offered by Spot Instances."
  },
  {
    id: "gen8",
    service_id: "ec2",
    conceptIds: ["ec2"],
    domain_id: "compute",
    difficulty: "Medium",
    question_ko: "한 글로벌 물류 기업이 배송 차량 텔레매틱스 및 화물 추적 플랫폼의 컴퓨팅 비용을 최적화하기 위해 AWS 기반 인프라를 재설계하고 있습니다. 해당 아키텍처는 다음과 같은 세 가지 워크로드로 구성되어 있습니다.\n\n1. 여러 가용 영역(AZ)에 걸쳐 Application Load Balancer(ALB) 뒤에서 24/7 지속적으로 실행되며 예측 가능한 기준 부하(baseline)를 처리하는 6대의 EC2 인스턴스로 구성된 핵심 텔레매틱스 수신 플릿\n2. 업무 피크 시간대에 예측할 수 없는 트래픽 급증을 겪으며, 서비스 중단이나 인스턴스 종료를 허용할 수 없는 고객 화물 추적 웹 포털용 Auto Scaling 그룹\n3. 대기열에 쌓인 GPS 텔레매틱스 데이터를 기반으로 최적의 배송 경로를 계산하는 야간 배치 분석 작업 (이 작업은 무상태(stateless) 및 내결함성을 갖추고 있어 중단 후 재개되어도 데이터 손실이 없으며, 매일 밤 3~4시간 동안 실행됨)\n\n이러한 운영 요구 사항을 충족하면서 가장 비용 효율적인(MOST cost-effective) EC2 구매 옵션 조합은 무엇입니까?",
    question_en: "A global logistics company is redesigning its cloud infrastructure on AWS to optimize compute costs for its fleet telematics and shipment tracking platform. The architecture consists of three distinct workloads:\n\n1. A core telematics ingestion fleet that runs 24/7 with a predictable baseline load of 6 EC2 instances behind an Application Load Balancer (ALB) across multiple Availability Zones.\n2. An Auto Scaling group for the customer tracking web portal that experiences sudden, unpredictable traffic spikes during peak business hours and cannot tolerate downtime or interruptions.\n3. An overnight batch analytics job that calculates optimal delivery routes from queued GPS telemetry data. This batch job is stateless, fault-tolerant, can be interrupted and resumed without data loss, and runs for 3 to 4 hours each night.\n\nWhich combination of EC2 purchasing options will meet these operational requirements MOST cost-effectively?",
    options_ko: [
      "텔레매틱스 수신 플릿에는 전용 호스트(Dedicated Hosts)를 사용하고, 고객 웹 포털에는 스팟 인스턴스(Spot Instances)를 사용하며, 야간 배치 분석 작업에는 Compute Savings Plans를 적용합니다.",
      "텔레매틱스 수신 플릿에는 스팟 인스턴스(Spot Instances)를 사용하고, 고객 웹 포털의 확장에는 온디맨드 인스턴스(On-Demand Instances)를 사용하며, 야간 배치 분석 작업에는 전용 인스턴스(Dedicated Instances)를 사용합니다.",
      "텔레매틱스 수신 플릿에는 EC2 Savings Plans 또는 예약 인스턴스(Reserved Instances)를 구매하고, 고객 웹 포털의 확장에는 온디맨드 인스턴스(On-Demand Instances)를 사용하며, 야간 배치 분석 작업에는 스팟 인스턴스(Spot Instances)를 사용합니다.",
      "텔레매틱스 수신 플릿에는 온디맨드 인스턴스(On-Demand Instances)를 사용하고, 고객 웹 포털에는 예약 인스턴스(Reserved Instances)를 사용하며, 야간 배치 분석 작업에는 온디맨드 인스턴스를 사용합니다."
    ],
    options_en: [
      "Use Dedicated Hosts for the telematics ingestion fleet, Spot Instances for the customer web portal, and Compute Savings Plans for the overnight batch analytics job.",
      "Purchase Spot Instances for the telematics ingestion fleet, On-Demand Instances for the customer web portal scaling, and Dedicated Instances for the overnight batch analytics job.",
      "Purchase EC2 Savings Plans or Reserved Instances for the telematics ingestion fleet, use On-Demand Instances for the customer web portal scaling, and use Spot Instances for the overnight batch analytics job.",
      "Use On-Demand Instances for the telematics ingestion fleet, Reserved Instances for the customer web portal, and On-Demand Instances for the overnight batch analytics job."
    ],
    answer: 2,
    explanation_ko: "**정답: 3번 (인덱스 2)**\n\n운영 및 가용성 요구사항을 모두 만족하면서 컴퓨팅 비용을 최적화하기 위해서는 각 워크로드의 특성에 맞는 EC2 구매 옵션을 조합해야 합니다.\n\n1. **24/7 정상 상태 기준 부하 (텔레매틱스 수신 플릿)**:\n   - 연중무휴(24/7)로 예측 가능한 기본 컴퓨팅 용량이 지속적으로 필요합니다.\n   - 1년 또는 3년 약정을 통해 온디맨드 대비 최대 72% 할인을 제공하는 **EC2 Savings Plans** 또는 **예약 인스턴스(Reserved Instances)**를 사용하는 것이 가장 적합합니다.\n\n2. **예측 불가능한 스파이크 트래픽 (고객 웹 포털 확장)**:\n   - 피크 시간대에 급증하며 서비스 중단이나 강제 종료를 허용할 수 없는 애플리케이션 계층입니다.\n   - 약정 부담 없이 필요할 때 즉시 프로비저닝하고 제거할 수 있는 **온디맨드 인스턴스(On-Demand Instances)**를 Auto Scaling 그룹의 스케일 아웃 용도로 사용하는 것이 적합합니다.\n\n3. **무상태 내결함성 배치 작업 (야간 경로 분석)**:\n   - 매일 밤 3~4시간 동안만 실행되며, 무상태(stateless)이고 중단 후 재개되어도 문제가 없는 대기열 기반 워크로드입니다.\n   - 온디맨드 대비 최대 90% 저렴한 **스팟 인스턴스(Spot Instances)**를 사용하는 것이 가장 비용 효율적입니다.\n\n---\n**오답 분석:**\n- **1번 선택지**: 전용 호스트(Dedicated Hosts)는 물리적 서버 격리 및 소켓/코어 단위 기존 라이선스(BYOL) 준수가 필요한 경우에 사용하며 비용이 매우 높습니다. 또한 중단을 허용하지 않는 고객 웹 포털에 스팟 인스턴스를 적용하는 것은 부적절합니다.\n- **2번 선택지**: 24/7 기본 플릿과 배치 작업에 온디맨드 인스턴스를 사용하는 것은 비용 최적화 원칙에 어긋납니다. 또한 일시적인 피크 트래픽을 위해 예약 인스턴스를 구매하면 피크 이후 유휴 자원에 대한 비용 낭비가 발생합니다.\n- **4번 선택지**: 24/7 핵심 수신 플릿에 스팟 인스턴스를 사용하면 인스턴스 회수(interruption)로 인한 서비스 장애 위험이 발생합니다. 전용 인스턴스(Dedicated Instances) 역시 규정 준수 요건이 없는 배치 작업에 불필요하게 높은 비용을 발생시킵니다.",
    explanation_en: "**Correct Answer: Option 3 (Index 2)**\n\nTo achieve the lowest cost while meeting operational and availability requirements, AWS recommends matching workload characteristics with appropriate EC2 purchasing models:\n\n1. **Steady-State Baseline (Telematics Fleet)**: \n   - Runs 24/7 with predictable compute demand across multiple AZs. \n   - **Savings Plans** (or **Standard/Convertible Reserved Instances**) provide up to 72% discounts compared to On-Demand pricing in exchange for a 1-year or 3-year commitment.\n\n2. **Spiky / Unpredictable Scaling (Customer Web Portal)**: \n   - Experiences sudden traffic spikes during peak hours and cannot tolerate downtime or sudden instance terminations. \n   - **On-Demand Instances** provide elasticity and immediate scaling without long-term commitments or the risk of spot interruption notices.\n\n3. **Fault-Tolerant, Stateless Batch Workload (Overnight Route Analytics)**: \n   - Runs for 3–4 hours, is stateless, handles interruptions gracefully, and processes queue-based data. \n   - **Spot Instances** offer the steepest discount (up to 90% off On-Demand) and are the industry best practice for fault-tolerant, asynchronous batch processing.\n\n---\n**Why the other options are incorrect:**\n- **Option 1**: Dedicated Hosts are designed for hardware-level physical tenancy (often required for BYOL socket/core licensing or strict regulatory compliance) and carry significant premium costs. Spot instances should not be used for production web tiers that cannot tolerate interruptions. Compute Savings Plans for short batch jobs underutilize the 24/7 commitment model.\n- **Option 2**: Using On-Demand for 24/7 baseline capacity and batch jobs results in high, unoptimized compute costs. Purchasing Reserved Instances for spiky, intermittent traffic leads to paid, idle capacity when peak hours end.\n- **Option 4**: Spot Instances for the 24/7 core telematics fleet introduce unacceptable risk of service interruption. Dedicated Instances are costly and unnecessary given the absence of compliance/tenancy constraints."
  },
  {
    id: "gen9",
    service_id: "s3",
    conceptIds: ["s3"],
    domain_id: "storage",
    difficulty: "Medium",
    question_ko: "디지털 병리 진단 스타트업인 CuraPath Diagnostics는 전 세계 협력 병원 및 연구소에서 생성되는 고해상도 병리 조직 슬라이드 스캔 데이터를 저장하고 처리하기 위해 us-east-1 리전에 중앙 클라우드 플랫폼을 구축하고 있습니다. 전 세계 각지의 클라이언트들은 15GB에서 40GB 크기의 대용량 의료 이미지 파일을 Amazon S3 버킷으로 직접 업로드해야 합니다.\n\n그러나 장거리 네트워크 지연과 불안정한 인터넷 연결로 인해 업로드 속도가 저하되고 전송 도중 연결이 끊어지는 문제가 자주 발생하고 있습니다. 또한 중단된 업로드 데이터의 조각들이 버킷에 남아 예상치 못한 스토리지 비용을 발생시키고 있습니다. 아울러 각 이미지 업로드가 완료되는 즉시 상시 실행 서버 없이 환자 개인 건강 정보(PHI)를 비식별화하는 자동화 처리가 즉각 수행되어야 합니다.\n\n최소한의 운영 오버헤드로 이러한 요구 사항을 충족하기 위해 솔루션 아키텍트가 제안해야 하는 조치 조합은 무엇입니까?",
    question_en: "A healthcare technology startup, CuraPath Diagnostics, is building a centralized cloud platform in the us-east-1 Region to store and process digital pathology scans. Partner clinics and research laboratories distributed worldwide need to upload high-resolution whole-slide medical images ranging in size from 15 GB to 40 GB directly to an Amazon S3 bucket.\n\nDue to long-distance internet latency and unstable connections, clinics frequently experience slow transfer speeds and broken uploads midway through transmission. Unfinished upload attempts are remaining in the bucket and incurring unexpected storage costs. Additionally, as soon as each image upload completes, an automated workflow must immediately run to anonymize patient health information (PHI) without managing persistent server infrastructure.\n\nWhich combination of steps should a solutions architect recommend to satisfy these requirements with the LEAST operational overhead?",
    options_ko: [
      "S3 버킷에서 Amazon S3 Transfer Acceleration을 활성화합니다. 병원이 S3 멀티파트 업로드(Multipart Upload)를 사용하여 파일을 업로드하도록 안내합니다. 미완료된 멀티파트 업로드를 중단(abort)하는 S3 수명 주기 규칙을 구성하고, 객체 생성 이벤트 발생 시 AWS Lambda 함수를 호출하도록 S3 이벤트 알림을 구성합니다.",
      "여러 AWS 리전에 Application Load Balancer와 Amazon EC2 인스턴스의 Auto Scaling 그룹을 배포하여 들어오는 업로드를 버퍼링합니다. 파일을 Amazon Elastic File System(Amazon EFS)에 임시 저장한 후 AWS DataSync를 사용하여 S3 버킷으로 전송합니다. 7일 후 만료된 객체 버전을 삭제하도록 S3 수명 주기 규칙을 구성합니다.",
      "Origin Access Control(OAC)을 적용하여 S3 버킷 앞에 Amazon CloudFront를 배포합니다. 병원이 표준 단일 파트 PUT 요청을 사용하여 이미지를 업로드하도록 안내합니다. 업로드 트래픽이 감지되면 AWS Lambda 함수를 트리거하도록 Amazon CloudWatch 경보를 구성하고, S3 수명 주기 규칙을 사용하여 객체를 S3 Glacier Instant Retrieval로 전환합니다.",
      "S3 버킷에서 Amazon S3 Transfer Acceleration을 활성화합니다. 병원이 표준 단일 파트 PUT 요청을 수행하도록 안내합니다. 10분마다 S3 버킷을 스캔하여 AWS Lambda 함수를 호출하는 Amazon EventBridge 예약 규칙을 생성하고, 실패한 업로드로 인해 스토리지 비용이 발생하는 것을 방지하도록 S3 Object Lock을 구성합니다."
    ],
    options_en: [
      "Enable Amazon S3 Transfer Acceleration on the bucket. Instruct the clinics to use S3 multipart upload for their files. Configure an S3 Lifecycle rule to abort incomplete multipart uploads, and configure an S3 Event Notification to invoke an AWS Lambda function on object creation events.",
      "Set up an Application Load Balancer and an Auto Scaling group of Amazon EC2 instances in multiple AWS Regions to buffer incoming uploads. Store the files temporarily on Amazon Elastic File System (Amazon EFS), then transfer them to the S3 bucket using AWS DataSync. Configure an S3 Lifecycle rule to delete expired object versions after 7 days.",
      "Deploy Amazon CloudFront in front of the S3 bucket with Origin Access Control (OAC). Instruct clinics to upload images using standard single-part PUT requests. Configure an Amazon CloudWatch alarm to trigger an AWS Lambda function when upload traffic is detected, and use an S3 Lifecycle rule to transition objects to S3 Glacier Instant Retrieval.",
      "Enable Amazon S3 Transfer Acceleration on the bucket. Instruct the clinics to perform standard single-part PUT requests. Create an Amazon EventBridge scheduled rule that scans the S3 bucket every 10 minutes to invoke an AWS Lambda function, and configure S3 Object Lock to prevent failed uploads from accruing storage fees."
    ],
    answer: 0,
    explanation_ko: "- **Amazon S3 Transfer Acceleration**: 전 세계에 분산된 CloudFront 엣지 로케이션을 활용하여 클라이언트 업로드 트래픽을 최적화된 AWS 글로벌 네트워크 백본으로 라우팅함으로써, 글로벌 원거리 사용자가 us-east-1 리전의 중앙 S3 버킷으로 데이터를 업로드할 때 전송 속도를 크게 높여줍니다.\n- **S3 멀티파트 업로드 (Multipart Upload)**: Amazon S3에서 단일 PUT 작업의 최대 허용 크기는 5GB입니다. 본 시나리오의 의료 이미지는 15GB~40GB이므로 멀티파트 업로드가 필수적입니다. 또한 대용량 파일을 여러 파트로 나누어 병렬 업로드하므로 전송 속도가 빠르고, 네트워크 순단 시 전체 파일이 아닌 실패한 파트만 재전송하므로 불안정한 네트워크 환경에 최적입니다.\n- **미완료 멀티파트 업로드 중단 수명 주기 규칙 (Abort Incomplete Multipart Uploads)**: 멀티파트 업로드가 완료되지 못하고 중단되면 업로드된 파트들이 버킷에 남아 계속 스토리지 비용을 발생시킵니다. S3 수명 주기 규칙을 통해 미완료 멀티파트 업로드를 일정 기간 후 자동으로 중단 및 삭제하도록 설정하여 불필요한 비용 누수를 방지할 수 있습니다.\n- **S3 이벤트 알림 + AWS Lambda**: `s3:ObjectCreated:*` 이벤트에 대해 AWS Lambda를 호출하도록 설정하면 EC2 인스턴스 등의 상시 인프라 관리 없이도 객체 업로드 즉시 PHI 비식별화 처리를 서버리스 환경에서 즉각 수행할 수 있습니다.\n\n오답 분석:\n- **A 보기**: 단일 파트 PUT 요청은 최대 5GB까지만 지원하므로 15GB~40GB 크기의 이미지를 업로드할 수 없습니다. CloudWatch 경보 기반 처리는 개별 객체 단위의 즉각적인 이벤트 처리에 적합하지 않습니다.\n- **B 보기**: 리전별 ALB, EC2, EFS, DataSync를 구성하는 것은 과도한 아키텍처 복잡도와 높은 운영 오버헤드를 발생시킵니다. 또한 만료된 객체 버전 삭제 규칙은 미완료 멀티파트 업로드 파트를 삭제하지 못합니다.\n- **D 보기**: 5GB를 초과하는 객체는 단일 파트 PUT으로 업로드할 수 없습니다. EventBridge 예약 폴링 방식은 불필요한 지연 시간과 S3 API 비용을 유발하며, S3 Object Lock은 규정 준수용 객체 잠금 기능으로 미완료 업로드 비용 방지와 무관합니다.",
    explanation_en: "- **Amazon S3 Transfer Acceleration**: Leverages Amazon CloudFront's globally distributed edge locations to route data over the optimized AWS private network backbone, dramatically reducing latency and improving upload speeds for geographically dispersed clients worldwide uploading to a centralized bucket in `us-east-1`.\n- **S3 Multipart Upload**: Amazon S3 imposes a strict 5 GB maximum limit for a single PUT operation. Because the pathology scans range from 15 GB to 40 GB, Multipart Upload is mandatory. Additionally, Multipart Upload uploads parts in parallel to maximize throughput and improves resiliency on unstable connections because only failed individual parts need to be retried rather than restarting the entire 40 GB upload.\n- **S3 Lifecycle Rule (Abort Incomplete Multipart Uploads)**: When multipart uploads are interrupted or fail midway, orphaned parts linger in the S3 bucket and incur continuous standard storage fees until aborted. A lifecycle rule automatically deletes these incomplete parts after a specified retention window (e.g., 7 days), eliminating hidden costs.\n- **S3 Event Notifications with AWS Lambda**: Configuring an S3 Event Notification on `s3:ObjectCreated:*` to trigger AWS Lambda creates a fully serverless, event-driven processing pipeline that starts PHI anonymization immediately upon file completion with zero server management overhead.\n\nWhy the other options are incorrect:\n- **Option A**: Single-part PUT operations cannot upload objects larger than 5 GB. CloudFront is primarily optimized for downloads/caching, and CloudWatch alarms cannot directly trigger per-object processing workflows.\n- **Option B**: Deploying regional ALBs, EC2 fleets, EFS, and DataSync introduces immense operational and maintenance overhead. Furthermore, deleting expired object versions does not clean up incomplete multipart upload parts.\n- **Option D**: Single-part PUT operations fail for files exceeding 5 GB. Polling S3 via scheduled EventBridge rules introduces unnecessary latency, extra API costs, and operational complexity compared to direct S3 Event Notifications. S3 Object Lock is a WORM compliance feature and does not resolve incomplete multipart upload charges."
  },
  {
    id: "gen10",
    service_id: "s3",
    conceptIds: ["s3"],
    domain_id: "storage",
    difficulty: "Medium",
    question_ko: "지역 항공사인 AeroKestrel Airlines는 us-west-2 리전의 Amazon S3 버킷을 기반으로 중앙 집중식 항공기 운항 관리 플랫폼을 운영하고 있습니다. 외딴 섬 지역 공항에 배치된 항공 정비사들은 항공기 출발 전 15GB~30GB 크기의 고화질 기체 외부 점검 영상을 정기적으로 업로드합니다. 그러나 원격지의 높은 네트워크 지연 시간과 불안정한 공용 인터넷 연결로 인해 업로드 시간이 지나치게 오래 걸리고, 잦은 연결 끊김으로 인해 전체 업로드를 처음부터 다시 시작해야 하는 문제가 발생하고 있습니다. 또한 완료되지 않고 중단된 업로드 조각들이 버킷 내에 보이지 않게 누적되면서 불필요한 스토리지 요금이 지속적으로 증가하고 있습니다.\n\n최소한의 운영 오버헤드로 업로드 속도를 개선하고, 전송 복원력을 높이며, 완료되지 않은 업로드로 인한 스토리지 비용을 자동으로 제거하기 위해 솔루션 아키텍트가 권장해야 하는 방안은 무엇입니까?",
    question_en: "A regional carrier, AeroKestrel Airlines, maintains a centralized fleet operations platform with an Amazon S3 bucket in the us-west-2 Region. Aircraft technicians stationed at remote island airports frequently upload 15 GB to 30 GB high-definition exterior inspection videos before departures. Due to high network latency and unstable public internet connections at these remote locations, uploads take a very long time, and frequent connection drops force technicians to restart entire uploads from the beginning. Furthermore, the finance team has identified escalating storage charges caused by abandoned, partial upload fragments accumulating invisibly inside the bucket.\n\nWhich solution should a solutions architect recommend to speed up uploads, improve transfer resilience, and eliminate storage costs from unfinished uploads with the LEAST operational overhead?",
    options_ko: [
      "각 원격 공항에 AWS Site-to-Site VPN 연결을 구축하고 표준 단일 파트 Amazon S3 PUT 작업을 사용하도록 구성합니다. S3 Object Lambda 액세스 포인트를 설정하여 손상되거나 불완전한 업로드 스트림을 실시간으로 필터링하고 폐기합니다.",
      "AWS Global Accelerator와 Application Load Balancer를 구성하여 업로드 트래픽을 Amazon EC2 플릿으로 라우팅하고, 비디오를 Amazon EFS 파일 시스템에 저장합니다. AWS Backup 수명 주기 규칙을 사용하여 미완료 임시 파일을 만료시킵니다.",
      "대상 버킷에서 Amazon S3 Transfer Acceleration을 활성화하고 클라이언트 업로드 애플리케이션에서 Amazon S3 멀티파트 업로드(Multipart Upload)를 구현합니다. 지정된 일수 이후 완료되지 않은 멀티파트 업로드를 중단(abort)하도록 S3 수명 주기(Lifecycle) 규칙을 생성합니다.",
      "S3 버킷 앞에 Amazon CloudFront 배포를 구성하여 엣지 로케이션에서 수신 업로드 페이로드를 캐싱합니다. Amazon EventBridge로 매주 실행되는 AWS Lambda 함수를 생성하여 완료되지 않은 업로드 객체를 검색하고 삭제합니다."
    ],
    options_en: [
      "Configure standard single-part Amazon S3 PUT operations routed through an AWS Site-to-Site VPN connection established at each remote airport. Set up an S3 Object Lambda Access Point to filter and drop corrupted or partial upload streams in real time.",
      "Provision an Application Load Balancer with AWS Global Accelerator to route upload traffic to an Amazon EC2 fleet, which saves videos to an Amazon EFS file system. Use an AWS Backup lifecycle rule to expire unfinished temporary files.",
      "Enable Amazon S3 Transfer Acceleration on the destination bucket and implement Amazon S3 Multipart Upload in the client upload application. Create an S3 Lifecycle rule configured to abort incomplete multipart uploads after a specified number of days.",
      "Deploy an Amazon CloudFront distribution in front of the S3 bucket to cache incoming upload payloads at edge locations. Create an AWS Lambda function triggered by Amazon EventBridge on a weekly schedule to identify and purge uncompleted upload objects."
    ],
    answer: 2,
    explanation_ko: "**정답: 3번째 선택지 (인덱스 2)**\n\n**정답 해설:**\n1. **Amazon S3 Transfer Acceleration**: 전 세계에 분산된 Amazon CloudFront의 엣지 로케이션을 활용하여 클라이언트의 업로드 트래픽을 AWS의 최적화된 전용 글로벌 프라이빗 네트워크로 라우팅합니다. 이를 통해 지리적으로 멀리 떨어진 외딴 섬 지역에서 중앙 S3 버킷으로 업로드할 때 발생하는 인터넷 지연 시간과 패킷 손실을 획기적으로 줄여줍니다.\n2. **Amazon S3 멀티파트 업로드(Multipart Upload)**: 100MB 이상의 객체에 권장되며, 5GB를 초과하는 객체에는 필수적으로 사용해야 합니다(표준 단일 PUT 요청은 최대 5GB로 제한되므로 15GB~30GB 영상은 단일 PUT으로 업로드가 불가능함). 대용량 파일을 여러 파트로 분할하여 병렬로 업로드하므로, 불안정한 네트워크로 인해 연결이 끊기더라도 전체 파일이 아닌 실패한 파트만 재전송하여 복원력과 업로드 속도를 극대화할 수 있습니다.\n3. **S3 수명 주기 규칙(미완료 멀티파트 업로드 중단)**: 완료되지 못한 멀티파트 업로드 조각들은 버킷 내에 보이지 않게 남아 표준 S3 스토리지 요금으로 계속 과금됩니다. 네이티브 S3 수명 주기 규칙의 `AbortIncompleteMultipartUpload` 설정을 추가하면 추가 코드나 서버 관리 없이 지정된 일수(예: 7일) 후 불완전한 조각들을 자동으로 영구 삭제하여 비용을 최적화할 수 있습니다.\n\n**오답 해설:**\n- **1번째 선택지**: CloudFront 배포는 기본적으로 다운로드 캐싱 및 콘텐츠 전송 가속에 특화되어 있으며, S3 직접 업로드 가속에는 S3 Transfer Acceleration이 적합합니다. 또한 Lambda와 EventBridge를 이용한 수동 삭제는 기본 제공되는 S3 수명 주기 규칙에 비해 불필요한 개발 및 운영 오버헤드를 발생시킵니다.\n- **2번째 선택지**: ALB, Global Accelerator, EC2 플릿, Amazon EFS를 구축하는 방식은 S3의 네이티브 기능을 활용하는 것에 비해 아키텍처가 지나치게 복잡하고 컴퓨팅/스토리지 비용과 운영 부담이 크게 증가하는 비효율적인 접근법입니다.\n- **4번째 선택지**: 단일 파트 S3 PUT 요청은 최대 5GB까지만 업로드할 수 있으므로 15GB~30GB 크기의 비디오 파일을 업로드할 수 없습니다. 또한 모든 외딴 공항마다 Site-to-Site VPN을 구성하는 것은 높은 네트워크 비용과 관리 오버헤드를 초래하며, S3 Object Lambda는 GET 요청 시 데이터를 가공하는 용도로 사용되므로 업로드 분할 조각 관리와 무관합니다.",
    explanation_en: "**Correct Answer: 3rd Option (Index 2)**\n\n**Why it is correct:**\n1. **Amazon S3 Transfer Acceleration**: Uses Amazon CloudFront's globally distributed edge locations to route client upload traffic over the optimized AWS private network backbone. This significantly reduces internet latency and packet loss for technicians uploading from geographically distant, remote island locations to a centralized S3 bucket.\n2. **Amazon S3 Multipart Upload**: Recommended for files larger than 100 MB and strictly required for objects exceeding 5 GB (standard single-part PUT requests are capped at 5 GB, making them incapable of handling 15–30 GB files). Multipart Upload breaks large files into smaller parts and uploads them in parallel. If a connection drops on an unstable network, only the failed part needs to be retried rather than re-uploading the entire 30 GB file.\n3. **S3 Lifecycle Rule (`AbortIncompleteMultipartUpload`)**: Incomplete multipart uploads leave orphaned parts in the bucket that accumulate silent storage costs under standard S3 rates. Configuring a native S3 Lifecycle rule automatically removes incomplete parts after a designated retention period with zero operational overhead.\n\n**Why other options are incorrect:**\n- **1st Option**: CloudFront distributions are primarily designed for caching and accelerating content downloads. S3 Transfer Acceleration is the AWS-native feature designed specifically for accelerating direct S3 uploads. Additionally, writing a custom AWS Lambda function with EventBridge adds unnecessary operational overhead compared to a native S3 Lifecycle rule.\n- **2nd Option**: Introducing AWS Global Accelerator, Application Load Balancers, an EC2 fleet, and Amazon EFS is an over-engineered and costly architecture that violates the requirement of minimizing operational overhead when S3 provides native serverless capabilities.\n- **4th Option**: Standard single-part S3 PUT operations have a hard limit of 5 GB per object, which cannot support 15–30 GB video files. Establishing AWS Site-to-Site VPN connections at every remote airstrip introduces significant management overhead and networking costs. Furthermore, S3 Object Lambda is used to transform data on GET/retrieval requests, not to manage partial upload streams."
  },
  {
    id: "gen11",
    service_id: "s3",
    conceptIds: ["s3"],
    domain_id: "storage",
    difficulty: "Medium",
    question_ko: "모바일 게임 개발사인 Aegis Interactive는 북미, 유럽, 아시아 등 전 세계에 수백만 명의 활성 플레이어를 보유한 멀티플레이어 게임을 운영하고 있습니다. 모바일 게임 클라이언트는 200 MB에서 1 GB 크기의 경기 리플레이 파일 및 크래시 텔레메트리 패키지를 캡처합니다. 이러한 파일들은 백엔드 처리 및 분석을 위해 플레이어의 모바일 기기에서 us-east-1 리전에 위치한 중앙 Amazon S3 버킷으로 직접 업로드되어야 합니다.\n\n플레이어들은 긴 지연 시간과 불안정한 무선/셀룰러 네트워크 연결로 인해 업로드 속도 저하 및 업로드 실패를 자주 겪고 있습니다. 또한, 회사의 클라우드 청구서에는 중단되거나 완료되지 않은 파일 업로드로 인해 지속적으로 증가하는 스토리지 비용이 발생하고 있습니다. 회사는 모바일 애플리케이션에 장기 AWS 자격 증명이 포함되지 않도록 요구하고 있습니다.\n\n최소한의 운영 오버헤드로 이러한 요구 사항을 충족하는 솔루션은 무엇입니까?",
    question_en: "A mobile game studio, Aegis Interactive, operates a multiplayer game with millions of active players distributed globally across North America, Europe, and Asia. The mobile game client captures match replay files and crash telemetry packages ranging between 200 MB and 1 GB in size. These files must be uploaded directly from players' mobile devices to a centralized Amazon S3 bucket in the us-east-1 Region for backend processing and analysis.\n\nPlayers frequently experience slow upload speeds and failed uploads due to high latency and intermittent cellular network connections. Additionally, the studio's cloud bill shows rising storage costs attributed to incomplete and abandoned file uploads. The studio also requires that no long-term AWS credentials be embedded within the mobile application.\n\nWhich solution meets these requirements with the LEAST operational overhead?",
    options_ko: [
      "업로드를 수신하여 S3 버킷으로 전달하도록 AWS Global Accelerator 엔드포인트 뒤에 Application Load Balancer를 배포합니다. 모바일 애플리케이션이 임시 STS 자격 증명을 사용하여 배치 단위로 파일을 업로드하도록 구성합니다. 부분 업로드 손상을 방지하기 위해 버킷에 S3 버전 관리 및 S3 Object Lock을 활성화합니다.",
      "클라이언트 빌드에 포함된 IAM 사용자 액세스 키를 통해 임시 자격 증명을 획득하도록 모바일 애플리케이션을 구성합니다. S3 오리진으로 구성된 Amazon CloudFront 배포로 직접 단일 파트 PUT 업로드를 수행합니다. Amazon EventBridge로 예약된 AWS Lambda 함수를 구성하여 고아 파일 파트를 식별하고 삭제합니다.",
      "모바일 애플리케이션이 Amazon Cognito를 통해 인증하고 S3 버킷의 리전 엔드포인트로 직접 표준 단일 파트 PUT 요청을 사용하여 파일을 업로드하도록 구성합니다. 7일 후 최신이 아닌 객체 버전을 S3 Glacier Flexible Retrieval로 전환하도록 S3 수명 주기 규칙을 구성합니다.",
      "백엔드 API에서 사전 서명된 URL(presigned URL)을 요청하고 Amazon S3 Transfer Acceleration 엔드포인트를 사용하여 S3 멀티파트 업로드(Multipart Upload)를 수행하도록 모바일 애플리케이션을 구성합니다. 7일 후 완료되지 않은 멀티파트 업로드를 중단(abort)하도록 S3 버킷에 S3 수명 주기 규칙을 구성합니다."
    ],
    options_en: [
      "Deploy an Application Load Balancer behind an AWS Global Accelerator endpoint to receive uploads and forward them to the S3 bucket. Configure the mobile application to use temporary STS credentials and upload files in batches. Enable S3 Versioning and S3 Object Lock on the bucket to prevent partial upload corruption.",
      "Configure the mobile application to obtain temporary credentials via an IAM user access key embedded in the client build. Perform single-part PUT uploads directly to an Amazon CloudFront distribution configured with an S3 origin. Configure an AWS Lambda function scheduled by Amazon EventBridge to identify and delete orphan file parts.",
      "Configure the mobile application to authenticate with Amazon Cognito and upload files using standard single-part PUT requests directly to the S3 bucket's regional endpoint. Configure an S3 Lifecycle rule to transition noncurrent object versions to S3 Glacier Flexible Retrieval after 7 days.",
      "Configure the mobile application to request presigned URLs from a backend API and perform S3 Multipart Uploads using the Amazon S3 Transfer Acceleration endpoint. Configure an S3 Lifecycle rule on the S3 bucket to abort incomplete multipart uploads after 7 days."
    ],
    answer: 3,
    explanation_ko: "3번 보기(인덱스 2)가 정답입니다.\n\n1. Amazon S3 Transfer Acceleration은 전 세계에 분산된 Amazon CloudFront의 엣지 로케이션을 활용하여 업로드 트래픽을 최적화된 AWS 글로벌 전용 백본 네트워크로 라우팅함으로써, 원거리(us-east-1)에 위치한 글로벌 플레이어의 업로드 지연 시간을 대폭 단축시킵니다.\n2. S3 멀티파트 업로드(Multipart Upload)는 100 MB 이상의 대용량 객체 업로드에 권장됩니다. 대용량 파일(200 MB~1 GB)을 여러 파트로 나누어 병렬로 전송하여 처리량을 높이고, 불안정한 모바일/셀룰러 네트워크에서 연결이 끊기더라도 전체 파일이 아닌 실패한 파트만 재시도할 수 있어 안정성을 제공합니다.\n3. 백엔드 API를 통해 생성된 사전 서명된 URL(Presigned URL)을 사용하면 모바일 앱 클라이언트에 영구적인 IAM 자격 증명을 포함하지 않고도 안전하게 S3로 직접 파일을 업로드할 수 있습니다.\n4. \"완료되지 않은 멀티파트 업로드 중단(Abort incomplete multipart uploads)\" S3 수명 주기 규칙을 구성하면 중단되거나 방치된 업로드 조각을 지정된 기간(예: 7일) 후 자동으로 삭제하여 추가적인 운영 오버헤드 없이 불필요한 스토리지 비용 발생을 원천 차단합니다.\n\n오답 분석:\n- 1번 보기(인덱스 0): 모바일 클라이언트 빌드에 IAM 사용자 액세스 키를 하드코딩하는 것은 심각한 보안 취약점입니다. 또한 Lambda 함수를 작성하여 고아 파일을 검색/삭제하는 것은 네이티브 S3 수명 주기 규칙에 비해 불필요한 운영 오버헤드를 발생시킵니다.\n- 2번 보기(인덱스 1): 불안정한 네트워크에서 최대 1 GB 크기의 대용량 파일을 단일 파트 PUT 요청으로 업로드하는 것은 전송 실패율이 매우 높습니다. 또한 일반 리전 엔드포인트는 글로벌 네트워크 지연을 해결하지 못하며, 최신이 아닌 객체 버전을 Glacier로 전환하는 것은 불완전한 멀티파트 업로드 파트를 정리하지 못합니다.\n- 4번 보기(인덱스 3): Application Load Balancer는 중간 컴퓨팅 계층 없이 S3 버킷으로 직접 프록시 업로드를 수행할 수 없습니다. S3 버전 관리 및 Object Lock은 글로벌 전송 가속이나 실패한 멀티파트 업로드 파트 삭제와 무관합니다.",
    explanation_en: "Option 3 (Index 2) is the correct answer.\n\n1. Amazon S3 Transfer Acceleration utilizes Amazon CloudFront's globally distributed edge locations to ingest uploads onto the optimized AWS private network backbone, dramatically reducing upload latency for players located far from the destination Region (us-east-1).\n2. S3 Multipart Upload is recommended for objects larger than 100 MB (and required above 5 GB). It allows concurrent part uploads for higher throughput and only retries individual failed parts rather than the entire 200 MB–1 GB file over flaky cellular/Wi-Fi connections.\n3. Presigned URLs generated by a backend API allow mobile clients to upload directly to S3 with temporary permissions, preventing the need to bundle static IAM access keys in the application binary.\n4. S3 Lifecycle Rules with the \"Abort incomplete multipart uploads\" action automatically remove abandoned upload parts after the specified number of days, eliminating hidden and unnecessary storage charges with zero operational overhead.\n\nWhy other options are incorrect:\n- Option 1 (Index 0): Embedding static IAM access keys in client binaries is a severe security anti-pattern. Using custom Lambda functions to clean up orphan files introduces unnecessary operational maintenance compared to native S3 Lifecycle rules.\n- Option 2 (Index 1): Single-part PUT operations are inefficient and failure-prone for large files (up to 1 GB) over unstable connections. Direct uploads to a standard regional endpoint do not leverage edge acceleration for global users. Transitioning noncurrent object versions does not clean up incomplete multipart uploads.\n- Option 4 (Index 3): Application Load Balancers cannot directly route uploads into S3 without intermediary compute layers. S3 Versioning and S3 Object Lock do not optimize upload performance or purge abandoned multipart upload parts."
  },
  {
    id: "gen12",
    service_id: "s3",
    conceptIds: ["s3"],
    domain_id: "storage",
    difficulty: "Medium",
    question_ko: "메리디안 글로벌 대학교(Meridian Global University)는 전 세계의 교수진과 학생들이 10 GB에서 80 GB 크기의 강의 녹화 영상 및 고해상도 실습 데이터셋을 업로드할 수 있는 온라인 학습 포털을 운영하고 있습니다. 해당 포털은 이러한 파일들을 us-east-1 리전에 위치한 단일 Amazon S3 버킷에 저장합니다. 원격지에 거주하는 사용자들은 높은 네트워크 지연 시간과 간헐적인 연결 끊김 현상으로 인해 업로드 속도 저하 및 업로드 실패를 자주 경험하고 있습니다. 또한 대학교 측은 실패하거나 중단된 업로드 시도로 인해 불필요한 스토리지 비용이 숨겨진 채 누적되지 않도록 방지하고자 합니다.\n\n최소한의 운영 오버헤드로 이러한 요구 사항을 충족하는 조치 조합은 무엇입니까?",
    question_en: "Meridian Global University operates an online learning portal where instructors and students located worldwide upload recorded video lectures and high-resolution laboratory datasets ranging from 10 GB to 80 GB in size. The portal stores these files in a single Amazon S3 bucket hosted in the us-east-1 Region. Users in geographically distant regions frequently experience slow upload speeds and failures due to high network latency and intermittent connection drops. Furthermore, the university wants to ensure that aborted or failed upload attempts do not accumulate hidden storage costs.\n\nWhich combination of steps will meet these requirements with the LEAST operational overhead?",
    options_ko: [
      "사용자가 위치한 모든 AWS 리전에 리전별 Amazon S3 버킷을 생성하고, us-east-1의 기본 버킷으로 객체를 복제하도록 Amazon S3 교차 리전 복제(CRR)를 구성한 다음, 리전별 버킷에 보존 기간이 설정된 S3 Object Lock을 활성화합니다.",
      "대상 Amazon S3 버킷에 Amazon S3 Transfer Acceleration을 활성화합니다. 클라이언트 애플리케이션이 Transfer Acceleration 엔드포인트를 대상으로 멀티파트 업로드(Multipart Upload)를 수행하도록 업데이트하고, 불완전한 멀티파트 업로드를 중단(abort)하는 S3 수명 주기(Lifecycle) 규칙을 구성합니다.",
      "업로드 트래픽을 수신하도록 OAC(Origin Access Control)가 구성된 Amazon CloudFront 배포를 생성하고, 클라이언트 애플리케이션이 단일 PUT 작업을 사용하여 파일을 업로드하도록 구성한 후, Amazon EventBridge 일정에 따라 트리거되는 AWS Lambda 함수를 생성하여 임시 업로드 파일을 삭제합니다.",
      "사용자 지정 업로드 프록시 서비스를 실행하는 Amazon EC2 인스턴스 앞에 AWS Global Accelerator 엔드포인트를 배포하고, 업로드되는 파일을 Amazon EFS 볼륨에 임시 버퍼링한 후, AWS DataSync 일정을 구성하여 완료된 파일을 Amazon S3로 전송합니다."
    ],
    options_en: [
      "Create regional Amazon S3 buckets in every AWS Region where users reside, configure Amazon S3 Cross-Region Replication (CRR) to replicate objects to the primary bucket in us-east-1, and enable S3 Object Lock on the regional buckets with a retention period.",
      "Enable Amazon S3 Transfer Acceleration on the destination S3 bucket. Update the client application to use multipart uploads targeting the Transfer Acceleration endpoint, and configure an S3 Lifecycle rule to abort incomplete multipart uploads.",
      "Configure an Amazon CloudFront distribution with Origin Access Control (OAC) to accept upload traffic, configure client applications to upload files using single-part PUT operations, and create an AWS Lambda function triggered on a schedule by Amazon EventBridge to identify and delete temporary upload files.",
      "Deploy an AWS Global Accelerator endpoint in front of Amazon EC2 instances running a custom upload proxy service, buffer incoming files on an Amazon EFS volume, and schedule AWS DataSync tasks to transfer completed files to Amazon S3."
    ],
    answer: 1,
    explanation_ko: "**정답: 옵션 2**\n\n**핵심 개념 분석:**\n1. **대용량 객체를 위한 멀티파트 업로드(Multipart Upload)**: Amazon S3에서 단일 `PUT` 요청으로 업로드할 수 있는 최대 객체 크기는 5 GB입니다. 문제 시나리오의 파일 크기는 10 GB ~ 80 GB이므로 **멀티파트 업로드가 필수적**입니다. 멀티파트 업로드는 대용량 파일을 여러 파트로 나누어 병렬로 전송하여 속도를 높이며, 불안정한 네트워크 연결로 인해 오류가 발생해도 실패한 파트만 재시도할 수 있어 전송 신뢰성이 크게 향상됩니다.\n2. **Amazon S3 Transfer Acceleration (S3TA)**: 전 세계에 분산된 사용자와 중앙 S3 버킷 간의 장거리 파일 전송을 가속화합니다. 전 세계에 분포된 Amazon CloudFront 엣지 로케이션(Edge Locations)을 활용하여, 데이터가 엣지에 도달하는 즉시 최적화된 AWS 전용 백본 네트워크를 통해 us-east-1의 대상 S3 버킷으로 라우팅되므로 공용 인터넷 지연 시간 및 패킷 손실 문제를 해결합니다.\n3. **불완전한 멀티파트 업로드 중단을 위한 S3 수명 주기 규칙(`AbortIncompleteMultipartUpload`)**: 멀티파트 업로드가 시작되면 업로드된 각 파트는 업로드가 완료되거나 명시적으로 중단되지 않는 한 S3에 그대로 보관되어 지속적으로 스토리지 요금이 발생합니다. S3 수명 주기 규칙에 '불완전한 멀티파트 업로드 중단'을 설정하면 지정된 일수가 지난 후 완료되지 않은 파트들을 자동으로 삭제하여 추가 관리 오버헤드 없이 숨겨진 비용 발생을 방지할 수 있습니다.\n\n**다른 옵션들이 오답인 이유:**\n- **옵션 1 오답**: 단일 PUT 작업의 최대 허용 크기는 5 GB이므로 10 GB ~ 80 GB 크기의 파일을 업로드할 수 없습니다. 또한 CloudFront는 다운로드 캐싱에 최적화되어 있으며, Lambda 및 EventBridge를 통한 커스텀 정리 방식은 내장 S3 수명 주기 규칙에 비해 불필요한 운영 오버헤드를 발생시킵니다.\n- **옵션 3 오답**: EC2 인스턴스, EFS 볼륨, DataSync를 사용한 커스텀 프록시 파이프라인 구축은 과도한 아키텍처 복잡성, 인프라 관리 부담, 추가 컴퓨팅/스토리지 비용을 초래합니다.\n- **옵션 4 오답**: 여러 리전에 개별 S3 버킷을 생성하고 CRR을 구성하는 것은 관리가 복잡하고 비용이 많이 듭니다. CRR은 리전 간 버킷 복제(재해 복구 등)에 사용되며 최종 사용자의 대용량 수집 가속용이 아닙니다. 또한 S3 Object Lock은 WORM(Write Once, Read Many) 규준 준수를 위해 객체 삭제를 방지하는 기능이므로 불완전한 업로드 파트 비용 누적을 방지하지 못합니다.",
    explanation_en: "**Correct Answer: Option 2**\n\n**Key Concept Analysis:**\n1. **Multipart Upload for Large Objects**: A single `PUT` operation in Amazon S3 has a maximum object limit of 5 GB. Because the files range from 10 GB to 80 GB, **Multipart Upload is strictly required**. Multipart Upload breaks large files into smaller parts and uploads them in parallel to maximize throughput. If a network disruption occurs, only the failed parts are retried rather than re-uploading the entire file from the beginning.\n2. **Amazon S3 Transfer Acceleration (S3TA)**: Enables fast, easy, and secure transfers of files over long distances between geographically dispersed users and a central S3 bucket. It routes client uploads through Amazon CloudFront's globally distributed Edge Locations and transfers the data over AWS's optimized private backbone network to the destination bucket in us-east-1.\n3. **S3 Lifecycle Rule for Incomplete Multipart Uploads (`AbortIncompleteMultipartUpload`)**: When a multipart upload is initiated, the uploaded parts are stored and billed as standard S3 storage until the upload completes or is explicitly aborted. Configuring an S3 Lifecycle rule to automatically abort incomplete multipart uploads after a specified number of days cleans up uncommitted parts without requiring custom scripts or operational maintenance.\n\n**Why the other options are incorrect:**\n- **Option 1 is incorrect**: A single PUT operation cannot upload objects larger than 5 GB. Additionally, CloudFront is primarily designed for content distribution (downloads/caching), and managing custom Lambda cleaners with EventBridge introduces unnecessary operational complexity compared to native S3 Lifecycle rules.\n- **Option 3 is incorrect**: Building a custom upload proxy infrastructure using EC2 instances, EFS volumes, and AWS DataSync introduces significant architectural complexity, operational overhead, and unnecessary compute/storage costs.\n- **Option 4 is incorrect**: Setting up multiple regional buckets and configuring Cross-Region Replication (CRR) is complex, expensive, and does not address the underlying issue of reliable upload ingestion for files larger than 5 GB from user devices. Furthermore, S3 Object Lock prevents object modification or deletion for WORM compliance, which does not prevent incomplete multipart upload charges."
  },
  {
    id: "gen13",
    service_id: "s3",
    conceptIds: ["s3"],
    domain_id: "storage",
    difficulty: "Medium",
    question_ko: "글로벌 물류 기업인 Centurion Freight Global은 전 세계 장거리 화물 운송을 추적하고 있습니다. 각 운송 차량에는 고해상도 텔레매틱스 및 화물 스캔 센서가 장착되어 있어 이동 경로당 15GB에서 75GB 크기의 암호화된 아카이브 패키지를 생성합니다. 차량 장비는 셀룰러 및 위성 네트워크를 통해 이러한 아카이브를 us-east-1 리전의 Amazon S3 버킷으로 업로드합니다.\n\n운송 도중 발생하는 간헐적인 네트워크 끊김으로 인해 단일 업로드 요청이 실패하면 차량 장비가 전체 업로드를 처음부터 다시 시작해야 하는 문제가 발생하고 있습니다. 또한 회사는 실패하거나 중단된 업로드 시도로 인해 남겨진 불완전한 데이터 조각들로 인해 S3 스토리지 비용이 예상치 못하게 증가하고 있음을 확인했습니다.\n\n솔루션스 아키텍트는 대용량 아카이브의 안정적인 업로드를 지원하고, 전송 실패 시 중단된 부분만 다시 시도할 수 있도록 하며, 최소한의 운영 오버헤드로 남은 업로드 조각을 자동 정리하여 스토리지 비용을 절감하는 솔루션을 설계해야 합니다.\n\n이러한 요구 사항을 충족하는 솔루션은 무엇입니까?",
    question_en: "A logistics company, Centurion Freight Global, tracks long-haul cargo shipments worldwide. Each freight vehicle is equipped with high-resolution telematics and cargo-scanning sensors that produce encrypted archive packages ranging from 15 GB to 75 GB per route. The vehicle devices attempt to upload these archives over cellular and satellite networks to an Amazon S3 bucket in the us-east-1 Region.\n\nDuring transit, intermittent network disruptions cause single upload requests to fail, forcing the devices to restart the entire upload from the beginning. Furthermore, the company observes an unexpected increase in S3 storage costs caused by lingering partial fragments from failed and abandoned upload attempts.\n\nA solutions architect must design a solution that enables reliable uploads of these large archives, retries only interrupted portions upon failure, and automatically cleans up leftover upload fragments to minimize storage costs with the least operational overhead.\n\nWhich solution meets these requirements?",
    options_ko: [
      "대상 버킷에서 Amazon S3 Transfer Acceleration을 활성화하고 차량 장비가 표준 Amazon S3 PutObject API 호출을 사용하여 아카이브 파일을 업로드하도록 구성합니다. 7일 후 최신이 아닌 객체 버전(noncurrent versions)을 S3 Glacier Flexible Retrieval로 전환하는 Amazon S3 수명 주기 규칙을 생성합니다.",
      "차량 장비가 AWS Site-to-Site VPN을 통해 마운트된 Amazon Elastic File System(Amazon EFS) 파일 시스템에 아카이브를 업로드하도록 구성합니다. AWS DataSync를 사용하여 Amazon EFS에서 Amazon S3로 파일을 전송하고 7일 후 객체를 만료시키는 Amazon S3 수명 주기 규칙을 구성합니다.",
      "수신 파일 스트림을 버퍼링하여 Amazon S3에 기록하도록 Amazon EC2 인스턴스의 Auto Scaling 그룹 앞에 Application Load Balancer(ALB)를 구성합니다. Amazon EventBridge로 매일 실행되는 AWS Lambda 함수를 생성하여 커밋되지 않은 업로드 조각을 검색하고 삭제합니다.",
      "차량 장비가 Amazon S3 멀티파트 업로드(Multipart Upload) API를 사용하여 아카이브 파일을 업로드하도록 구성합니다. 7일 후 완료되지 않은 멀티파트 업로드를 중단(abort incomplete multipart uploads)하고 커밋되지 않은 파트를 삭제하는 동작이 포함된 Amazon S3 수명 주기 규칙을 생성합니다."
    ],
    options_en: [
      "Enable Amazon S3 Transfer Acceleration on the target bucket and configure vehicle devices to upload archive files using standard Amazon S3 PutObject API calls. Create an Amazon S3 Lifecycle rule to transition noncurrent object versions to S3 Glacier Flexible Retrieval after 7 days.",
      "Configure vehicle devices to upload archives to an Amazon Elastic File System (Amazon EFS) file system mounted over AWS Site-to-Site VPN. Use AWS DataSync to move files from Amazon EFS to Amazon S3 and configure an Amazon S3 Lifecycle rule to expire objects after 7 days.",
      "Configure an Application Load Balancer (ALB) fronting an Auto Scaling group of Amazon EC2 instances to buffer incoming file streams and write them to Amazon S3. Create an AWS Lambda function triggered by Amazon EventBridge on a daily schedule to find and delete uncommitted upload fragments.",
      "Configure vehicle devices to upload archive files using the Amazon S3 Multipart Upload API. Create an Amazon S3 Lifecycle rule with the action to abort incomplete multipart uploads and delete uncommitted parts after 7 days."
    ],
    answer: 3,
    explanation_ko: "**정답: 세 번째 항목 (인덱스 2)**\n\n### 상세 해설:\n1. **Amazon S3 멀티파트 업로드(Multipart Upload) API:**\n   - Amazon S3의 단일 `PutObject` API 작업은 최대 5GB까지만 객체를 업로드할 수 있습니다. 본 시나리오의 파일 크기는 15GB~75GB이므로 멀티파트 업로드가 필수적입니다.\n   - 멀티파트 업로드는 대용량 객체를 여러 개의 개별 파트(5MB~5GB)로 나누어 병렬로 업로드합니다. 네트워크 끊김이 발생하더라도 전체 파일을 처음부터 다시 올릴 필요 없이 실패한 특정 파트만 재시도하면 되므로, 불안정한 셀룰러/위성 통신 환경에 가장 적합합니다.\n\n2. **S3 수명 주기 규칙을 통한 불완전한 멀티파트 업로드 자동 정리:**\n   - 멀티파트 업로드가 시작되어 업로드된 각 파트는 업로드가 완료(`CompleteMultipartUpload`)되거나 명시적으로 중단(`AbortMultipartUpload`)될 때까지 S3 스토리지에 남아 기본 스토리지 요금이 지속적으로 부과됩니다.\n   - 네트워크 문제로 업로드가 중단 및 방치되면 이 불완전한 파트들이 보이지 않게 남아 비용을 발생시킵니다.\n   - 이를 최소한의 운영 오버헤드로 해결하는 가장 최적의 관리형 솔루션은 **Amazon S3 수명 주기(Lifecycle) 규칙**에서 **`AbortIncompleteMultipartUpload` (완료되지 않은 멀티파트 업로드 중단)** 작업을 설정하여 지정된 일수(예: 7일) 후 불완전한 파트를 자동 삭제하도록 하는 것입니다.\n\n---\n\n### 오답 분석:\n- **첫 번째 항목(인덱스 0)이 오답인 이유:** 단일 `PutObject` 요청은 5GB를 초과하는 객체를 업로드할 수 없어 실패합니다. 또한 Transfer Acceleration은 실패한 단일 요청의 부분 재시도를 제공하지 못하며, 최신이 아닌 버전을 Glacier로 전환하는 규칙은 미완료 멀티파트 업로드 파트를 정리하지 못합니다.\n- **두 번째 항목(인덱스 1)이 오답인 이유:** ALB, EC2 인스턴스, 커스텀 Lambda 스크립트를 구축하는 방식은 높은 아키텍처 복잡성과 운영 오버헤드를 발생시킵니다. S3 자체 관리형 기능(멀티파트 업로드 + 수명 주기 규칙)으로 완벽히 해결 가능합니다.\n- **네 번째 항목(인덱스 3)이 오답인 이유:** 이동 중인 화물 차량에서 Site-to-Site VPN을 통해 Amazon EFS를 직접 마운트하는 것은 불안정하고 비현실적인 설계입니다. 또한 객체 만료(Expiration) 수명 주기 규칙은 정상 업로드된 완료 객체를 삭제할 뿐, 미완료 멀티파트 업로드 조각을 정리하지 못합니다.",
    explanation_en: "**Correct Answer: Option 3 (Index 2)**\n\n### Detailed Explanation:\n1. **Amazon S3 Multipart Upload API:**\n   - Amazon S3 enforces a strict 5 GB maximum limit on single `PutObject` API operations. Because the archive files range from 15 GB to 75 GB, Multipart Upload is mandatory.\n   - Multipart Upload breaks large objects into distinct parts (from 5 MB up to 5 GB each) and uploads them independently and concurrently. If a network disruption occurs, only the specific failed parts need to be retried rather than restarting the entire 15–75 GB upload from scratch, making it ideal for unstable cellular/satellite links.\n\n2. **Cleaning Up Incomplete Multipart Uploads via S3 Lifecycle Rules:**\n   - When a multipart upload is initiated, uploaded parts are stored in S3 and billed at standard storage rates until the upload is completed or explicitly aborted.\n   - If an upload is abandoned, these partial parts remain hidden and continue incurring storage costs indefinitely.\n   - The native and managed solution with the least operational overhead is to configure an **Amazon S3 Lifecycle rule** with the **`AbortIncompleteMultipartUpload`** action, which automatically deletes incomplete multipart upload parts after a specified number of days (e.g., 7 days).\n\n---\n\n### Why the other options are incorrect:\n- **Option 1 is incorrect:** Standard `PutObject` requests fail for objects larger than 5 GB. Furthermore, S3 Transfer Acceleration does not allow resuming failed parts of a single upload request, and transitioning noncurrent versions does not clean up incomplete multipart uploads.\n- **Option 2 is incorrect:** Introducing an ALB, EC2 instances, and custom Lambda scripts creates unnecessary architectural complexity and significant operational maintenance overhead when native S3 capabilities exist.\n- **Option 3 is incorrect:** Mounting Amazon EFS directly from moving fleet vehicles over Site-to-Site VPN is impractical and unreliable. Moving data via DataSync and expiring completed objects after 7 days does not address incomplete upload parts and causes premature deletion of valid cargo archives."
  },
  {
    id: "gen14",
    service_id: "lambda",
    conceptIds: ["lambda"],
    domain_id: "compute",
    difficulty: "Medium",
    question_ko: "한 의료 기록 스타트업에서 환자 초기 문진 요약본을 처리하기 위한 이벤트 기반 시스템을 개발하고 있습니다. 여러 병원에서 하루 중 불규칙하게 PDF 및 JSON 형식의 의료 기록 파일(문서당 평균 처리 시간: 30초)을 Amazon S3 버킷에 업로드합니다. 애플리케이션은 업로드된 각 문서를 파싱하고 민감한 메타데이터를 비식별화한 후, 정형화된 환자 기록을 Amazon DynamoDB 테이블에 저장해야 합니다. 이 스타트업은 운영 오버헤드를 최소화하고 처리할 파일이 없을 때는 컴퓨팅 비용이 발생하지 않는 아키텍처를 원합니다.\n\n이러한 요구 사항을 충족하는 가장 적절한 솔루션은 무엇입니까?",
    question_en: "A healthcare records startup is developing an event-driven system to process patient intake summaries. Clinics sporadically upload PDF and JSON medical records (average processing time is 30 seconds per record) to an Amazon S3 bucket throughout the day. The application must parse each uploaded document, scrub sensitive metadata, and save the structured patient records into an Amazon DynamoDB table. The startup wants an architecture that minimizes operational overhead and incurs no compute costs when no files are being processed.\n\nWhich solution meets these requirements?",
    options_ko: [
      "업로드된 파일마다 AWS Fargate 컴퓨팅 환경에서 AWS Batch 작업을 트리거하는 Amazon EventBridge 규칙을 설정하여, 문서를 파싱하고 DynamoDB를 업데이트하는 커스텀 컨테이너를 실행합니다.",
      "Network Load Balancer 뒤의 EC2 인스턴스에 Amazon ECS 서비스를 배포합니다. 새 파일이 있는지 S3 버킷을 지속적으로 검색하여 문서를 처리하고 결과를 DynamoDB에 저장하도록 컨테이너 애플리케이션을 구성합니다.",
      "S3 업로드 알림을 수신하는 Amazon SQS 대기열을 생성합니다. 해당 대기열을 폴링하여 기록을 처리하고 DynamoDB에 데이터를 삽입하도록 Amazon EC2 인스턴스의 Auto Scaling 그룹을 시작합니다.",
      "객체가 생성될 때 AWS Lambda 함수를 호출하도록 Amazon S3 이벤트 알림을 구성합니다. Lambda 함수를 사용하여 문서를 파싱하고, 민감한 메타데이터를 제거한 뒤, 결과를 Amazon DynamoDB에 기록합니다."
    ],
    options_en: [
      "Set up an Amazon EventBridge rule that triggers an AWS Batch job on an AWS Fargate compute environment for each uploaded file to run a custom container that parses the document and updates DynamoDB.",
      "Deploy an Amazon ECS service on EC2 instances behind a Network Load Balancer. Configure the container application to continuously scan the S3 bucket for new files, process them, and store the results in DynamoDB.",
      "Create an Amazon SQS queue to receive S3 upload notifications. Launch an Auto Scaling group of Amazon EC2 instances to poll the queue, process the records, and insert the data into DynamoDB.",
      "Configure Amazon S3 Event Notifications to invoke an AWS Lambda function upon object creation. Use the Lambda function to parse the document, remove sensitive metadata, and write the output to Amazon DynamoDB."
    ],
    answer: 3,
    explanation_ko: "**정답: C** (객체가 생성될 때 AWS Lambda 함수를 호출하도록 Amazon S3 이벤트 알림을 구성...)\n\n**정답 해설:**\n- **운영 오버헤드 최소화 및 서버리스:** AWS Lambda는 서버 인프라를 프로비저닝하거나 패치, 관리할 필요 없이 S3 객체 생성과 같은 이벤트에 즉각 반응하여 코드를 실행하는 완전관리형 서버리스 컴퓨팅 서비스입니다.\n- **유휴 비용 없음:** Lambda는 코드가 실행되는 시간(밀리초 단위)에 대해서만 요금이 부과되므로, 파일 업로드가 없는 유휴 시간에는 컴퓨팅 비용이 전혀 발생하지 않습니다.\n- **실행 시간 제한 충족:** 문서 처리 시간이 약 30초이므로 Lambda의 최대 실행 제한 시간인 15분(900초) 이내에 안정적으로 처리됩니다.\n- **표준 아키텍처 패턴:** S3 이벤트 알림 → Lambda → DynamoDB 구조는 비동기식 이벤트 기반 파일 처리 및 메타데이터 추출을 위한 대표적인 AWS 표준 설계 패턴입니다.\n\n**오답 해설:**\n- **선택지 A (EC2 Auto Scaling):** EC2 가상 서버를 직접 관리(OS 패치, AMI 유지보수, 스케일링 정책 등)해야 하므로 운영 오버헤드가 크고, 유휴 시에도 기본 인스턴스 비용이 발생합니다.\n- **선택지 B (AWS Batch on Fargate):** AWS Batch는 대규모 배치 연산이나 복잡한 컨테이너 작업에 적합합니다. 30초 내외의 단순 문서 파싱 작업에 컨테이너 이미지, 작업 정의 및 배치 대기열을 구성하는 것은 불필요한 운영 복잡성을 초래합니다.\n- **선택지 D (EC2 기반 ECS 및 지속적 폴링):** S3 버킷을 지속적으로 폴링하는 방식은 불필요한 API 호출과 컴퓨팅 자원을 낭비합니다. 또한 EC2 호스트 인스턴스를 유지 관리해야 하므로 운영 오버헤드 최소화 조건을 만족하지 못합니다.",
    explanation_en: "**Correct Answer: C** (Configure Amazon S3 Event Notifications to invoke an AWS Lambda function upon object creation...)\n\n**Why this is correct:**\n- **Minimal Operational Overhead & Serverless:** AWS Lambda is a fully managed, event-driven serverless compute service that executes code directly in response to events (such as S3 object creations) without provisioning, patching, or managing infrastructure.\n- **No Idle Cost:** Lambda only charges for compute time consumed during execution (down to millisecond granularity), perfectly satisfying the requirement of zero compute costs during idle periods.\n- **Execution Duration:** The document processing takes approximately 30 seconds, which is well within Lambda's 15-minute (900 seconds) hard limit.\n- **Standard Canonical Pattern:** S3 Event Notification → Lambda → DynamoDB is the standard AWS reference architecture for asynchronous, event-driven document processing.\n\n**Why other options are incorrect:**\n- **Option A (EC2 Auto Scaling):** Requires provisioning and managing virtual servers (OS patching, scaling policies, AMI updates) and incurs base compute costs even when traffic is low or idle, increasing operational overhead.\n- **Option B (AWS Batch on Fargate):** AWS Batch is designed for long-running or batch containerized jobs. Setting up container images, job definitions, and batch queues introduces unnecessary operational complexity for a simple 30-second document parsing task.\n- **Option D (ECS on EC2 with continuous polling):** Continuously polling S3 wastes API calls and compute resources. Managing EC2 container instances also introduces high operational overhead and continuous server costs regardless of idle periods."
  },
  {
    id: "gen15",
    service_id: "lambda",
    conceptIds: ["lambda"],
    domain_id: "compute",
    difficulty: "Medium",
    question_ko: "한 지방 항공사가 온라인 항공권 예약 및 승객 체크인 플랫폼을 운영하고 있습니다. 승객이 모바일 애플리케이션을 통해 체크인을 진행하면, 백엔드 시스템은 개인화된 전자 탑승권 PDF를 생성하여 Amazon S3 버킷에 업로드하고 체크인 확인 상태를 Amazon DynamoDB 테이블에 기록합니다. 각 체크인 요청을 처리하는 데는 약 3초가 소요됩니다. 체크인 요청 트래픽은 항공편 출발 24시간 전에 급격하게 급증하지만, 심야 시간대에는 요청이 거의 발생하지 않는 등 변동성이 매우 큽니다.\n\n솔루션스 아키텍트(Solutions Architect)는 운영 오버헤드를 최소화하고(LEAST operational overhead), 처리할 체크인 요청이 없는 유휴 시간대에는 컴퓨팅 비용이 전혀 발생하지 않는 솔루션을 설계해야 합니다.\n\n이러한 요구 사항을 충족하는 솔루션은 무엇입니까?",
    question_en: "A regional airline operates an online flight booking and passenger check-in platform. When passengers check in via the mobile application, the backend generates a personalized digital boarding pass PDF, uploads it to an Amazon S3 bucket, and records the check-in confirmation status in an Amazon DynamoDB table. Each check-in request takes approximately 3 seconds to complete. The check-in request volume is highly variable, experiencing sharp traffic spikes 24 hours prior to scheduled flights and prolonged periods of near-zero traffic overnight.\n\nA solutions architect must design a compute solution that requires the LEAST operational overhead and incurs no compute costs when no check-in requests are being processed.\n\nWhich solution meets these requirements?",
    options_ko: [
      "AWS Fargate 컴퓨팅 환경을 사용하는 AWS Batch를 구성하고, 5분마다 Amazon EventBridge 예약 규칙으로 배치 작업을 트리거하여 대기 중인 체크인을 일괄 처리하도록 구성합니다.",
      "Amazon API Gateway REST API를 생성하여 AWS Lambda 함수를 호출하고, 이 함수가 PDF를 생성하여 Amazon S3에 업로드한 뒤 Amazon DynamoDB에 체크인 세부 정보를 기록하도록 구성합니다.",
      "Application Load Balancer 뒤에 대상 추적 조정 정책이 구성된 Auto Scaling 그룹 내의 Amazon EC2 인스턴스에 체크인 처리 애플리케이션을 배포합니다.",
      "체크인 애플리케이션을 Docker 컨테이너로 패키징한 후 Amazon EC2 스팟 인스턴스를 사용하는 Amazon Elastic Kubernetes Service(Amazon EKS) 클러스터에 배포합니다."
    ],
    options_en: [
      "Configure an AWS Batch compute environment using AWS Fargate, and trigger a batch job via Amazon EventBridge scheduled rules every 5 minutes to process pending check-ins.",
      "Create an Amazon API Gateway REST API that invokes an AWS Lambda function to generate the PDF, upload it to Amazon S3, and record check-in details in Amazon DynamoDB.",
      "Deploy the check-in processing application on Amazon EC2 instances within an Auto Scaling group behind an Application Load Balancer with target tracking scaling policies.",
      "Package the check-in application into Docker containers and deploy them to an Amazon Elastic Kubernetes Service (Amazon EKS) cluster using Amazon EC2 Spot Instances."
    ],
    answer: 1,
    explanation_ko: "AWS Lambda는 서버 프로비저닝, OS 패치 및 인프라 관리 없이 이벤트에 응답하여 코드를 실행하는 완전 관리형 서버리스 컴퓨팅 서비스입니다. 트래픽 급증 시 자동으로 확장되며, 실행된 컴퓨팅 시간(밀리초 단위)에 대해서만 과금되므로 유휴 상태일 때는 비용이 전혀 발생하지 않습니다. Amazon API Gateway와 AWS Lambda를 함께 구성하면 약 3초 정도의 짧은 작업을 최소한의 운영 오버헤드로 처리할 수 있습니다.\n\n- Amazon EC2 및 Auto Scaling(A)은 인스턴스 프로비저닝, OS 유지보수 등의 운영 부담이 크며, 유휴 시간대에도 최소 실행 인스턴스에 대한 기본 컴퓨팅 비용이 발생합니다.\n- Amazon EKS(B)는 쿠버네티스 클러스터 구성 및 노드 관리 등으로 인해 운영 오버헤드가 매우 크고 고정된 컨트롤 플레인 비용이 발생합니다.\n- AWS Batch 및 EventBridge 5분 예약 실행(D)은 비동기 일괄 처리에 적합한 방식으로, 실시간 탑승권 발급 및 체크인에 지연 시간을 유발하여 적절하지 않습니다.",
    explanation_en: "AWS Lambda is a serverless, event-driven compute service that runs code in response to events without requiring server provisioning, OS maintenance, or infrastructure management. It scales automatically to handle traffic spikes and charges only for the compute duration consumed (measured in milliseconds), incurring zero cost when idle. Pairing Amazon API Gateway with AWS Lambda provides a fully managed architecture with the least operational overhead for short-running tasks (~3 seconds).\n\n- Deploying on Amazon EC2 with Auto Scaling (Option A) requires ongoing server maintenance, OS patching, and incurs baseline compute costs for running instances during idle periods.\n- Amazon EKS (Option B) introduces significant operational overhead for managing Kubernetes cluster configurations, worker nodes, and incurs fixed cluster control plane costs.\n- AWS Batch with scheduled EventBridge rules (Option D) is meant for asynchronous batch processing, introducing latency for real-time check-in requests and adding unnecessary complexity."
  },
  {
    id: "gen16",
    service_id: "lambda",
    conceptIds: ["lambda"],
    domain_id: "compute",
    difficulty: "Medium",
    question_ko: "한 모바일 게임 스튜디오에서 턴제 멀티플레이어 전략 게임을 운영하고 있습니다. 매치가 종료될 때마다 게임 클라이언트는 경기 로그가 포함된 압축된 텔레메트리 파일(2MB 미만)을 Amazon S3 버킷에 업로드합니다. 스튜디오는 각 파일을 파싱하여 경기 결과를 검증하고, 업데이트된 플레이어 랭킹을 Amazon DynamoDB 테이블에 기록해야 합니다. 각 경기 파일의 처리 시간은 5초 미만입니다. 플레이어 활동량은 하루 중 변동 폭이 매우 커서 주말 토너먼트 이벤트 중에는 트래픽이 급증하고 심야 시간대에는 거의 활동이 없습니다. 솔루션스 아키텍트는 인프라 유휴 비용을 없애고 운영 오버헤드를 최소화하면서 플레이어 랭킹을 거의 실시간으로 업데이트하는 솔루션을 설계해야 합니다.\n\n이러한 요구 사항을 충족하는 솔루션은 무엇입니까?",
    question_en: "A mobile game studio operates a turn-based multiplayer strategy game. Whenever a match ends, the game client uploads a compressed telemetry file (under 2 MB) containing match logs to an Amazon S3 bucket. The studio needs to parse each file, verify match outcomes, and update player rankings in an Amazon DynamoDB table. The processing logic takes less than 5 seconds per match file. Player activity fluctuates drastically throughout the day, with massive traffic spikes during weekend tournaments and virtually no activity during late-night hours. A solutions architect must design a solution that updates player rankings in near-real time while minimizing operational overhead and eliminating idle infrastructure costs.\n\nWhich solution meets these requirements?",
    options_ko: [
      "관리형 노드 그룹이 포함된 Amazon EKS 클러스터를 생성하고, S3 API 호출을 통해 S3 버킷을 지속적으로 모니터링하여 파일을 처리하는 커스텀 데몬을 실행합니다.",
      "새 텔레메트리 파일이 업로드될 때마다 AWS Lambda 함수를 호출하도록 Amazon S3 이벤트 알림을 구성합니다. Lambda 함수가 파일을 처리하고 DynamoDB 테이블을 업데이트하도록 합니다.",
      "15분마다 Amazon EventBridge 예약 규칙을 실행하여 Amazon EC2 인스턴스에서 구동되는 AWS Batch 작업을 트리거하고 S3 버킷의 새 파일들을 일괄 처리하도록 구성합니다.",
      "Application Load Balancer 뒤에 Amazon EC2 Auto Scaling 그룹을 배포하여 S3 버킷에서 새로 생성된 파일을 지속적으로 폴링하고 DynamoDB를 업데이트하도록 합니다."
    ],
    options_en: [
      "Launch an Amazon EKS cluster with managed node groups running a custom daemon that continuously monitors the S3 bucket via S3 API calls and processes files.",
      "Configure an Amazon S3 event notification to invoke an AWS Lambda function whenever a new telemetry file is uploaded. Have the Lambda function process the file and update the DynamoDB table.",
      "Configure an Amazon EventBridge scheduled rule to trigger an AWS Batch job running on Amazon EC2 instances every 15 minutes to batch process new files from the S3 bucket.",
      "Deploy an Amazon EC2 Auto Scaling group behind an Application Load Balancer to continuously poll the S3 bucket for newly created files and update DynamoDB."
    ],
    answer: 1,
    explanation_ko: "**정답: 새 텔레메트리 파일이 업로드될 때마다 AWS Lambda 함수를 호출하도록 Amazon S3 이벤트 알림을 구성합니다. Lambda 함수가 파일을 처리하고 DynamoDB 테이블을 업데이트하도록 합니다.**\n\n- **AWS Lambda**는 서버를 프로비저닝하거나 관리할 필요 없이 이벤트에 따라 자동으로 코드를 실행하고 트래픽 변화에 맞춰 유연하게 확장되는 서버리스 컴퓨팅 서비스입니다. 실행된 시간(밀리초 단위)에 대해서만 과금되므로 비수기나 야간 유휴 시간대에 인프라 비용이 전혀 발생하지 않습니다.\n- **Amazon S3 이벤트 알림**을 **AWS Lambda**와 연동하면 파일이 업로드되는 즉시 처리를 시작하는 완전 관리형, 준실시간(near-real-time) 파이프라인을 구축할 수 있습니다. 각 경기 로그 처리 시간이 5초 미만으로 Lambda의 최대 실행 제한 시간(15분 / 900초) 내에 충분히 완료되므로 운영 오버헤드와 비용을 최소화하기에 가장 적합한 아키텍처입니다.\n\n**오답 분석:**\n- **Amazon EventBridge 및 AWS Batch:** 15분 주기로 일괄 처리를 수행하면 경기 종료 후 실시간으로 랭킹을 반영해야 하는 요구 사항을 만족할 수 없으며, 배치 컴퓨팅 환경을 별도로 구성 및 관리해야 합니다.\n- **Amazon EC2 Auto Scaling 그룹:** S3 버킷을 지속적으로 폴링하는 EC2 인스턴스를 유지 관리(OS 패치, AMI 관리, 스케일링 정책 설정 등)해야 하므로 운영 오버헤드가 발생하며, 트래픽이 없는 시간대에도 최소 인스턴스 실행 비용(유휴 비용)이 발생합니다.\n- **Amazon EKS 클러스터:** 컨테이너 오케스트레이션 및 워커 노드를 관리해야 하므로 운영 부담이 매우 크고, 트래픽 유무와 관계없이 클러스터 유지에 따른 기본 인프라 고정 비용이 발생합니다.",
    explanation_en: "**Correct Answer: Configure an Amazon S3 event notification to invoke an AWS Lambda function whenever a new telemetry file is uploaded. Have the Lambda function process the file and update the DynamoDB table.**\n\n- **AWS Lambda** is an event-driven, serverless compute service that automatically runs code in response to events and scales with incoming request volume without requiring server provisioning or maintenance. Billing is based strictly on execution duration, completely eliminating idle infrastructure costs during off-peak and quiet hours.\n- Integrating **Amazon S3 event notifications** directly with **AWS Lambda** enables a fully managed, near-real-time processing pipeline. Because each match validation task takes under 5 seconds (well within Lambda's 15-minute / 900-second execution limit), this approach satisfies the performance requirement while providing the least operational overhead.\n\n**Why the other options are incorrect:**\n- **AWS Batch with Amazon EventBridge schedule:** Triggering batch jobs on a 15-minute interval introduces processing delays, failing the requirement for near-real-time ranking updates. It also requires configuring and managing batch compute environments.\n- **Amazon EC2 Auto Scaling group with ALB:** Running EC2 instances that continuously poll an S3 bucket introduces unnecessary operational overhead (patching, scaling policy configuration, AMI maintenance) and generates idle instance costs when traffic drops to zero.\n- **Amazon EKS cluster:** Managing Kubernetes control planes and worker nodes creates heavy administrative overhead and incurs continuous base infrastructure costs regardless of workload volume."
  },
  {
    id: "gen17",
    service_id: "lambda",
    conceptIds: ["lambda"],
    domain_id: "compute",
    difficulty: "Medium",
    question_ko: "어느 대학교에서 교수진이 과제 안내문, 강의 계획서, 강의 슬라이드 등을 Amazon S3 버킷에 업로드하는 온라인 학습 포털을 운영하고 있습니다. 새 문서가 업로드될 때마다 포털은 즉시 저해상도 썸네일 미리보기를 생성하고 기본 메타데이터(예: 페이지 수, 파일 크기)를 추출하여 Amazon DynamoDB 테이블에 저장해야 합니다. 각 문서의 처리 시간은 약 5~10초 정도 소요됩니다. 문서 업로드 트래픽은 학기 초 및 시험 마감 기간에 급증하지만, 심야 시간대나 방학 기간에는 전혀 발생하지 않아 매우 불규칙합니다.\n\n솔루션스 아키텍트는 운영 오버헤드를 최소화하고 시스템이 유휴 상태일 때 비용이 발생하지 않도록 문서를 자동으로 처리하는 솔루션을 설계해야 합니다.\n\n이러한 요구 사항을 충족하는 솔루션은 무엇입니까?",
    question_en: "A university operates an online learning portal where instructors upload assignment prompts, syllabus files, and lecture slide decks to an Amazon S3 bucket. Whenever a new document is uploaded, the portal must immediately generate a low-resolution thumbnail preview and extract basic metadata (such as page count and file size) into an Amazon DynamoDB table. Each document takes approximately 5 to 10 seconds to process. Document upload traffic is unpredictable—surging heavily during semester starts and exam deadlines, but remaining completely idle overnight and during semester breaks.\n\nA solutions architect must design an automated processing solution that requires the LEAST operational overhead and incurs no costs when the system is idle.\n\nWhich solution meets these requirements?",
    options_ko: [
      "Amazon S3 이벤트 알림을 구성하여 AWS Lambda 함수를 트리거하고, 해당 함수가 썸네일 미리보기를 생성하여 추출된 메타데이터를 DynamoDB에 기록하도록 합니다.",
      "Amazon S3 버킷에 객체가 업로드될 때마다 AWS Batch 작업을 트리거하도록 Amazon EventBridge 규칙을 구성하고, 관리형 컴퓨팅 환경을 사용하여 미리보기를 생성하고 DynamoDB에 메타데이터를 기록합니다.",
      "Application Load Balancer 뒤에 AWS Fargate 기반의 Amazon Elastic Container Service(Amazon ECS) 서비스를 배포하고, 예약된 조정 정책을 사용하여 새 파일이 있는지 S3 버킷을 폴링합니다.",
      "S3 API 호출을 통해 S3 버킷을 지속적으로 폴링하고 파일을 처리하여 DynamoDB에 레코드를 작성하는 Python 워커 스크립트를 실행하는 Amazon EC2 Auto Scaling 그룹을 시작합니다."
    ],
    options_en: [
      "Configure Amazon S3 event notifications to trigger an AWS Lambda function to generate thumbnail previews and write the extracted metadata to DynamoDB.",
      "Configure an Amazon EventBridge rule to trigger an AWS Batch job whenever an object is uploaded to the S3 bucket, using a managed compute environment to generate previews and write metadata to DynamoDB.",
      "Deploy an Amazon Elastic Container Service (Amazon ECS) service on AWS Fargate behind an Application Load Balancer with scheduled scaling policies to poll the S3 bucket for new files.",
      "Launch an Amazon EC2 Auto Scaling group running a Python worker script that continuously polls the S3 bucket using S3 API calls, processes the files, and writes records to DynamoDB."
    ],
    answer: 0,
    explanation_ko: "**정답: 2번째 옵션 (Amazon S3 이벤트 알림을 구성하여 AWS Lambda 함수를 트리거...)**\n\n**정답 해설:**\n- **AWS Lambda**는 서버를 프로비저닝하거나 관리할 필요 없이 이벤트에 응답하여 코드를 자동으로 실행하는 완전관리형 서버리스 컴퓨팅 서비스입니다.\n- 코드가 실제로 실행된 시간(밀리초 단위)에 대해서만 요금이 청구되므로, 야간이나 대학 방학 기간처럼 트래픽이 없는 유휴 시간대에는 비용이 전혀 발생하지 않습니다.\n- **Amazon S3 이벤트 알림(S3 Event Notifications)**을 사용하면 S3 버킷에 새 문서가 업로드되는 즉시 Lambda 함수를 트리거할 수 있습니다. 각 문서의 처리 시간이 5~10초에 불과하므로 Lambda의 최대 실행 제한 시간(15분 / 900초) 내에 완벽하게 부합하며, 최소한의 운영 오버헤드로 요구 사항을 만족합니다.\n\n**오답 해설:**\n- **AWS Batch**: 주로 대규모 배치 작업이나 복잡한 컴퓨팅 파이프라인 처리에 적합합니다. 5~10초짜리 단일 파일 실시간 이벤트 처리를 위해 Batch 작업 정의 및 컴퓨팅 환경을 구성하는 것은 불필요한 운영 오버헤드를 발생시킵니다.\n- **Amazon ECS on AWS Fargate**: Fargate는 서버 관리 부담을 덜어주지만 여전히 컨테이너 이미지를 빌드 및 관리해야 하며, S3 버킷을 주기적으로 폴링하는 방식은 S3의 네이티브 이벤트 기반 아키텍처에 비해 비효율적이고 불필요한 대기 시간 및 비용을 초래합니다.\n- **Amazon EC2 Auto Scaling 그룹**: EC2 인스턴스를 운영하기 위해서는 OS 패치, AMI 유지 관리, 스케일링 정책 구성 등 상당한 운영 오버헤드가 필요합니다. 또한 유휴 시간대에도 최소 인스턴스 유지 비용이 발생합니다.",
    explanation_en: "**Correct Answer: Option 2 (Configure Amazon S3 event notifications to trigger an AWS Lambda function...)**\n\n**Explanation:**\n- **AWS Lambda** is a serverless, event-driven compute service that automatically runs code in response to events without requiring server provisioning or ongoing maintenance.\n- Lambda bills strictly for the compute time consumed (measured in milliseconds), meaning zero costs are incurred during idle periods such as nighttime or university semester breaks.\n- **Amazon S3 Event Notifications** can natively invoke a Lambda function immediately whenever a new document is uploaded. Because document processing takes only 5 to 10 seconds (well within Lambda's 15-minute maximum execution timeout), Lambda represents the most cost-effective solution with the least operational overhead.\n\n**Distractor Explanations:**\n- **AWS Batch**: AWS Batch is suited for batch processing jobs and multi-node parallel computing. Configuring job queues, job definitions, and compute environments for lightweight, real-time 5-to-10 second tasks introduces unnecessary operational complexity.\n- **Amazon ECS on AWS Fargate**: While Fargate eliminates server management, it still requires building container images, managing container task definitions, and configuring services. Additionally, polling S3 introduces latency and inefficiency compared to native S3 event-driven execution.\n- **Amazon EC2 Auto Scaling group**: EC2 instances require ongoing operational maintenance (OS patching, software updates, scaling policy management) and incur base costs for minimum instances even when the portal is completely idle."
  },
  {
    id: "gen18",
    service_id: "lambda",
    conceptIds: ["lambda"],
    domain_id: "compute",
    difficulty: "Medium",
    question_ko: "한 물류 회사가 실시간 화물 추적 서비스를 운영하고 있습니다. 배송 기사의 휴대용 스캐너는 분류 시설이나 배송 체크포인트에서 화물이 스캔될 때마다 작은 크기(10KB 미만)의 JSON 상태 파일을 Amazon S3 버킷에 업로드합니다. 각 파일 처리는 스캔 세부 정보를 검증하고 Amazon DynamoDB 테이블의 화물 최신 위치를 업데이트하는 데 약 1~2초가 소요됩니다. 데이터 수신량은 아침 배송 출발 시 급증하고 심야에는 활동이 거의 없는 등 하루 동안 변동 폭이 매우 큽니다. 회사는 거의 실시간(near-real-time) 지연 시간으로 업데이트를 처리하고, 서버 관리 부담이 없으며, 업로드되는 파일이 없을 때 컴퓨팅 비용이 발생하지 않는 솔루션을 요구합니다.\n\n운영 오버헤드가 가장 적으면서 이러한 요구 사항을 충족하는 아키텍처는 무엇입니까?",
    question_en: "A logistics company operates a real-time parcel tracking service. Courier handheld scanners upload small JSON status files (under 10 KB) to an Amazon S3 bucket whenever a shipment is scanned at a sorting facility or delivery checkpoint. Processing each file takes approximately 1 to 2 seconds to validate the scan details and update the package's latest location in an Amazon DynamoDB table. Ingestion volume varies drastically throughout the day, with heavy spikes during morning delivery dispatch and nearly zero activity overnight. The company requires a solution that processes updates with near-real-time latency, requires no server management, and eliminates compute costs when no files are being uploaded.\n\nWhich architecture meets these requirements with the LEAST operational overhead?",
    options_ko: [
      "Amazon S3 버킷에서 새로 업로드된 JSON 파일을 지속적으로 폴링하고 Amazon DynamoDB에 추적 업데이트를 작성하는 AWS Fargate 기반의 Amazon ECS 클러스터를 생성합니다.",
      "5분마다 실행되도록 예약된 AWS Glue ETL 작업을 구성하여 Amazon S3에서 새 JSON 파일을 추출하고 추적 레코드를 변환한 후 Amazon DynamoDB에 로드합니다.",
      "객체 생성 시 Amazon S3 이벤트 알림(Event Notification)이 AWS Lambda 함수를 호출하도록 구성하여, JSON 파일을 파싱하고 Amazon DynamoDB에 추적 데이터를 기록합니다.",
      "Application Load Balancer 뒤에 Amazon EC2 인스턴스의 Auto Scaling 그룹을 배포하고, 30초마다 S3 버킷을 확인하여 추적 업데이트를 처리하는 cron 작업을 구성합니다."
    ],
    options_en: [
      "Create an Amazon ECS cluster with AWS Fargate tasks that continuously poll the Amazon S3 bucket for newly uploaded JSON files and write tracking updates to Amazon DynamoDB.",
      "Set up an AWS Glue ETL job scheduled to run every 5 minutes to extract new JSON files from Amazon S3, transform the tracking records, and load them into Amazon DynamoDB.",
      "Configure an Amazon S3 Event Notification to invoke an AWS Lambda function upon object creation to parse the JSON file and write the tracking data to Amazon DynamoDB.",
      "Deploy an Auto Scaling group of Amazon EC2 instances behind an Application Load Balancer with a cron job that checks the S3 bucket every 30 seconds to process tracking updates."
    ],
    answer: 2,
    explanation_ko: "**정답: 객체 생성 시 Amazon S3 이벤트 알림(Event Notification)이 AWS Lambda 함수를 호출하도록 구성하여, JSON 파일을 파싱하고 Amazon DynamoDB에 추적 데이터를 기록합니다.**\n\n- **정답인 이유:** AWS Lambda는 Amazon S3 객체 생성 이벤트 등에 반응하여 자동으로 확장 실행되는 완전 관리형 이벤트 기반 서버리스 컴퓨팅 서비스입니다. 서버 프로비저닝이나 OS 관리가 전혀 필요 없어 운영 오버헤드가 가장 적고, 1~2초 소요되는 가벼운 작업을 즉각적으로 처리하여 실시간성을 보장합니다. 또한 실제 함수 실행 시간에 대해서만 밀리초 단위로 과금되므로, 야간 등 트래픽이 없는 유휴 시간대에는 컴퓨팅 비용이 전혀 발생하지 않습니다. S3 이벤트 알림 + Lambda + DynamoDB 조합은 이러한 요구 사항에 가장 부합하는 표준 서버리스 패턴입니다.\n- **오답인 이유:**\n  - *AWS Fargate 기반 Amazon ECS 폴링:* S3를 지속적으로 폴링하는 상시 실행 컨테이너를 유지하면 유휴 시간대에도 24시간 내내 컴퓨팅 요금이 부과되며, 컨테이너 관리 및 작업 정의 등의 운영 오버헤드가 발생합니다.\n  - *AWS Glue ETL 작업:* AWS Glue는 대규모 배치 데이터 추출/변환/적재에 적합한 서비스입니다. 5분 단위 예약 실행은 준실시간 처리를 만족하지 못하며, 워커 초기화 지연 및 최소 DPU 과금 단위가 있어 1~2초짜리 개별 파일 처리에 비효율적이고 비용이 낭비됩니다.\n  - *EC2 Auto Scaling 그룹 및 cron 폴링:* EC2 인스턴스를 직접 관리하는 방식은 OS 패치, AMI 관리, Auto Scaling 정책 튜닝 등 많은 운영 오버헤드를 수반하며, 유휴 시간에도 기본 인스턴스 비용이 계속 발생합니다.",
    explanation_en: "**Correct Answer: Configure an Amazon S3 Event Notification to invoke an AWS Lambda function upon object creation to parse the JSON file and write the tracking data to Amazon DynamoDB.**\n\n- **Why it is correct:** AWS Lambda is an event-driven, fully managed serverless compute service that automatically scales in response to incoming events (such as S3 object creation notifications). It requires zero server provisioning or maintenance (least operational overhead), executes lightweight tasks (1–2 seconds) immediately with near-real-time latency, and bills only for execution duration down to the millisecond, resulting in zero compute cost during idle periods. Combining S3 Event Notifications, Lambda, and DynamoDB is the canonical serverless architecture for this pattern.\n- **Why other options are incorrect:**\n  - *ECS with Fargate continuous polling:* Running persistent container tasks to continuously poll S3 incurs ongoing baseline compute charges 24/7 even when traffic drops to zero, and adds container orchestration management overhead.\n  - *AWS Glue ETL job:* AWS Glue is designed for heavy batch data transformation. A 5-minute scheduled job introduces processing delays (violating the near-real-time requirement), takes time to spin up workers, and has minimum DPU billing increments, making it inefficient and expensive for frequent 1–2 second file processing tasks.\n  - *EC2 Auto Scaling group with cron polling:* Managing EC2 instances introduces significant operational overhead (OS patching, instance lifecycle, scaling configuration) and incurs continuous idle infrastructure costs."
  },
  {
    id: "gen19",
    service_id: "opex",
    conceptIds: ["opex"],
    domain_id: "principle",
    difficulty: "Medium",
    question_ko: "디지털 헬스케어 스타트업이 여러 제휴 병원으로부터 일일 환자 진료 기록 아카이브를 수집하는 솔루션을 설계하고 있습니다. 제휴 병원들은 SFTP 프로토콜을 사용하여 기록(CSV 및 JSON 파일)을 안전하게 업로드해야 합니다. 스타트업은 수집된 파일을 Amazon S3에 내구성 있게 저장해야 하며, 규정 준수 담당자가 HIPAA 규정 준수 감사를 위해 분기마다 아카이브 데이터에 대해 임시(ad-hoc) SQL 쿼리를 실행할 수 있도록 해야 합니다. 스타트업은 소규모 엔지니어링 팀을 보유하고 있어 운영 오버헤드(operational overhead)가 가장 적은 솔루션을 원합니다.\n\n이러한 요구 사항을 충족하는 솔루션은 무엇입니까?",
    question_en: "A digital health records startup is designing a solution to collect daily patient diagnostic archives from several partner clinics. The partner clinics require the ability to securely upload their records (CSV and JSON files) using the SFTP protocol. The startup must store the ingested files durably in Amazon S3 and enable compliance officers to execute ad-hoc SQL queries on the archival data quarterly for HIPAA compliance audits. The startup has a small engineering team and wants a solution that requires the LEAST operational overhead.\n\nWhich solution meets these requirements?",
    options_ko: [
      "업로드된 파일을 Amazon S3에 직접 저장하도록 구성된 AWS Transfer Family를 사용하여 SFTP 지원 서버를 생성합니다. Amazon Athena를 사용하여 Amazon S3에 저장된 데이터에 대해 직접 임시(ad-hoc) SQL 쿼리를 실행합니다.",
      "Amazon EC2 시작 유형을 사용하는 Amazon Elastic Container Service(Amazon ECS)에 컨테이너화된 SFTP 서비스를 배포합니다. Amazon Elastic File System(Amazon EFS) 파일 시스템을 탑재하여 수신 파일을 저장하고, 자체 관리형 PostgreSQL 컨테이너를 사용하여 기록을 쿼리합니다.",
      "Network Load Balancer 뒤에 오픈 소스 SFTP 서버를 실행하는 Amazon EC2 인스턴스의 Auto Scaling 그룹을 배포합니다. 사용자 지정 스크립트를 작성하여 파일을 Amazon S3와 동기화하고, 분기별 규정 준수 쿼리를 실행해야 할 때마다 Amazon EMR 클러스터를 시작합니다.",
      "SFTP 데몬이 구성된 Amazon EC2 인스턴스를 시작하고 연결된 Amazon EBS 볼륨에 수신 파일을 저장합니다. 예약된 cron 작업을 사용하여 규정 준수 쿼리를 위해 데이터를 Amazon RDS for PostgreSQL DB 인스턴스로 로드합니다."
    ],
    options_en: [
      "Create an SFTP-enabled server using AWS Transfer Family configured to store uploaded files directly in Amazon S3. Use Amazon Athena to run ad-hoc SQL queries directly on the data in Amazon S3.",
      "Deploy a containerized SFTP service on Amazon Elastic Container Service (Amazon ECS) using the Amazon EC2 launch type. Mount an Amazon Elastic File System (Amazon EFS) file system to store incoming files, and query the records using a self-managed PostgreSQL container.",
      "Deploy an Auto Scaling group of Amazon EC2 instances running an open-source SFTP server behind a Network Load Balancer. Write a custom script to sync files to Amazon S3, and launch an Amazon EMR cluster whenever quarterly compliance queries need to be run.",
      "Launch an Amazon EC2 instance configured with an SFTP daemon, storing incoming files on an attached Amazon EBS volume. Use a scheduled cron job to load the data into an Amazon RDS for PostgreSQL DB instance for compliance querying."
    ],
    answer: 0,
    explanation_ko: "**정답: B**\n\n**B가 정답인 이유:**\n- **AWS Transfer Family**는 Amazon S3와 원활하게 통합되는 완전관리형 서버리스 SFTP 엔드포인트를 제공합니다. 제휴 병원이 업로드한 파일은 서버 인프라를 프로비저닝, 패치 또는 확장할 필요 없이 S3 버킷에 직접 저장됩니다.\n- **Amazon Athena**는 Amazon S3에 저장된 데이터에 대해 표준 SQL 쿼리를 직접 실행할 수 있는 서버리스 대화형 쿼리 서비스입니다. 분기별 HIPAA 감사와 같은 비정기적 임시(ad-hoc) 쿼리의 경우, Athena는 인프라 관리나 별도의 ETL 파이프라인 없이 실행된 쿼리에 대해서만 비용을 지불하므로 매우 효율적입니다.\n- AWS Transfer Family, Amazon S3, Amazon Athena의 조합은 서버 관리가 전혀 필요 없는 100% 서버리스 아키텍처로 **가장 적은 운영 오버헤드(LEAST operational overhead)**를 제공합니다.\n\n**다른 보기가 오답인 이유:**\n- **A가 오답인 이유:** Auto Scaling 그룹의 EC2 인스턴스에 오픈 소스 SFTP 서버를 배포하면 지속적인 OS 패치, 용량 관리 및 S3 동기화 스크립트 유지 관리 부담이 발생합니다. 또한 단순한 임시 SQL 쿼리를 위해 Amazon EMR 클러스터를 시작하고 관리하는 것은 과도한 운영 복잡성을 유발합니다.\n- **C가 오답인 이유:** EC2 인스턴스에서 SFTP 데몬을 실행하면 서버 관리 및 OS 패치 부담이 따릅니다. 분기별로 가끔 실행되는 쿼리를 위해 cron 작업을 유지하며 RDS로 데이터를 로드하는 것은 S3에서 Athena로 직접 쿼리하는 것보다 불필요한 데이터 파이프라인 및 데이터베이스 운영 오버헤드를 초래합니다.\n- **D가 오답인 이유:** EC2 시작 유형의 Amazon ECS는 기본 EC2 컨테이너 호스트 인스턴스를 직접 관리하고 패치해야 합니다. 또한 Amazon EFS 위에 자체 관리형 PostgreSQL 컨테이너를 실행하면 데이터베이스 유지 관리, 백업 및 스토리지 구성 부담이 커져 운영 오버헤드가 증가합니다.",
    explanation_en: "**Correct Answer: B**\n\n**Why B is correct:**\n- **AWS Transfer Family** provides a fully managed, serverless, and highly available SFTP endpoint that seamlessly integrates with Amazon S3. Files uploaded by partner clinics are directly placed into S3 buckets without needing to provision, patch, or scale server infrastructure.\n- **Amazon Athena** is a serverless interactive query service that enables running standard SQL queries directly against data stored in Amazon S3. For infrequent, ad-hoc compliance queries (such as quarterly HIPAA audits), Athena requires zero infrastructure management, zero ETL pipelines, and you only pay for the queries executed.\n- Combining AWS Transfer Family, Amazon S3, and Amazon Athena produces a completely serverless solution that delivers the **LEAST operational overhead**.\n\n**Why other options are incorrect:**\n- **A is incorrect:** Deploying an open-source SFTP server on EC2 instances inside an Auto Scaling group requires ongoing OS patching, capacity management, and maintaining custom file-synchronization scripts. Furthermore, launching and configuring Amazon EMR clusters for simple ad-hoc SQL queries introduces heavy operational complexity and management overhead.\n- **C is incorrect:** Running an SFTP daemon on an EC2 instance requires self-managing the server and OS maintenance. Maintaining custom cron jobs to ingest files into Amazon RDS for quarterly queries introduces unnecessary data replication pipelines and database operational overhead compared to querying S3 directly with Athena.\n- **D is incorrect:** Using Amazon ECS with the Amazon EC2 launch type requires managing and patching the underlying EC2 host instances. Running a self-managed PostgreSQL container on Amazon EFS adds database maintenance, backup management, and storage configuration overhead."
  },
  {
    id: "gen20",
    service_id: "opex",
    conceptIds: ["opex"],
    domain_id: "principle",
    difficulty: "Medium",
    question_ko: "한 지역 항공사가 온라인 항공권 예약 플랫폼을 운영하고 있습니다. 이 항공사는 결제 유효 시간을 초과한 미확정 예약 건을 식별하여 예약 보류된 좌석을 가용 인벤토리로 다시 반환하고, 취소 요약 내역을 Amazon Simple Notification Service(Amazon SNS) 주제로 전송하는 자동화 프로세스를 15분마다 실행하고자 합니다.\n\n최소한의 운영 오버헤드(LEAST operational overhead)로 이러한 요구 사항을 충족하는 솔루션은 무엇입니까?",
    question_en: "A regional airline operates an online flight booking platform. The airline needs to implement an automated process that runs every 15 minutes to identify unconfirmed ticket reservations that have exceeded the payment time limit, release the held seats back into the available inventory, and send a cancellation summary to an Amazon Simple Notification Service (Amazon SNS) topic.\n\nWhich solution meets these requirements with the LEAST operational overhead?",
    options_ko: [
      "15분마다 AWS Lambda 함수를 호출하여 보류된 좌석 인벤토리를 반환하고 요약 내역을 Amazon SNS 주제로 게시하는 Amazon EventBridge Scheduler 규칙을 생성합니다.",
      "인벤토리 반환 스크립트를 실행하고 완료 시 종료되도록 15분마다 임시 Amazon EC2 Spot 인스턴스를 시작하는 AWS Systems Manager State Manager 연결을 설정합니다.",
      "만료된 예약을 처리하기 위해 내부 타이머 루프가 15분으로 설정된 컨테이너화된 태스크를 실행하도록 Amazon EC2 시작 유형의 Amazon ECS 서비스를 구성합니다.",
      "15분마다 인벤토리를 업데이트하고 AWS SDK를 사용하여 메시지를 게시하는 Python 스크립트를 실행하도록 Linux cron 작업이 구성된 Amazon EC2 인스턴스를 배포합니다."
    ],
    options_en: [
      "Create an Amazon EventBridge Scheduler rule that invokes an AWS Lambda function every 15 minutes to release the held seat inventory and publish the summary to the Amazon SNS topic.",
      "Set up an AWS Systems Manager State Manager association to launch a temporary Amazon EC2 Spot Instance every 15 minutes to execute the inventory release script and terminate upon completion.",
      "Configure an Amazon ECS service with an Amazon EC2 launch type that runs a containerized task with an internal timer loop set to 15 minutes to process expired reservations.",
      "Deploy an Amazon EC2 instance configured with a Linux cron job that runs a Python script every 15 minutes to update the inventory and publish messages using the AWS SDK."
    ],
    answer: 0,
    explanation_ko: "**정답: B**\n\n**B가 정답인 이유:**\n- **Amazon EventBridge Scheduler**는 서버리스 완전관리형 스케줄링 서비스로, 별도의 인프라 관리 없이 주기적인 일정(15분마다)에 따라 대상을 직접 트리거할 수 있습니다.\n- **AWS Lambda**는 서버리스 컴퓨팅 서비스로, 서버 프로비저닝이나 운영체제 패치, 인스턴스 관리 없이 이벤트에 반응하여 코드를 실행하고 자동으로 확장됩니다.\n- EventBridge Scheduler와 Lambda를 조합하면 서버 관리, OS 유지보수, 데몬 모니터링이 전혀 필요 없으므로 **가장 적은 운영 오버헤드(LEAST operational overhead)**로 요구 사항을 충족합니다.\n\n**다른 보기가 오답인 이유:**\n- **A가 오답인 이유:** EC2 인스턴스에 Linux cron 작업을 구성하는 것은 서버 프로비저닝, OS 패치, 소프트웨어 업데이트, 인스턴스 가용성 모니터링 등 지속적인 관리 부담을 발생시킵니다.\n- **C가 오답인 이유:** EC2 시작 유형의 Amazon ECS 서비스를 사용하면 기본 EC2 인스턴스를 직접 관리하고 패치해야 합니다. 또한 컨테이너 내부에서 슬립 루프를 돌리는 방식은 유휴 컴퓨팅 리소스를 낭비하며 운영 오버헤드가 큽니다.\n- **D가 오답인 이유:** Systems Manager를 통해 15분마다 EC2 Spot 인스턴스를 시작하고 종료하는 방식은 아키텍처가 불필요하게 복잡하며, 인스턴스 부팅 지연 및 스팟 중단 위험, 지속적인 관리 오버헤드가 발생합니다.",
    explanation_en: "**Correct Answer: B**\n\n**Why B is correct:**\n- **Amazon EventBridge Scheduler** is a fully managed, serverless scheduling service that can trigger targets on a cron or rate schedule (every 15 minutes) with zero infrastructure management.\n- **AWS Lambda** is a serverless compute service that runs code in response to events and automatically manages the underlying compute resources, patching, and scaling.\n- Combining EventBridge Scheduler and Lambda requires **no server provisioning, OS maintenance, software patching, or daemon management**, making it the solution with the **LEAST operational overhead**.\n\n**Why the other options are incorrect:**\n- **A is incorrect:** Running a cron job on an Amazon EC2 instance requires ongoing operational management, including provisioning, OS patching, software updates, monitoring instance health, and configuring high availability.\n- **C is incorrect:** Using an Amazon ECS service with an Amazon EC2 launch type requires provisioning, managing, and patching underlying EC2 container instances. Additionally, running a container continuously with a sleep loop wastes compute resources and introduces extra operational overhead compared to a serverless event-driven architecture.\n- **D is incorrect:** Provisioning and terminating EC2 Spot instances every 15 minutes via Systems Manager introduces significant complexity, initialization latency, instance management overhead, and potential disruption risks from Spot interruptions."
  },
  {
    id: "gen21",
    service_id: "opex",
    conceptIds: ["opex"],
    domain_id: "principle",
    difficulty: "Medium",
    question_ko: "한 모바일 게임 개발사는 수백만 건의 플레이어 매치 텔레메트리 및 이벤트 로그를 JSON 형식으로 Amazon S3 버킷에 저장하고 있습니다. 데이터 분석 팀은 게임 밸런스 및 플레이어 이탈 패턴을 분석하기 위해 수개월 치의 과거 로그를 대상으로 비정기적인 임의(ad-hoc) SQL 쿼리를 실행해야 합니다. 분석 팀은 상시 실행되는 데이터베이스 클러스터를 유지 관리하지 않고, S3에 저장된 데이터를 제자리에서 직접 조회하기를 원합니다.\n\n이러한 요구사항을 충족하면서 운영 오버헤드가 가장 적은(LEAST operational overhead) 솔루션은 무엇입니까?",
    question_en: "A mobile game studio stores raw player match telemetry and event logs in JSON format in an Amazon S3 bucket. The studio's data analysts need to execute occasional, ad-hoc SQL queries across months of historical logs to analyze game balance and player churn patterns. The analysts do not require a persistent database cluster and want to query the data in place within Amazon S3.\n\nWhich solution meets these requirements with the LEAST operational overhead?",
    options_ko: [
      "PostgreSQL이 실행되는 Amazon EC2 인스턴스를 배포하고, Amazon S3에서 JSON 파일을 다운로드하여 데이터베이스 테이블에 로드하는 정기 스크립트를 생성한 후 PostgreSQL에 대해 SQL 쿼리를 실행합니다.",
      "다중 AZ Amazon Aurora PostgreSQL DB 클러스터를 프로비저닝하고, aws_s3 확장을 사용하여 Amazon S3의 텔레메트리 데이터를 관계형 테이블로 가져온 후 Aurora 데이터베이스를 쿼리합니다.",
      "Apache Presto가 설치된 Amazon EMR 클러스터를 시작하고, Amazon S3 버킷에서 데이터를 직접 읽도록 구성한 후 쿼리 실행이 완료되면 클러스터를 종료합니다.",
      "AWS Glue Data Catalog를 사용하여 테이블 스키마를 관리하고, Amazon Athena를 사용하여 Amazon S3에 저장된 JSON 데이터를 직접 쿼리합니다."
    ],
    options_en: [
      "Deploy an Amazon EC2 instance running PostgreSQL, create a scheduled script to download the JSON files from Amazon S3 and load them into database tables, and run SQL queries against PostgreSQL.",
      "Provision a Multi-AZ Amazon Aurora PostgreSQL DB cluster, use the aws_s3 extension to import the telemetry data from Amazon S3 into relational tables, and query the Aurora database.",
      "Launch an Amazon EMR cluster with Apache Presto, configure the cluster to read data directly from the Amazon S3 bucket, and terminate the cluster after query execution.",
      "Use Amazon Athena to query the JSON data directly in Amazon S3, using the AWS Glue Data Catalog to manage the table schemas."
    ],
    answer: 3,
    explanation_ko: "**정답:** AWS Glue Data Catalog를 사용하여 테이블 스키마를 관리하고, Amazon Athena를 사용하여 Amazon S3에 저장된 JSON 데이터를 직접 쿼리합니다.\n\n**정답 해설:**\n- **Amazon Athena**는 표준 ANSI SQL을 사용하여 Amazon S3에 저장된 데이터를 제자리에서 직접 분석할 수 있는 대화형 서버리스(Serverless) 쿼리 서비스입니다. 서버리스 방식이므로 인프라 프로비저닝, OS/소프트웨어 패치, 클러스터 관리, 용량 산정이 전혀 필요 없으며, 실행한 쿼리가 스캔한 데이터양에 대해서만 비용을 지불합니다.\n- **AWS Glue Data Catalog**는 S3 데이터의 스키마와 메타데이터를 중앙에서 관리하므로 Athena와 긴밀하게 연동되어 최소한의 초기 설정만으로 즉시 쿼리를 실행할 수 있습니다.\n- 따라서 상시 실행되는 데이터베이스 클러스터를 유지할 필요 없이 비정기적인 임의(ad-hoc) 분석 요구사항을 충족하며, **운영 오버헤드를 최소화(LEAST operational overhead)**하는 최적의 솔루션입니다.\n\n**오답 해설:**\n- **Apache Presto가 설치된 Amazon EMR 클러스터:** EMR을 통해 S3 데이터를 직접 조회할 수는 있으나, EC2 노드 프로비저닝, 빅데이터 프레임워크 설정, 클러스터 수명 주기 관리 및 오토 스케일링 설정 등 상당한 인프라 관리 노력이 요구됩니다.\n- **PostgreSQL이 설치된 Amazon EC2:** AWS 운영 오버헤드 사다리에서 가장 관리 부담이 큰 자체 호스팅(Self-hosted) 방식입니다. OS 보안 패치, 데이터베이스 유지 관리, 스토리지 관리, 백업뿐 아니라 S3에서 데이터를 다운로드하고 적재하는 커스텀 ETL 스크립트까지 직접 유지보수해야 합니다.\n- **Amazon Aurora PostgreSQL 클러스터:** Aurora는 관리형 데이터베이스이지만, 인스턴스 패밀리/크기 선정, 프로비저닝, 다중 AZ 구성 및 `aws_s3` 확장을 통한 데이터 적재 파이프라인을 직접 관리해야 합니다. 비정기적인 ad-hoc 분석을 위해 RDBMS 클러스터를 운영하는 것은 불필요한 관리 오버헤드를 유발합니다.",
    explanation_en: "**Correct Answer:** Use Amazon Athena to query the JSON data directly in Amazon S3, using the AWS Glue Data Catalog to manage the table schemas.\n\n**Why this is correct:**\n- **Amazon Athena** is an interactive, serverless query service that allows you to analyze data stored directly in Amazon S3 using standard ANSI SQL. Because Athena is serverless, there is zero infrastructure to provision, manage, scale, or patch. You pay only for the data scanned by your queries.\n- **AWS Glue Data Catalog** provides a central metadata repository to store table definitions and schema metadata, allowing Athena to seamlessly query partitioned or raw datasets in S3 with minimal configuration and near-zero ongoing operational overhead.\n- This approach perfectly fulfills the requirement of running occasional ad-hoc queries without maintaining a persistent database cluster while keeping operational effort to a minimum.\n\n**Why other options are incorrect:**\n- **Amazon EMR cluster with Apache Presto:** Although EMR with Presto can query S3 data in place, it requires provisioning EC2 nodes, configuring big data frameworks, managing cluster lifecycles, and handling scaling. Even transient EMR clusters involve significant operational overhead compared to serverless Athena.\n- **Amazon EC2 with PostgreSQL:** This represents the highest operational overhead on the AWS \"overhead ladder.\" The studio would be responsible for OS patching, database software maintenance, storage volume management, and writing/maintaining custom ETL scripts to ingest files.\n- **Amazon Aurora PostgreSQL cluster:** While Aurora is a managed relational database service, it still requires provisioning and sizing database instances, configuring Multi-AZ replication, and managing recurring data ingestion tasks via the `aws_s3` extension. Maintaining an active relational cluster for occasional ad-hoc queries introduces unnecessary operational burden and cost."
  },
  {
    id: "gen22",
    service_id: "opex",
    conceptIds: ["opex"],
    domain_id: "principle",
    difficulty: "Medium",
    question_ko: "한 대학교에서 학생들이 과제 및 프로젝트 파일을 Amazon S3 버킷에 제출할 수 있는 온라인 학습 포털을 운영하고 있습니다. 새로운 파일이 업로드될 때마다 시스템은 파일 형식을 검증하고, 유해 콘텐츠 여부를 검사하며, 미리보기 썸네일을 생성한 후 메타데이터를 데이터베이스에 저장해야 합니다. 과제 제출량은 학기 말 마감 직전에 극심하게 급증하지만 방학 기간에는 거의 발생하지 않습니다.\n\n솔루션스 아키텍트는 과제 제출 급증에 맞춰 자동으로 확장되고 운영 오버헤드(operational overhead)가 가장 적은 자동화된 처리 파이프라인을 설계해야 합니다.\n\n이러한 요구 사항을 충족하는 솔루션은 무엇입니까?",
    question_en: "A university operates an online learning portal where students submit digital assignments and project files to an Amazon S3 bucket. Whenever a new file is uploaded, the system must validate the file format, scan the document for prohibited content, generate preview thumbnails, and store metadata in a database. Assignment submissions experience extreme spikes right before deadlines at the end of academic terms, but remain almost idle during vacation periods.\n\nA solutions architect needs to design an automated processing pipeline that scales automatically to handle submission surges and requires the LEAST operational overhead.\n\nWhich solution meets these requirements?",
    options_ko: [
      "2분마다 S3 버킷에서 새 파일 업로드를 검색하도록 cron 작업이 예약된 Amazon EC2 인스턴스를 프로비저닝하고, 로컬에서 처리 스크립트를 실행한 후 Amazon RDS for MySQL 데이터베이스에 메타데이터를 저장합니다.",
      "Network Load Balancer 뒤에 Amazon EC2 인스턴스로 구성된 Auto Scaling 그룹을 배포합니다. 인스턴스에 커스텀 워커 서비스를 설치하여 S3 버킷을 주기적으로 폴링하고, 멀티스레드 배치 소프트웨어로 파일을 처리한 후 Amazon Aurora DB 클러스터에 메타데이터를 저장합니다.",
      "업로드 이벤트를 Amazon Simple Queue Service(Amazon SQS) 대기열로 보내도록 Amazon S3 이벤트 알림을 구성합니다. SQS 대기열에 의해 트리거되는 AWS Lambda 함수를 사용하여 파일을 처리하고 Amazon DynamoDB 테이블에 메타데이터를 저장합니다.",
      "자체 관리형(self-managed) 워커 노드가 있는 Amazon Elastic Kubernetes Service(Amazon EKS) 클러스터를 생성합니다. 업로드 웹훅을 수신하는 컨테이너화된 워커 파드(Pod)를 실행하여 처리 컨테이너를 구동하고, Amazon EC2의 자체 호스팅 PostgreSQL 데이터베이스에 메타데이터를 기록합니다."
    ],
    options_en: [
      "Provision an Amazon EC2 instance configured with a scheduled cron task that scans the S3 bucket every 2 minutes for new file uploads, executes processing scripts locally, and stores metadata in an Amazon RDS for MySQL database.",
      "Deploy an Auto Scaling group of Amazon EC2 instances behind a Network Load Balancer. Install custom worker services on the instances that periodically poll the S3 bucket, process files using multi-threaded batch software, and save metadata to an Amazon Aurora DB cluster.",
      "Configure Amazon S3 Event Notifications to send upload events to an Amazon Simple Queue Service (Amazon SQS) queue. Use an AWS Lambda function triggered by the SQS queue to process the files and store the metadata in an Amazon DynamoDB table.",
      "Create an Amazon Elastic Kubernetes Service (Amazon EKS) cluster with self-managed worker nodes. Run containerized worker pods that listen for upload webhooks, execute processing containers, and record metadata in a self-hosted PostgreSQL database on Amazon EC2."
    ],
    answer: 2,
    explanation_ko: "**정답: Option C** (업로드 이벤트를 Amazon Simple Queue Service(Amazon SQS) 대기열로 보내도록 Amazon S3 이벤트 알림을 구성합니다. SQS 대기열에 의해 트리거되는 AWS Lambda 함수를 사용하여 파일을 처리하고 Amazon DynamoDB 테이블에 메타데이터를 저장합니다.)\n\n**해설:**\nAWS 시험에서 **\"운영 오버헤드 최소화(least operational overhead)\"**가 핵심 조건으로 제시될 경우, 서버 프로비저닝, OS 패치, 용량 계획 및 인프라 모니터링 부담이 없는 서버리스(Serverless) 및 완전 관리형(Fully Managed) 아키텍처가 최우선 정답이 됩니다.\n\n- **Amazon S3 이벤트 알림 + Amazon SQS + AWS Lambda**: 완전 서버리스 이벤트 기반 아키텍처로, 방학 기간에는 리소스 사용량이 0으로 축소되고 마감 직전 트래픽 급증 시에는 수천 개의 동시 실행으로 자동 확장됩니다. SQS는 급격한 제출 트래픽을 완충(버퍼링)하여 요청 유실을 방지하고, Lambda는 이벤트 발생 시에만 코드를 실행하므로 서버 패치나 인프라 유지 관리가 전혀 필요하지 않습니다.\n- **Amazon DynamoDB**: 완전 관리형 서버리스 NoSQL 데이터베이스로, 인스턴스 패치, 유지 관리 윈도우, 스토리지 용량 관리 없이 자동 확장과 고가용성을 기본 제공하므로 운영 부담이 가장 적습니다.\n\n**오답 분석:**\n- **Option A가 오답인 이유**: 단일 EC2 인스턴스와 cron 폴링 스크립트를 사용하면 OS 패치, 인스턴스 모니터링, 단일 장애점(SPOF) 관리 등 상당한 운영 오버헤드가 발생하며, 마감 직전의 급증하는 트래픽을 유연하게 처리할 수 없습니다.\n- **Option B가 오답인 이유**: EC2 Auto Scaling 그룹을 유지하려면 AMI 생성, OS 패치 주기 관리, 오토스케일링 정책 튜닝 등의 지속적인 관리가 필요합니다. 또한 S3를 주기적으로 폴링하는 커스텀 소프트웨어는 내장된 서버리스 이벤트 트리거 방식보다 운영 부담이 훨씬 큽니다.\n- **Option D가 오답인 이유**: Amazon EKS 클러스터를 운영하면 쿠버네티스 버전 업그레이드, 노드 수명 주기 관리, 파드 배포 관리 등의 관리 작업이 필요합니다. 더욱이 EC2에 자체 호스팅 PostgreSQL을 구축하는 것은 백업, OS/DB 패치, 복제 및 장애 조치(failover)를 직접 수동 관리해야 하므로 보기 중 가장 높은 운영 오버헤드를 발생시킵니다.",
    explanation_en: "**Correct Answer: Option C** (Configure Amazon S3 Event Notifications to send upload events to an Amazon Simple Queue Service (Amazon SQS) queue. Use an AWS Lambda function triggered by the SQS queue to process the files and store the metadata in an Amazon DynamoDB table.)\n\n**Explanation:**\nWhen an AWS exam question specifies **\"least operational overhead\"**, serverless and fully managed architectures are the primary choice because they eliminate the need to provision, patch, monitor, and manage underlying infrastructure.\n\n- **Amazon S3 Event Notifications + Amazon SQS + AWS Lambda**: This serverless event-driven architecture automatically scales from zero during vacation periods to thousands of concurrent executions during deadline surges. SQS acts as a resilient buffer to absorb sudden burst traffic without dropping submissions. Lambda executes code only when events are received, eliminating server provisioning, OS patching, and capacity planning.\n- **Amazon DynamoDB**: As a fully managed serverless NoSQL database, DynamoDB handles provisioning, replication, scaling, and high availability automatically without requiring database engine patching, maintenance windows, or instance upgrades.\n\n**Why other options are incorrect:**\n- **Option A is incorrect**: Relying on a single Amazon EC2 instance with a cron polling script introduces significant operational overhead (OS patching, monitoring, script maintenance) and creates a single point of failure (SPOF) that cannot scale during deadline peaks.\n- **Option B is incorrect**: Using an Auto Scaling group of EC2 instances requires defining and maintaining AMIs, launch templates, OS patching cycles, and scaling policies. Polling S3 via custom software requires ongoing maintenance and custom error handling compared to built-in serverless event integrations.\n- **Option D is incorrect**: Operating an Amazon EKS cluster involves managing Kubernetes control plane upgrades, worker node lifecycles, and pod manifests. Additionally, running a self-hosted PostgreSQL database on EC2 requires manual backups, OS/database patching, replication setup, and failover management, which represents the highest operational overhead among all options."
  },
  {
    id: "gen23",
    service_id: "rds",
    conceptIds: ["rds"],
    domain_id: "database",
    difficulty: "Medium",
    question_ko: "한 헬스케어 스타트업이 Multi-AZ 배포로 구성된 Amazon RDS for PostgreSQL DB 인스턴스를 백엔드로 사용하는 전자의무기록(EHR) 애플리케이션을 운영하고 있습니다. 최근 사용량이 많은 오전 시간대에 의료진이 실시간 환자 생체 신호(vitals)를 저장할 때 심각한 지연 현상이 발생하고 있습니다. 원인을 분석한 결과, 동일한 시간대에 임상 연구원과 관리자들이 대규모 분석 보고서 및 과거 환자 차트 조회를 실행하여 데이터베이스의 CPU 사용률이 급증한 것으로 확인되었습니다.\n\n솔루션스 아키텍트(Solutions Architect)는 고가용성을 유지하면서 관리 오버헤드를 최소화하고, 환자 데이터 업데이트 시 발생하는 성능 병목 현상을 해결해야 합니다.\n\n솔루션스 아키텍트가 권장해야 하는 가장 적절한 방안은 무엇입니까?",
    question_en: "A healthcare technology startup manages an Electronic Health Records (EHR) application whose backend uses an Amazon RDS for PostgreSQL DB instance configured in a Multi-AZ deployment. Recently, clinic staff members have experienced severe latency when saving real-time patient vitals during peak morning hours. Investigation reveals that clinical researchers and administrators are generating heavy analytical reports and historical patient charts at the same time, causing high CPU utilization on the database.\n\nA solutions architect must resolve the performance bottleneck for patient updates while maintaining high availability and minimizing administrative overhead.\n\nWhich solution should the solutions architect recommend?",
    options_ko: [
      "Multi-AZ 구성을 수정하여 들어오는 모든 읽기 전용 보고서 쿼리를 기존 대기(Standby) 인스턴스로 직접 라우팅하도록 설정한다.",
      "Amazon RDS 읽기 전용 복제본(Read Replica)을 배포하고, 보고서 서비스가 읽기 쿼리를 복제본 엔드포인트로 전송하도록 구성한다.",
      "관계형 EHR 데이터베이스를 Amazon DynamoDB 테이블로 마이그레이션하고, 보고서 쿼리 부하를 줄이기 위해 글로벌 보조 인덱스(GSI)를 생성한다.",
      "기본 DB 인스턴스를 더 큰 컴퓨팅 인스턴스 클래스로 스케일 업(Scale-up)하고, 읽기 IOPS를 두 배로 늘리기 위해 자동 백업을 활성화한다."
    ],
    options_en: [
      "Modify the Multi-AZ configuration to route all incoming read-only reporting queries directly to the existing standby replica instance.",
      "Deploy Amazon RDS Read Replicas and configure the reporting service to direct read queries to the read replica endpoints.",
      "Migrate the relational EHR database to an Amazon DynamoDB table and create Global Secondary Indexes (GSIs) to offload reporting queries.",
      "Scale up the primary DB instance to a larger compute instance class and enable automated backups to double the read IOPS."
    ],
    answer: 1,
    explanation_ko: "### 정답\n**Amazon RDS 읽기 전용 복제본(Read Replica)을 배포하고, 보고서 서비스가 읽기 쿼리를 복제본 엔드포인트로 전송하도록 구성한다.**\n\n### 정답 해설\n- **Amazon RDS 읽기 전용 복제본(Read Replica)**은 기본(Primary) DB 인스턴스로부터 비동기식으로 데이터를 복제하여 읽기 집약적인 워크로드를 분산하고 처리 성능을 확장(Scale-out)합니다. 분석 보고서 및 차트 조회 쿼리를 읽기 전용 복제본의 엔드포인트로 분리하면, 기본 DB 인스턴스의 부하가 줄어들어 실시간 환자 생체 신호 기록(쓰기 작업) 시 발생하는 지연 현상을 효과적으로 해소할 수 있습니다.\n- 기본 DB의 **Multi-AZ 배포**를 유지함으로써 장애 발생 시 자동 장애 조치(Failover)를 통한 고가용성(HA) 요건도 완벽하게 충족합니다.\n\n### 오답 분석\n- **Multi-AZ 구성을 수정하여 들어오는 모든 읽기 전용 보고서 쿼리를 기존 대기(Standby) 인스턴스로 직접 라우팅하도록 설정한다**: 표준 Amazon RDS Multi-AZ 배포의 대기 인스턴스는 동기식 복제를 기반으로 고가용성 및 페일오버를 지원하는 용도이며, 클라이언트의 직접적인 읽기/쓰기 연결을 허용하지 않습니다.\n- **관계형 EHR 데이터베이스를 Amazon DynamoDB 테이블로 마이그레이션하고, 보고서 쿼리 부하를 줄이기 위해 글로벌 보조 인덱스(GSI)를 생성한다**: 관계형 데이터베이스를 NoSQL로 전면 마이그레이션하는 것은 대규모 스키마 재설계와 애플리케이션 수정을 동반하므로 관리 오버헤드를 최소화한다는 요구사항에 맞지 않습니다.\n- **기본 DB 인스턴스를 더 큰 컴퓨팅 인스턴스 클래스로 스케일 업(Scale-up)하고, 읽기 IOPS를 두 배로 늘리기 위해 자동 백업을 활성화한다**: 수직 확장(Scale-up)은 고비용이 발생하며 분석 쿼리와 트랜잭션 쓰기 워크로드가 여전히 동일 인스턴스에서 경합하는 근본적인 원인을 해결하지 못합니다. 또한 자동 백업 활성화는 시점 복구(PITR)를 위한 기능일 뿐 읽기 IOPS를 증가시키지 않습니다.",
    explanation_en: "### Correct Answer\n**Deploy Amazon RDS Read Replicas and configure the reporting service to direct read queries to the read replica endpoints.**\n\n### Explanation\n- **Amazon RDS Read Replicas** provide read scalability by asynchronously replicating data from the primary DB instance. By offloading intensive analytics and historical reporting queries to one or more Read Replicas, the primary DB instance is freed up to handle real-time write operations (such as saving patient vitals) without CPU saturation or latency spikes.\n- Retaining the **Multi-AZ deployment** on the primary instance ensures high availability with automatic failover, fulfilling both performance and reliability requirements.\n\n### Distractor Analysis\n- **Modify the Multi-AZ configuration to route all incoming read-only reporting queries directly to the existing standby replica instance**: In standard Amazon RDS Multi-AZ deployments, the standby instance is used strictly for high availability and disaster recovery via synchronous replication. It does not accept read or write connections.\n- **Migrate the relational EHR database to an Amazon DynamoDB table and create Global Secondary Indexes (GSIs) to offload reporting queries**: Migrating an entire relational database to NoSQL involves substantial data modeling, schema changes, and application refactoring, introducing significant administrative overhead.\n- **Scale up the primary DB instance to a larger compute instance class and enable automated backups to double the read IOPS**: Vertical scaling increases operational cost and does not isolate heavy analytical queries from transactional writes. Furthermore, automated backups provide point-in-time recovery and do not increase read IOPS."
  },
  {
    id: "gen24",
    service_id: "rds",
    conceptIds: ["rds"],
    domain_id: "database",
    difficulty: "Medium",
    question_ko: "한 지역 항공사가 단일 가용 영역(Single-AZ)에 배포된 Amazon RDS for PostgreSQL 데이터베이스를 기반으로 항공권 예약 웹 애플리케이션을 운영하고 있습니다. 계절별 특가 프로모션 기간 동안 수백만 명의 사용자가 항공편 및 좌석 가용성을 검색하면서 데이터베이스에 대한 읽기 전용 쿼리가 급증했습니다. 이로 인해 기본 데이터베이스의 CPU 사용률이 90%를 초과하여 결제 및 예약 확정과 같은 중요한 트랜잭션 처리가 지연되고 있습니다. 또한, 항공사는 가용 영역 장애 시 가동 중지 시간을 최소화하기 위해 자동 장애 조치(failover)를 지원하는 고가용성을 요구하고 있습니다.\n\n데이터베이스 성능 문제를 해결하고 고가용성 요구 사항을 충족하기 위해 솔루션 아키텍트가 권장해야 하는 솔루션은 무엇입니까?",
    question_en: "A regional airline operates a flight reservation web application backed by an Amazon RDS for PostgreSQL database deployed in a single Availability Zone. During seasonal promotional fare campaigns, millions of users search for flights and seat availability, resulting in a dramatic increase in read-only database queries. This read traffic surge causes the primary database CPU utilization to exceed 90%, delaying critical ticket booking transactions. The airline also requires high availability with automated failover across Availability Zones to minimize downtime.\n\nWhich solution should a solutions architect recommend to resolve the database performance bottleneck and satisfy the availability requirement?",
    options_ko: [
      "여러 가용 영역에 Amazon RDS 읽기 전용 복제본을 배포합니다. 가용 영역 장애 발생 시 읽기 전용 복제본 중 하나를 기본 인스턴스로 자동 승격하도록 Amazon Route 53 상태 확인 및 라우팅 정책을 구성합니다.",
      "RDS DB 인스턴스를 Multi-AZ 배포로 수정합니다. 트래픽 부하를 분산하기 위해 읽기 전용 항공편 검색 쿼리를 대기(standby) 데이터베이스 인스턴스 엔드포인트로 라우팅하도록 애플리케이션을 구성합니다.",
      "RDS DB 인스턴스를 프로비저닝된 IOPS SSD(io2) 스토리지를 사용하는 더 큰 인스턴스 유형으로 확장합니다. 고가용성 및 장애 조치를 관리하기 위해 Multi-AZ 자동 스냅샷을 활성화합니다.",
      "자동 장애 조치를 위해 RDS DB 인스턴스를 Multi-AZ 배포로 수정합니다. Amazon RDS 읽기 전용 복제본(Read Replica)을 생성하고, 읽기 전용 항공편 검색 쿼리를 읽기 전용 복제본 엔드포인트로 전송하도록 애플리케이션을 구성합니다."
    ],
    options_en: [
      "Deploy Amazon RDS Read Replicas across multiple Availability Zones. Configure an Amazon Route 53 health check and routing policy to automatically promote a read replica to the primary instance during an outage.",
      "Modify the RDS DB instance to a Multi-AZ deployment. Configure the application to route read-only flight search queries to the standby database instance endpoint to balance traffic.",
      "Scale up the RDS DB instance to a larger compute instance class with Provisioned IOPS SSD (io2) storage. Enable Multi-AZ Automated Snapshots to manage high availability and failover.",
      "Modify the RDS DB instance to a Multi-AZ deployment for automated failover. Create Amazon RDS Read Replicas and configure the application to direct read-only flight search queries to the read replica endpoints."
    ],
    answer: 3,
    explanation_ko: "**정답: 자동 장애 조치를 위해 RDS DB 인스턴스를 Multi-AZ 배포로 수정합니다. Amazon RDS 읽기 전용 복제본(Read Replica)을 생성하고, 읽기 전용 항공편 검색 쿼리를 읽기 전용 복제본 엔드포인트로 전송하도록 애플리케이션을 구성합니다.**\n\n**정답 해설:**\n- **Amazon RDS Multi-AZ 배포**는 다른 가용 영역에 동기식 대기(standby) 복제본을 유지하여 고가용성 및 자동 장애 조치(Automated Failover)를 제공합니다. 기본 인스턴스에 장애가 발생하면 관리자의 수동 개입 없이 RDS가 자동으로 DNS를 대기 인스턴스로 전환합니다.\n- **Amazon RDS 읽기 전용 복제본(Read Replica)**은 비동기식 복제를 통해 항공편 및 좌석 검색과 같은 읽기 집약적인 트래픽을 기본 데이터베이스로부터 분리(offload)합니다. 이를 통해 기본 인스턴스의 CPU 부하를 줄이고 티켓 예약/결제와 같은 핵심 쓰기 트랜잭션을 원활하게 처리할 수 있습니다.\n\n**오답 해설:**\n- **보기 1번이 오답인 이유:** 표준 Amazon RDS Multi-AZ 배포에서 대기(standby) 인스턴스는 클라이언트의 읽기 트래픽을 수신하거나 처리할 수 없습니다. 오직 장애 조치(Failover) 용도로만 사용됩니다.\n- **보기 2번이 오답인 이유:** 인스턴스 크기를 수직 확장(Scale-up)하는 것은 읽기와 쓰기 부하를 근본적으로 분리하지 못하며, \"Multi-AZ 자동 스냅샷\"이라는 자동 장애 조치 기능은 존재하지 않습니다.\n- **보기 4번이 오답인 이유:** 읽기 전용 복제본은 주로 읽기 성능 확장을 목적으로 합니다. Route 53을 통해 복제본을 기본 인스턴스로 승격하는 방식은 비동기 복제 지연으로 인한 데이터 유실 위험이 있고 아키텍처가 복잡해지며, AWS가 권장하는 기본 고가용성 솔루션은 Multi-AZ 배포입니다.",
    explanation_en: "**Correct Answer: Modify the RDS DB instance to a Multi-AZ deployment for automated failover. Create Amazon RDS Read Replicas and configure the application to direct read-only flight search queries to the read replica endpoints.**\n\n**Why this is correct:**\n- **Amazon RDS Multi-AZ deployments** provide high availability and automated failover by synchronously replicating data to a standby instance in a different Availability Zone (AZ). If the primary instance fails, RDS automatically changes the DNS record to point to the standby replica with zero manual intervention required.\n- **Amazon RDS Read Replicas** offload read-intensive queries (such as flight and seat availability searches) from the primary database using asynchronous replication. This frees up the primary database's CPU and I/O resources to process critical booking write transactions efficiently.\n\n**Why the distractors are incorrect:**\n- **Option 1 is incorrect:** In a standard Amazon RDS Multi-AZ deployment, the standby instance cannot serve read traffic; it is solely used for synchronous failover.\n- **Option 2 is incorrect:** Scaling up the instance vertically does not address the architectural need to separate read and write workloads. Furthermore, \"Multi-AZ Automated Snapshots\" is not an automated failover feature.\n- **Option 4 is incorrect:** RDS Read Replicas are primarily intended for read scalability. Relying on custom Route 53 health checks and manual/scripted replica promotion introduces complexity and risk of data loss due to asynchronous replication lag, whereas Multi-AZ provides seamless native synchronous failover."
  },
  {
    id: "gen25",
    service_id: "rds",
    conceptIds: ["rds"],
    domain_id: "database",
    difficulty: "Medium",
    question_ko: "한 모바일 게임 개발사가 온라인 롤플레잉 게임을 위한 백엔드 서비스를 AWS에서 운영하고 있습니다. 애플리케이션 계층은 Application Load Balancer 뒤의 Amazon EC2 인스턴스에서 실행되며, 단일 가용 영역(Single-AZ)에 배포된 Amazon RDS for MySQL 데이터베이스에 연결됩니다.\n\n최대 동시 접속 시간 동안 플레이어 프로필 및 리더보드 조회를 위한 대량의 읽기 쿼리로 인해 데이터베이스 CPU 사용률이 급증하여 인게임 아이템 구매 및 결제 관련 쓰기 작업이 지연되고 있습니다. 또한, 최근 발생한 하드웨어 장애 당시 데이터베이스를 스냅샷에서 수동으로 복구해야 했기 때문에 상당한 서비스 중단 시간이 발생했습니다.\n\n솔루션스 아키텍트(Solutions Architect)는 읽기 성능을 개선하고 장애 발생 시 최소한의 다운타임으로 자동 장애 조치(failover)가 가능하도록 데이터베이스 아키텍처를 재설계해야 합니다.\n\n이러한 요구 사항을 충족하는 솔루션은 무엇입니까?",
    question_en: "A mobile game studio operates a backend service on AWS for an online role-playing game. The application layer runs on Amazon EC2 instances behind an Application Load Balancer and connects to an Amazon RDS for MySQL database deployed in a single Availability Zone.\n\nDuring peak gaming hours, the database experiences high CPU utilization because of an overwhelming volume of read queries for player profiles and leaderboards, which delays in-game purchase writes. Furthermore, the studio experienced significant downtime during a recent hardware failure because the database required manual restoration from a snapshot.\n\nA solutions architect must redesign the database architecture to improve read performance and ensure automated failover with minimal downtime.\n\nWhich solution meets these requirements?",
    options_ko: [
      "Amazon RDS DB 인스턴스에 다중 AZ(Multi-AZ) 배포를 활성화합니다. 읽기 트래픽 부하를 줄이기 위해 기본(Primary) 인스턴스와 동기식 대기(Standby) 인스턴스 간에 읽기 쿼리를 분산하도록 애플리케이션을 구성합니다.",
      "Amazon RDS DB 인스턴스에 다중 AZ(Multi-AZ) 배포를 활성화합니다. Amazon RDS 읽기 전용 복제본(Read Replica)을 생성하고, 읽기 쿼리는 읽기 전용 복제본 엔드포인트로 전송하고 쓰기 쿼리는 기본(Primary) 인스턴스 엔드포인트로 전송하도록 애플리케이션을 수정합니다.",
      "Amazon RDS DB 인스턴스를 프로비저닝된 IOPS SSD(io2) 스토리지를 사용하는 더 큰 인스턴스 유형으로 확장합니다. 장애 발생 시 자동 장애 조치를 처리할 수 있도록 RPO 1분의 자동 백업을 활성화합니다.",
      "두 번째 가용 영역에 Amazon RDS 읽기 전용 복제본(Read Replica)을 생성합니다. 애플리케이션이 읽기 및 쓰기 작업 모두에 읽기 전용 복제본 엔드포인트를 사용하도록 구성하고, 장애 발생 시 자동 동기식 장애 조치에 읽기 전용 복제본을 활용합니다."
    ],
    options_en: [
      "Enable Multi-AZ deployment for the Amazon RDS DB instance. Configure the application to distribute read queries between the primary instance and the synchronous standby instance to offload read traffic.",
      "Enable Multi-AZ deployment for the Amazon RDS DB instance. Create Amazon RDS read replicas and update the application to direct read queries to the read replica endpoints while sending write queries to the primary endpoint.",
      "Scale up the Amazon RDS DB instance to a larger instance class with Provisioned IOPS SSD (io2) storage. Enable automated backups with a 1-minute RPO to handle automated failover during an outage.",
      "Create an Amazon RDS read replica in a second Availability Zone. Configure the application to use the read replica endpoint for reads and writes, and rely on the read replica for automated synchronous failover."
    ],
    answer: 1,
    explanation_ko: "**정답:** Amazon RDS DB 인스턴스에 다중 AZ(Multi-AZ) 배포를 활성화합니다. Amazon RDS 읽기 전용 복제본(Read Replica)을 생성하고, 읽기 쿼리는 읽기 전용 복제본 엔드포인트로 전송하고 쓰기 쿼리는 기본(Primary) 인스턴스 엔드포인트로 전송하도록 애플리케이션을 수정합니다.\n\n**해설:**\n- **Amazon RDS 다중 AZ(Multi-AZ) 배포**는 고가용성(High Availability) 및 재해 복구를 목적으로 설계되었습니다. 다른 가용 영역(AZ)에 있는 대기(Standby) 인스턴스로 데이터를 동기식(Synchronous)으로 복제하며, 기본 인스턴스나 AZ에 장애가 발생하면 DNS 장애 조치(Failover)를 통해 자동으로 대기 인스턴스로 전환되어 다운타임을 최소화합니다. 단, 표준 다중 AZ 배포의 대기 인스턴스는 패시브 상태로 유지되므로 읽기 트래픽을 처리할 수 없습니다.\n- **Amazon RDS 읽기 전용 복제본(Read Replica)**은 읽기 성능 향상 및 수평적 읽기 확장을 위해 사용됩니다. 기본 인스턴스로부터 비동기식(Asynchronous)으로 복제되며, 프로필 조회나 리더보드와 같은 읽기 집약적 쿼리를 복제본 엔드포인트로 라우팅하여 기본 인스턴스의 CPU 부하를 줄이고 인게임 결제 등 핵심 쓰기 작업의 지연을 해소합니다.\n\n**오답 분석:**\n- *다중 AZ 대기(Standby) 인스턴스로 읽기 트래픽을 분산하는 방안*은 대표적인 함정 선지입니다. 표준 다중 AZ의 대기 인스턴스는 읽기/쓰기 연결을 전혀 허용하지 않습니다.\n- *인스턴스 스케일업 및 자동 백업 활성화 방안*은 단일 장애점(SPOF) 문제를 해결하지 못하며, 백업은 시점 복구(PITR)를 위한 수단일 뿐 즉각적인 무중단 자동 장애 조치 메커니즘이 아닙니다.\n- *읽기 전용 복제본을 쓰기 및 자동 동기식 장애 조치에 사용하는 방안*은 읽기 전용 복제본이 읽기 전용(Read-only)이고 비동기식으로 복제되기 때문에 잘못되었습니다. 고가용성 자동 장애 조치는 Multi-AZ의 역할입니다.",
    explanation_en: "**Correct Answer:** Enable Multi-AZ deployment for the Amazon RDS DB instance. Create Amazon RDS read replicas and update the application to direct read queries to the read replica endpoints while sending write queries to the primary endpoint.\n\n**Explanation:**\n- **Amazon RDS Multi-AZ Deployments** are designed strictly for high availability and disaster recovery. Data is synchronously replicated to a standby instance in a different Availability Zone (AZ). If a hardware or AZ failure occurs, RDS automatically swings DNS to the standby instance with minimal downtime. Crucially, the standby instance in a standard Multi-AZ configuration is passive and cannot serve read traffic.\n- **Amazon RDS Read Replicas** are designed for performance and horizontal read scalability. They replicate asynchronously from the primary instance and accept read-only connections. Directing read-heavy workloads (such as player profile lookups and global leaderboards) to read replica endpoints offloads CPU load from the primary instance, ensuring write operations (such as in-game purchases) perform smoothly.\n\n**Distractor Analysis:**\n- *Distributing read queries to the synchronous Multi-AZ standby instance* is a classic misconception. Standard RDS Multi-AZ standby instances do not accept any client connections (neither read nor write).\n- *Scaling up the instance class and relying on automated backups* does not provide automated failover or horizontal read scaling. Backups and snapshots are for point-in-time recovery and disaster recovery, not instantaneous automated failover.\n- *Using a read replica for writes and automated synchronous failover* is incorrect because read replicas are read-only and replicate asynchronously; they do not replace Multi-AZ automated failover."
  },
  {
    id: "gen26",
    service_id: "rds",
    conceptIds: ["rds"],
    domain_id: "database",
    difficulty: "Medium",
    question_ko: "한 대학교가 AWS에서 온라인 학습 포털을 운영하고 있습니다. 웹 계층은 Application Load Balancer 뒤의 Auto Scaling 그룹에 속한 Amazon EC2 인스턴스로 구성되며, 데이터베이스 계층은 단일 가용 영역(Single-AZ)의 Amazon RDS for MySQL DB 인스턴스를 사용합니다. 기말시험 및 강의 평가 기간 동안 학생들이 강의 자료를 조회하고 성적을 확인하면서 대규모 읽기 전용 트래픽이 발생합니다. 이로 인해 데이터베이스 CPU 사용률이 90%를 초과하여 애플리케이션 응답 속도가 크게 저하됩니다. 또한 최근 예정되었던 데이터베이스 유지 관리 작업 중 포털 서비스가 중단되는 문제가 발생했습니다.\n\n솔루션 아키텍트는 최소한의 운영 오버헤드로 읽기 성능을 개선하고, 유지 관리 또는 장애 발생 시 자동 장애 조치(Failover)를 통해 고가용성을 보장하는 아키텍처를 설계해야 합니다.\n\n이러한 요구 사항을 충족하는 솔루션은 무엇입니까?",
    question_en: "A university hosts its online learning portal on AWS. The web tier consists of Amazon EC2 instances in an Auto Scaling group behind an Application Load Balancer, and the database tier uses a single-AZ Amazon RDS for MySQL DB instance. During the final examination and course evaluation period, the portal experiences a massive surge in read-only traffic as students review course materials and check grades. This read traffic causes the database CPU utilization to exceed 90%, degrading application performance. In addition, recent scheduled database maintenance caused unexpected downtime for students.\n\nA solutions architect must design a solution that improves read performance and ensures high availability with automated failover during maintenance or outages, with minimal operational overhead.\n\nWhich solution meets these requirements?",
    options_ko: [
      "기본 Amazon RDS DB 인스턴스를 Multi-AZ 배포로 변환합니다. 학습 포털 애플리케이션을 업데이트하여 보조 대기(standby) DB 인스턴스의 엔드포인트로 읽기 전용 쿼리를 전송하도록 구성합니다.",
      "데이터베이스를 MySQL이 실행되는 Amazon EC2 인스턴스로 마이그레이션합니다. 읽기 요청을 분산하고 장애 조치를 관리하기 위해 두 개의 가용 영역에 걸쳐 MySQL 마스터-슬레이브 비동기 복제를 구성합니다.",
      "여러 가용 영역에 걸쳐 Amazon RDS 읽기 전용 복제본을 생성합니다. 포털 다운타임을 방지하기 위해 계획된 유지 관리 기간 동안 읽기 전용 복제본으로 자동 동기 장애 조치가 수행되도록 구성합니다.",
      "Amazon RDS DB 인스턴스를 Multi-AZ 배포로 수정합니다. Amazon RDS 읽기 전용 복제본(Read Replica)을 배포하고, 읽기 전용 쿼리를 읽기 전용 복제본 엔드포인트로 라우팅하도록 학습 포털 애플리케이션을 구성합니다."
    ],
    options_en: [
      "Convert the primary Amazon RDS DB instance to a Multi-AZ deployment. Update the learning portal application to direct read-only queries to the secondary standby DB instance's endpoint.",
      "Migrate the database to an Amazon EC2 instance running MySQL. Configure MySQL Master-Slave asynchronous replication across two Availability Zones to balance read requests and manage failovers.",
      "Create Amazon RDS Read Replicas across multiple Availability Zones. Configure automated synchronous failover to the read replicas during planned maintenance windows to prevent portal downtime.",
      "Modify the Amazon RDS DB instance to a Multi-AZ deployment. Deploy Amazon RDS Read Replicas and configure the learning portal application to route read-only queries to the read replica endpoints."
    ],
    answer: 3,
    explanation_ko: "### 정답 분석:\n- **선택지 3이 정답입니다**: Amazon RDS Multi-AZ 배포는 다른 가용 영역(AZ)에 예비(Standby) 인스턴스를 동기식으로 유지 관리합니다. 정기 유지 관리(OS 및 DB 엔진 패치 등) 또는 가용 영역 장애 발생 시 DNS가 대기 인스턴스로 자동 전환(Failover)되어 가동 중단을 방지하고 고가용성을 보장합니다. 동시에 Amazon RDS 읽기 전용 복제본(Read Replica)을 배포하여 강의 자료 조회 및 성적 확인과 같은 대규모 읽기 전용 쿼리를 분산 처리함으로써, 최소한의 운영 오버헤드로 기본 DB의 CPU 부하를 해소하고 읽기 성능을 대폭 향상시킬 수 있습니다.\n\n### 오답 분석:\n- **선택지 1 (오답)**: Amazon EC2에 MySQL을 직접 설치하여 마스터-슬레이브 복제 및 장애 조치를 구성하는 방식은 패치, 백업, 복제 모니터링 및 복구 관리 등 막대한 운영 오버헤드를 발생시키므로 \"최소한의 운영 오버헤드\" 요구사항에 부합하지 않습니다.\n- **선택지 2 (오답)**: 표준 Amazon RDS Multi-AZ 배포의 대기(Standby) 인스턴스는 장애 조치 전용으로 동작하며, 읽기 쿼리를 처리할 수 없고 읽기 엔드포인트도 제공하지 않습니다.\n- **선택지 4 (오답)**: Amazon RDS 읽기 전용 복제본은 비동기 복제를 기반으로 읽기 성능을 확장하기 위한 기능이며, 유지 관리 시 자동 동기 장애 조치(Synchronous Failover) 기능을 제공하지 않습니다. 고가용성 및 자동 장애 조치는 Multi-AZ 배포를 통해 구현해야 합니다.",
    explanation_en: "### Correct Answer Analysis:\n- **Option 3 is correct**: Amazon RDS Multi-AZ deployment synchronously replicates database updates to a standby instance in a separate Availability Zone (AZ). During scheduled maintenance windows (e.g., OS/engine patching) or unplanned AZ outages, RDS automatically performs a seamless DNS failover to the standby instance, ensuring high availability and eliminating downtime. Meanwhile, Amazon RDS Read Replicas asynchronously replicate data from the primary instance to serve read-only queries, offloading read-heavy requests (such as students checking grades and reviewing course materials) and reducing primary DB CPU utilization with minimal operational overhead.\n\n### Distractor Analysis:\n- **Option 1 is incorrect**: Self-hosting MySQL on Amazon EC2 instances requires manual setup of replication, backups, OS/engine patching, and failover tooling (e.g., keepalived/heartbeat), which incurs significant operational overhead compared to managed RDS.\n- **Option 2 is incorrect**: In a standard Amazon RDS Multi-AZ deployment, the standby replica is strictly passive for high availability and failover; it does not serve read traffic or expose a readable database endpoint.\n- **Option 4 is incorrect**: Amazon RDS Read Replicas use asynchronous replication to improve read performance and do not provide automated synchronous failover for high availability during scheduled maintenance. High availability and automated failover are handled by Multi-AZ deployments."
  },
  {
    id: "gen27",
    service_id: "latency",
    conceptIds: ["latency"],
    domain_id: "principle",
    difficulty: "Medium",
    question_ko: "디지털 헬스케어 스타트업이 us-east-1 리전에서 웹 기반 전자의무기록(EHR) 플랫폼을 운영하고 있습니다. 이 애플리케이션 아키텍처는 Application Load Balancer(ALB), Amazon EC2 인스턴스의 Auto Scaling 그룹, 그리고 환자 진료 기록 및 검사 결과를 저장하는 Amazon DynamoDB 테이블로 구성되어 있습니다.\n\n스타트업이 최근 글로벌 서비스를 확장한 이후, 유럽 및 아시아 태평양 지역의 의료진으로부터 웹 포털 로딩 및 환자 차트 조회 시 심각한 지연 시간(latency)이 발생한다는 불만이 접수되었습니다. 아키텍처 검토 결과, 글로벌 웹 트래픽에 대한 높은 네트워크 왕복 지연 시간(RTT)과 자주 조회되는 환자 차트에 대한 반복적인 DynamoDB 읽기 쿼리가 주요 병목으로 확인되었습니다.\n\n애플리케이션 코드 변경을 최소화하면서 글로벌 사용자의 지연 시간을 줄이고, 반복되는 데이터베이스 쿼리에 대해 밀리초 미만(sub-millisecond)의 읽기 응답 속도를 달성하기 위해 솔루션스 아키텍트가 권장해야 하는 솔루션은 무엇입니까?",
    question_en: "A digital healthcare startup runs a web-based electronic health records (EHR) platform in the us-east-1 Region. The application architecture consists of an Application Load Balancer (ALB), an Auto Scaling group of Amazon EC2 instances, and an Amazon DynamoDB table that stores patient medical histories and diagnostic lab results.\n\nThe startup recently expanded internationally, and medical practitioners in Europe and the Asia-Pacific region report significant latency when loading the web portal and retrieving patient records. An architectural review reveals two primary bottlenecks: high round-trip network latency for global web traffic, and repeated read queries to the DynamoDB table for frequently viewed patient charts.\n\nWhich solution should a solutions architect recommend to minimize latency for global users and achieve sub-millisecond read latency for repeated database queries with MINIMAL application changes?",
    options_ko: [
      "유럽 및 아시아 태평양 리전에 DynamoDB 글로벌 테이블(Global Tables)을 활성화합니다. 해당 리전들에 전체 애플리케이션 스택을 배포하고 Amazon Route 53 지연 시간 기반 라우팅을 구성합니다.",
      "DynamoDB 테이블용 Amazon DynamoDB Accelerator(DAX) 클러스터를 배포합니다. Application Load Balancer를 오리진(Origin)으로 사용하는 Amazon CloudFront 배포를 생성합니다.",
      "DynamoDB 앞에 Amazon ElastiCache for Redis 클러스터를 배포합니다. Application Load Balancer를 엔드포인트로 사용하는 AWS Global Accelerator를 구성합니다.",
      "DynamoDB 테이블의 프로비저닝된 읽기 용량 단위(RCU)를 늘리고 Auto Scaling을 활성화합니다. 개별 EC2 인스턴스를 오리진으로 구성한 Amazon CloudFront 배포를 생성합니다."
    ],
    options_en: [
      "Enable DynamoDB Global Tables across European and Asia-Pacific Regions. Deploy full application stacks in those Regions and configure Amazon Route 53 latency-based routing.",
      "Deploy an Amazon DynamoDB Accelerator (DAX) cluster for the DynamoDB table. Create an Amazon CloudFront distribution with the Application Load Balancer as the origin.",
      "Deploy an Amazon ElastiCache for Redis cluster in front of DynamoDB. Configure AWS Global Accelerator with the Application Load Balancer as an endpoint.",
      "Increase the provisioned Read Capacity Units (RCUs) and enable DynamoDB auto-scaling. Create an Amazon CloudFront distribution with individual EC2 instances configured as origins."
    ],
    answer: 1,
    explanation_ko: "**정답: C**\n\n**정답 해설 (C가 올바른 이유):**\n1. **Amazon DynamoDB Accelerator(DAX)**: DAX는 DynamoDB를 위해 특별히 설계된 완전관리형 고가용성 인메모리 캐시 서비스입니다. 반복적인 읽기 요청의 지연 시간을 밀리초 단위에서 마이크로초(밀리초 미만, sub-millisecond) 단위로 최대 10배 단축시킵니다. 특히 DAX는 기존 DynamoDB API와 100% 호환되므로, 별도의 복잡한 캐싱 로직(Cache-Aside, 무효화 로직 등)을 작성할 필요 없이 엔드포인트 설정만으로 연동이 가능하여 **애플리케이션 코드 변경을 최소화**할 수 있습니다.\n2. **Amazon CloudFront**: Application Load Balancer(ALB) 앞에 CloudFront 배포를 구성하면 유럽 및 아시아 태평양 지역의 글로벌 사용자 인근 엣지 로케이션(Edge Locations)에서 정적 웹 리소스를 캐싱하여 즉시 제공합니다. 또한 동적 API 요청 역시 엣지에서 TLS 핸드셰이크를 빠르게 완료한 후 최적화된 AWS 글로벌 네트워크 백본을 통해 `us-east-1`의 ALB로 고속 라우팅되므로 네트워크 왕복 시간(RTT)을 대폭 단축할 수 있습니다.\n\n**오답 해설:**\n- **A가 오답인 이유**: DynamoDB와 함께 Amazon ElastiCache for Redis를 사용하려면 캐시 적중/실패 처리 및 데이터 동기화 등 애플리케이션 레벨의 캐싱 로직을 직접 구현해야 하므로 상당한 코드 수정이 필요합니다. 또한 AWS Global Accelerator는 Anycast IP 기반의 네트워크 경로 가속은 제공하지만 엣지 로케이션에서의 정적 콘텐츠 캐싱 기능은 제공하지 않습니다.\n- **B가 오답인 이유**: 여러 리전에 전체 애플리케이션 스택을 배포하고 DynamoDB 글로벌 테이블 및 Route 53 지연 시간 라우팅을 구성하는 것은 비용, 데이터 복제 오버헤드, 운영 복잡성이 지나치게 증가하므로 변경 사항을 최소화해야 하는 요구사항에 부합하지 않습니다.\n- **D가 오답인 이유**: DynamoDB RCU를 증설하고 Auto Scaling을 활성화하면 높은 트래픽(처리량)은 감당할 수 있지만, 개별 읽기 쿼리의 응답 시간을 마이크로초 단위로 단축하거나 반복 쿼리를 캐싱하지는 못합니다. 또한 CloudFront의 오리진으로 개별 EC2 인스턴스를 직접 지정하면 ALB와 Auto Scaling 그룹을 우회하게 되어 로드 밸런싱과 고가용성 아키텍처가 훼손됩니다.",
    explanation_en: "**Correct Answer: C**\n\n**Why Option C is correct:**\n1. **Amazon DynamoDB Accelerator (DAX)**: DAX is a fully managed, highly available in-memory cache specifically built for Amazon DynamoDB. It delivers up to a 10x read performance improvement—reducing query latency from single-digit milliseconds to microseconds (sub-millisecond)—even at millions of requests per second. Because DAX is API-compatible with DynamoDB, existing application calls can point directly to the DAX cluster with **minimal application code changes**, eliminating the need to write custom cache-aside or invalidation logic.\n2. **Amazon CloudFront**: Configuring an Amazon CloudFront distribution in front of the Application Load Balancer (ALB) caches static web assets (portal UI, JavaScript, stylesheets) at AWS Edge Locations close to global users in Europe and the Asia-Pacific region. For dynamic API calls, CloudFront terminates TLS connections at the nearest edge and routes traffic over the optimized AWS global network backbone to the ALB in us-east-1, significantly reducing round-trip time (RTT).\n\n**Why other options are incorrect:**\n- **Option A is incorrect**: Implementing Amazon ElastiCache for Redis alongside DynamoDB requires custom application-level cache management logic (such as cache-aside patterns, cache invalidation, and key management), which incurs significant code changes compared to DAX. Additionally, AWS Global Accelerator optimizes TCP/UDP routing via Anycast static IPs but does not cache static web assets at edge locations.\n- **Option B is incorrect**: Deploying multi-region application stacks with DynamoDB Global Tables and Route 53 latency routing creates massive operational complexity, high cross-region data transfer costs, and extensive management overhead, violating the requirement for minimal changes and overhead.\n- **Option D is incorrect**: Increasing DynamoDB Read Capacity Units (RCUs) and enabling auto-scaling handles higher throughput (concurrency) but does not reduce database read latency to sub-millisecond levels or cache repeated queries. Furthermore, pointing CloudFront directly to EC2 instances bypasses the ALB and Auto Scaling group, disrupting load balancing, high availability, and health checks."
  },
  {
    id: "gen28",
    service_id: "latency",
    conceptIds: ["latency"],
    domain_id: "principle",
    difficulty: "Medium",
    question_ko: "한 지역 항공사에서 매일 운항하는 통근 항공편의 일정 및 운임 조회 플랫폼을 운영하고 있습니다. 애플리케이션 백엔드는 Application Load Balancer(ALB) 뒤에 있는 Amazon EC2 인스턴스의 Auto Scaling 그룹에서 실행되며, 데이터베이스로 Amazon RDS for MySQL을 사용합니다.\n\n오전 출근 피크 시간대 동안 수십만 명의 사용자가 동일한 주요 인기 노선 및 좌석 현황을 반복적으로 검색합니다. 모니터링 지표에 따르면 동일한 읽기 쿼리가 과도하게 발생하여 Amazon RDS의 CPU 사용률이 95%에 달하고 쿼리 지연 시간이 20ms에서 3초 이상으로 급증했습니다. 항공편 일정 및 기본 운임 데이터는 하루에 몇 번만 업데이트됩니다.\n\n솔루션 아키텍트는 잦은 검색 쿼리에 대해 밀리초 미만(sub-millisecond)의 응답 시간을 달성하고 데이터베이스의 부하를 대폭 줄이도록 아키텍처를 재설계해야 합니다.\n\n솔루션 아키텍트가 권장해야 하는 솔루션은 무엇입니까?",
    question_en: "A regional airline operates a flight schedule and fare search platform for its daily commuter routes. The application backend runs on an Auto Scaling group of Amazon EC2 instances behind an Application Load Balancer (ALB) and uses an Amazon RDS for MySQL database.\n\nDuring morning peak hours, hundreds of thousands of users repeatedly search for the same high-demand routes and seat availability. Monitoring metrics show that Amazon RDS CPU utilization reaches 95% due to identical read queries, causing query latency to spike from 20 ms to over 3 seconds. Flight schedules and base fare data are updated only a few times per day.\n\nA solutions architect must redesign the architecture to achieve sub-millisecond response times for frequent search queries and significantly reduce the load on the database.\n\nWhich solution should the solutions architect recommend?",
    options_ko: [
      "Application Load Balancer 앞에 AWS Global Accelerator를 구성하여 엣지 로케이션에서 데이터베이스 쿼리 응답을 캐싱합니다.",
      "Amazon RDS 읽기 전용 복제본(Read Replica)을 생성하고, 항공편 검색 쿼리를 읽기 전용 복제본 엔드포인트로 라우팅하도록 애플리케이션을 수정합니다.",
      "데이터베이스 앞에 Amazon ElastiCache for Redis 클러스터를 배포하여 자주 조회되는 항공편 검색 쿼리 결과를 캐싱합니다.",
      "Amazon RDS DB 인스턴스의 스토리지 볼륨 유형을 범용 SSD(gp3)에서 프로비저닝된 IOPS SSD(io2 Block Express)로 수정합니다."
    ],
    options_en: [
      "Provision an AWS Global Accelerator in front of the Application Load Balancer to cache database query responses at edge locations.",
      "Create Amazon RDS Read Replicas and update the application to route flight search queries to the read replica endpoints.",
      "Deploy an Amazon ElastiCache for Redis cluster in front of the database to cache the results of frequent flight search queries.",
      "Modify the Amazon RDS DB instance storage volume type from General Purpose SSD (gp3) to Provisioned IOPS SSD (io2 Block Express)."
    ],
    answer: 2,
    explanation_ko: "- **정답 C 해설**: Amazon ElastiCache for Redis는 마이크로초에서 밀리초 미만(sub-millisecond)의 응답 속도를 제공하는 완전관리형 인메모리 캐시 서비스입니다. 이 시나리오에서는 하루 중 변경 빈도가 낮은 동일한 항공편 일정 및 운임 조회 쿼리가 반복적으로 발생하고 있습니다. RDS 앞에 ElastiCache 캐싱 계층을 배치하면 동일한 검색 결과를 초고속 메모리에서 직접 반환하므로 밀리초 미만의 지연 시간 요구사항을 충족하고 RDS의 CPU 부하를 대폭 줄일 수 있습니다.\n- **오답 A 해설**: Amazon RDS 읽기 전용 복제본(Read Replica)은 주 DB 인스턴스의 읽기 트래픽을 분산하는 데 적합하지만, 여전히 관계형 데이터베이스 엔진이 SQL 쿼리를 해석하고 실행해야 합니다. 따라서 인메모리 캐시 수준의 밀리초 미만 지연 시간을 제공하지 못하며 반복 쿼리에 따른 컴퓨팅 리소스 소모를 근본적으로 방지하지 못합니다.\n- **오답 B 해설**: 스토리지 볼륨을 gp3에서 프로비저닝된 IOPS SSD(io2 Block Express)로 변경하면 스토리지 I/O 성능이 향상되지만, 문제의 원인은 반복 쿼리 연산으로 인한 데이터베이스 CPU 과부하(95%)입니다. 스토리지 IOPS 증설은 CPU 병목을 해결하지 못하며 밀리초 미만의 응답 속도를 제공할 수 없습니다.\n- **오답 D 해설**: AWS Global Accelerator는 전 세계 클라이언트와 리전 내 엔드포인트(ALB 등) 간의 네트워크 경로를 Anycast IP를 통해 최적화하는 전송 계층(Layer 4) 서비스입니다. Global Accelerator는 애플리케이션 데이터나 데이터베이스 응답을 캐싱하지 않으므로 백엔드 데이터베이스 부하를 줄일 수 없습니다.",
    explanation_en: "- **Option C is correct**: Amazon ElastiCache for Redis is an in-memory key-value data store that delivers microsecond to sub-millisecond response times. In this scenario, users repeatedly execute identical queries for flight schedules and fare data that change infrequently. Implementing an in-memory caching layer in front of RDS allows the application to serve repeated search queries directly from memory, satisfying the sub-millisecond latency requirement while dramatically reducing RDS CPU utilization.\n- **Option A is incorrect**: Amazon RDS Read Replicas scale read throughput across multiple database instances, but each replica still processes queries through the relational database engine. Read replicas cannot provide sub-millisecond in-memory latency and would still consume database compute resources for identical queries.\n- **Option B is incorrect**: Changing storage from gp3 to Provisioned IOPS SSD (io2 Block Express) improves disk I/O performance. However, the bottleneck here is database CPU exhaustion (95%) caused by parsing and executing hundreds of thousands of SQL queries. Upgrading disk IOPS does not alleviate CPU-bound query processing and cannot deliver sub-millisecond query latency.\n- **Option D is incorrect**: AWS Global Accelerator optimizes the network transport path between global clients and regional endpoints (such as ALBs) using Anycast IP addresses. It operates at the transport layer (Layer 4) and does not cache application data or database responses, so it will not offload database traffic."
  },
  {
    id: "gen29",
    service_id: "latency",
    conceptIds: ["latency"],
    domain_id: "principle",
    difficulty: "Medium",
    question_ko: "한 모바일 게임 스튜디오에서 실시간 멀티플레이어 배틀 아레나 게임을 개발하여 서비스하고 있습니다. 게임의 백엔드는 us-east-1 리전의 Auto Scaling 그룹에 속한 Amazon EC2 인스턴스 플릿에서 실행되며, Network Load Balancer(NLB)가 트래픽을 분산하고 있습니다. 모바일 게임 클라이언트는 실시간 플레이어 액션 동기화 및 게임 상태 업데이트를 위해 커스텀 UDP 기반 프로토콜을 사용합니다.\n\n유럽과 아시아 태평양 지역의 플레이어들이 공용 인터넷 라우팅으로 인한 심각한 패킷 손실, 높은 지연 시간(레이턴시), 잦은 연결 끊김 현상을 보고하고 있습니다. 또한 모바일 클라이언트 애플리케이션은 이동통신사의 네트워크 보안 필터 기준을 충족하기 위해 고정된 정적 진입점 IP 주소가 필요합니다.\n\n운영 오버헤드를 최소화하면서 글로벌 플레이어의 네트워크 지연 시간을 줄이고 연결 안정성을 향상시킬 수 있는 솔루션은 무엇입니까?",
    question_en: "A mobile game studio develops a real-time multiplayer battle arena game. The game backend runs on a fleet of Amazon EC2 instances in an Auto Scaling group located in the us-east-1 Region, fronted by a Network Load Balancer (NLB). The mobile game client uses a custom UDP-based protocol to synchronize player actions and game state in real time.\n\nPlayers connecting from Europe and the Asia-Pacific region report significant packet loss, high latency, and frequent disconnections caused by public internet routing. Additionally, the mobile client application requires fixed, static entry-point IP addresses to comply with mobile carrier network security filters.\n\nWhich solution should a solutions architect recommend to reduce network latency and improve connection reliability for global players with the LEAST operational overhead?",
    options_ko: [
      "Network Load Balancer를 Application Load Balancer(ALB)로 교체하고 대상 그룹에서 AWS Transfer Acceleration을 활성화합니다.",
      "Amazon Route 53 지연 시간 기반 라우팅(Latency Routing) 정책을 구성하여 클라이언트 요청을 EC2 인스턴스의 퍼블릭 IP 주소로 직접 확인하도록 설정합니다.",
      "AWS Global Accelerator 액셀러레이터를 생성하고 us-east-1의 Network Load Balancer를 엔드포인트로 연결합니다.",
      "Network Load Balancer를 오리진으로 설정한 Amazon CloudFront 배포를 생성하여 엣지 로케이션에서 게임 트래픽을 캐싱합니다."
    ],
    options_en: [
      "Replace the Network Load Balancer with an Application Load Balancer (ALB) and enable AWS Transfer Acceleration on the target groups.",
      "Configure an Amazon Route 53 latency-based routing policy to resolve client requests directly to the public IP addresses of the EC2 instances.",
      "Create an AWS Global Accelerator accelerator and associate the Network Load Balancer in us-east-1 as an endpoint.",
      "Deploy an Amazon CloudFront distribution with the Network Load Balancer configured as the custom origin to cache game traffic at edge locations."
    ],
    answer: 2,
    explanation_ko: "**정답: 3번 (AWS Global Accelerator 액셀러레이터를 생성하고 us-east-1의 Network Load Balancer를 엔드포인트로 연결합니다.)**\n\n- **정답인 이유**: AWS Global Accelerator는 AWS의 글로벌 전용 네트워크 백본을 활용하여 전 세계 사용자의 트래픽을 가장 가까운 엣지 로케이션을 통해 AWS 내부망으로 신속하게 진입시킵니다. 이를 통해 공용 인터넷 라우팅 구간을 최소화하여 패킷 손실, 지터, 레이턴시를 획기적으로 낮춥니다. 또한 전 세계 어디서나 접근 가능한 고정된 2개의 애니캐스트(Anycast) IPv4 주소를 제공하므로 이동통신사 방화벽 및 보안 필터 요건을 충족하며, 커스텀 UDP 프로토콜을 완벽하게 지원합니다.\n- **1번이 오답인 이유**: Amazon CloudFront는 HTTP, HTTPS 및 WebSocket 트래픽에 특화된 CDN 서비스입니다. 실시간 게임 서버가 사용하는 비HTTP 커스텀 UDP 프로토콜을 지원하지 않습니다.\n- **2번이 오답인 이유**: Amazon Route 53의 지연 시간 기반 라우팅은 DNS 질의 시점에만 작동하며, 실제 패킷 전송은 여전히 불안정한 공용 인터넷 경로를 통과합니다. 또한 Auto Scaling에 따라 EC2 인스턴스의 퍼블릭 IP가 수시로 변경되므로 고정 정적 IP 요구사항을 충족할 수 없습니다.\n- **4번이 오답인 이유**: Application Load Balancer(ALB)는 L7 로드 밸런서로 UDP 트래픽을 지원하지 않습니다. 또한 Transfer Acceleration은 Amazon S3 버킷 전송 가속 기능이며 로드 밸런서 대상 그룹에 적용할 수 없습니다.",
    explanation_en: "**Correct Answer: Option 3 (Create an AWS Global Accelerator accelerator and associate the Network Load Balancer in us-east-1 as an endpoint)**\n\n- **Why it is correct**: AWS Global Accelerator uses the AWS global network backbone to route traffic from edge locations directly to endpoints (such as Network Load Balancers or EC2 instances). It provisions two static Anycast IPv4 addresses that serve as fixed global entry points, fulfilling the mobile carrier security requirement. Client UDP traffic enters the AWS edge network closest to the player, bypassing congested public internet hops to dramatically reduce latency, jitter, and packet loss with minimal operational overhead.\n- **Why Option 1 is incorrect**: Amazon CloudFront is a Content Delivery Network (CDN) built for HTTP, HTTPS, and WebSocket traffic. It does not support custom UDP-based protocols required by real-time multiplayer game servers.\n- **Why Option 2 is incorrect**: Amazon Route 53 latency-based routing only directs DNS queries to the best Region; actual game traffic still travels over unpredictable public internet hops. Furthermore, EC2 public IPs in an Auto Scaling group change dynamically during scaling events, failing the requirement for static entry-point IP addresses.\n- **Why Option 4 is incorrect**: Application Load Balancers (ALBs) operate at Layer 7 and do not support the UDP protocol. Additionally, AWS Transfer Acceleration is an Amazon S3 feature for fast object uploads/downloads and cannot be applied to load balancers."
  },
  {
    id: "gen30",
    service_id: "latency",
    conceptIds: ["latency"],
    domain_id: "principle",
    difficulty: "Medium",
    question_ko: "한 대학교에서 전 세계 여러 대륙에 거주하는 10만 명 이상의 학생들을 위한 온라인 학습 관리 시스템(LMS)을 운영하고 있습니다. 전체 워크로드는 단일 AWS 리전에서 호스팅되며, Application Load Balancer(ALB)가 트래픽을 Amazon EC2 인스턴스의 Auto Scaling 그룹으로 전달하고, 강의 계획서, 강의 슬라이드 및 녹화 영상 파일은 Amazon S3 버킷에 저장됩니다. 시험 기간 동안 호스팅 리전 외부에 있는 해외 학생들은 포털 웹 페이지 로딩 및 강의 자료 접근 시 심각한 지연 시간(latency)을 겪고 있습니다.\n\n최소한의 운영 오버헤드로 전 세계 학생들의 지연 시간을 줄이고 성능을 개선할 수 있는 아키텍처 솔루션은 무엇입니까?",
    question_en: "A university operates an online learning management system (LMS) for over 100,000 students located across multiple continents. The entire workload is hosted in a single AWS Region and consists of an Application Load Balancer (ALB) that routes traffic to an Auto Scaling group of Amazon EC2 instances, while course syllabi, lecture slides, and video recordings are stored in an Amazon S3 bucket. During exam periods, international students outside the hosting Region experience high latency when loading portal pages and accessing course media.\n\nWhich architecture solution will improve performance and minimize latency for global students with the LEAST operational overhead?",
    options_ko: [
      "기존 VPC 내에 Amazon ElastiCache for Redis 클러스터를 배포하여 웹 세션 데이터와 데이터베이스 쿼리를 캐싱하고, Amazon Route 53 지연 시간 기반 라우팅 정책을 설정한다.",
      "AWS Global Accelerator를 생성하고 Amazon S3 버킷과 Application Load Balancer를 엔드포인트 그룹으로 등록하여 전 세계 학생 트래픽을 AWS 글로벌 네트워크를 통해 라우팅한다.",
      "해외 학생들과 가장 가까운 리전들의 S3 버킷으로 미디어 파일을 복제하도록 Amazon S3 교차 리전 복제(CRR)를 구성하고, 각 리전별 ALB 뒤에 보조 EC2 Auto Scaling 그룹을 배포한다.",
      "정적 강의 미디어 파일의 오리진으로 Amazon S3 버킷을, 동적 웹 요청의 오리진으로 Application Load Balancer를 지정하여 Amazon CloudFront 배포를 구성한다."
    ],
    options_en: [
      "Deploy an Amazon ElastiCache for Redis cluster in the existing VPC to cache web session data and database queries, and configure Amazon Route 53 latency-based routing policies.",
      "Create an AWS Global Accelerator accelerator and add the Amazon S3 bucket and the Application Load Balancer as endpoint groups to route global student traffic over the AWS global network.",
      "Configure Amazon S3 Cross-Region Replication (CRR) to replicate media files to S3 buckets in Regions closest to international students, and deploy secondary EC2 Auto Scaling groups behind regional ALBs.",
      "Deploy an Amazon CloudFront distribution configured with the Amazon S3 bucket as the origin for static course media and the Application Load Balancer as the origin for dynamic web requests."
    ],
    answer: 3,
    explanation_ko: "**정답: 정적 강의 미디어 파일의 오리진으로 Amazon S3 버킷을, 동적 웹 요청의 오리진으로 Application Load Balancer를 지정하여 Amazon CloudFront 배포를 구성한다.**\n\n- **정답 해설:**\n  Amazon CloudFront는 전 세계 엣지 로케이션(Edge Locations)을 활용하여 최종 사용자와 가장 가까운 위치에서 콘텐츠를 제공하는 글로벌 콘텐츠 전송 네트워크(CDN) 서비스입니다. S3에 저장된 정적 미디어(강의 영상, 슬라이드, PDF 등)를 엣지에 캐싱하여 지연 시간을 크게 줄여주며, ALB로 전송되는 동적 웹 요청 또한 공용 인터넷 대신 초고속 AWS 글로벌 네트워크 백본을 통해 최적화된 영구 TCP 연결로 라우팅합니다. 이를 통해 다중 리전 인프라를 별도로 구축·관리하지 않고도 최소한의 운영 오버헤드로 전 세계 학생들의 지연 시간을 획기적으로 개선할 수 있습니다.\n\n- **오답 해설:**\n  - **보기 1 (S3 CRR + 다중 리전 EC2):** 여러 리전에 걸쳐 S3 버킷을 복제하고 별도의 ALB 및 EC2 Auto Scaling 그룹을 구축·관리하는 것은 아키텍처 복잡성과 운영 오버헤드, 데이터 전송 비용을 크게 증가시킵니다.\n  - **보기 2 (Global Accelerator와 S3/ALB):** AWS Global Accelerator는 Amazon S3 버킷을 직접적인 엔드포인트 유형으로 지원하지 않으며(ALB, NLB, EC2, Elastic IP 지원), 엣지 캐싱 기능이 없어 대용량 정적 미디어 파일 전송 최적화에 적합하지 않습니다.\n  - **보기 4 (ElastiCache + Route 53 지연 시간 라우팅):** 단일 리전 내 ElastiCache 배포는 데이터베이스 읽기 성능은 개선하지만 물리적 거리가 먼 해외 사용자의 네트워크 지연 시간이나 S3 파일 다운로드 지연을 해결하지 못합니다. 또한 백엔드 리소스가 단일 리전에만 위치하므로 Route 53 지연 시간 라우팅 정책을 효과적으로 적용할 수 없습니다.",
    explanation_en: "**Correct Answer: Deploy an Amazon CloudFront distribution configured with the Amazon S3 bucket as the origin for static course media and the Application Load Balancer as the origin for dynamic web requests.**\n\n- **Why it's correct:**\n  Amazon CloudFront is a globally distributed Content Delivery Network (CDN) service that caches static content (such as PDFs, lecture videos, and static web assets stored in Amazon S3) at Edge Locations closest to end users, dramatically reducing latency. Furthermore, CloudFront optimizes dynamic traffic to the Application Load Balancer (ALB) by establishing persistent, optimized TCP connections over the high-speed AWS global network backbone rather than the public internet. This satisfies the latency reduction requirement for both static and dynamic traffic with minimal operational overhead and without duplicating compute infrastructure across multiple AWS Regions.\n\n- **Why other options are incorrect:**\n  - **Option 1 (S3 CRR + multi-region EC2):** Replicating S3 buckets across multiple regions and deploying redundant multi-region compute infrastructure (ALBs, EC2 Auto Scaling groups) introduces high operational complexity, significant infrastructure maintenance overhead, and elevated cross-region data transfer costs.\n  - **Option 2 (Global Accelerator with S3 and ALB):** AWS Global Accelerator does not support Amazon S3 buckets directly as endpoint types (it supports ALBs, NLBs, EC2 instances, and Elastic IPs). Additionally, Global Accelerator does not cache content at edge locations, making it suboptimal for static media delivery compared to CloudFront.\n  - **Option 4 (ElastiCache + Route 53 latency routing):** An ElastiCache cluster in the primary region optimizes local database read performance but does not address geographic network latency for international students accessing web assets and S3 media files. Furthermore, Route 53 latency-based routing cannot direct traffic across regions when all backend resources are hosted in a single Region."
  },
  {
    id: "gen31",
    service_id: "alb",
    conceptIds: ["alb"],
    domain_id: "networking",
    difficulty: "Medium",
    question_ko: "한 헬스케어 전자의무기록(EHR) 스타트업이 기존 모놀리식 환자 관리 애플리케이션을 AWS 기반의 마이크로서비스 아키텍처로 마이그레이션하고 있습니다. 이 애플리케이션은 HTTPS를 통해 웹 트래픽을 처리하며, 단일 퍼블릭 진입점(https://api.carepulse-health.com)을 사용해야 합니다.\n\n스타트업의 아키텍처 요구사항은 다음과 같습니다:\n- 환자 진료 기록 조회(`/records/*` 경로로 들어오는 요청)는 Auto Scaling 그룹에서 관리하는 Amazon EC2 인스턴스 플릿으로 전달되어야 합니다.\n- 의료 문서 처리 및 감사 로그 기록(`/documents/*` 경로로 들어오는 요청)은 서버리스 AWS Lambda 함수에서 처리되어야 합니다.\n- 인바운드 HTTP 트래픽은 일반적인 OWASP Top 10 웹 취약점 공격으로부터 보호되어야 합니다.\n- AWS Certificate Manager(ACM) 인증서를 사용하여 SSL/TLS 종단(Termination)을 중앙에서 관리해야 합니다.\n\n이러한 요구사항을 최소한의 운영 오버헤드로 충족하는 솔루션은 무엇입니까?",
    question_en: "A healthcare records startup is migrating its monolithic patient management application to a microservices-based architecture on AWS. The application serves web traffic over HTTPS and requires a single public entry point (https://api.carepulse-health.com).\n\nThe startup has the following requirements:\n- Patient record queries (requests matching `/records/*`) must be forwarded to a fleet of Amazon EC2 instances managed by an Auto Scaling group.\n- Medical document processing and audit logging (requests matching `/documents/*`) must be processed by serverless AWS Lambda functions.\n- Inbound HTTP traffic must be inspected and protected against common OWASP Top 10 vulnerabilities.\n- SSL/TLS termination must be managed centrally using an AWS Certificate Manager (ACM) certificate.\n\nWhich solution meets these requirements with the LEAST operational overhead?",
    options_ko: [
      "TLS 리스너 및 ACM 인증서가 구성된 Network Load Balancer(NLB)를 배포합니다. EC2 인스턴스 및 Lambda 함수 대상 그룹으로 요청을 전달하는 경로 기반 라우팅 규칙을 생성하고, NLB에 AWS WAF 웹 ACL을 직접 연결합니다.",
      "여러 오리진 그룹이 구성된 Amazon CloudFront 배포를 생성합니다. Lambda@Edge 뷰어 요청 트리거를 사용하여 HTTP 경로를 검사하고, 각 백엔드 티어 앞단에 위치한 개별 Network Load Balancer(NLB)로 트래픽을 전달합니다.",
      "EC2 대상 그룹용 Application Load Balancer(ALB)와 Lambda 함수용 Amazon API Gateway REST API를 각각 배포합니다. 두 엔드포인트 간에 들어오는 트래픽을 분기하기 위해 Amazon Route 53 경로 기반 별칭(Alias) 레코드를 구성합니다.",
      "HTTPS 리스너 및 ACM 인증서가 구성된 Application Load Balancer(ALB)를 배포합니다. ALB에 AWS WAF 웹 ACL을 연결하고, EC2 인스턴스 및 Lambda 함수 각각의 대상 그룹으로 트래픽을 라우팅하는 경로 기반 리스너 규칙을 구성합니다."
    ],
    options_en: [
      "Deploy a Network Load Balancer (NLB) configured with a TLS listener and an ACM certificate. Create path-based routing rules to forward requests to target groups for the EC2 instances and Lambda functions, and associate an AWS WAF web ACL directly with the NLB.",
      "Deploy an Amazon CloudFront distribution configured with multiple origin groups. Use Lambda@Edge viewer request triggers to inspect HTTP paths and forward traffic to individual Network Load Balancers fronting each backend tier.",
      "Deploy an Application Load Balancer (ALB) for the EC2 target group and an Amazon API Gateway REST API for the Lambda functions. Configure Amazon Route 53 path-based alias records to route incoming traffic between the two endpoints.",
      "Deploy an Application Load Balancer (ALB) configured with an HTTPS listener and an ACM certificate. Associate an AWS WAF web ACL with the ALB, and configure path-based listener rules to route requests to respective target groups for the EC2 instances and Lambda functions."
    ],
    answer: 3,
    explanation_ko: "**정답: 2번 (인덱스 1)**\n\n**해설:**\n- **Application Load Balancer (ALB)**는 OSI 7계층(애플리케이션 계층)에서 동작하며, 요청 내용에 따른 고급 라우팅 기능인 **경로 기반 라우팅(Path-based routing, 예: `/records/*` 및 `/documents/*`)** 및 호스트 기반 라우팅을 기본적으로 지원합니다.\n- **대상 그룹(Target Group) 지원**: ALB의 대상 그룹은 **Amazon EC2 인스턴스**뿐만 아니라 **AWS Lambda 함수**를 대상 유형(Target type)으로 직접 등록할 수 있습니다. 이를 통해 단일 엔드포인트에서 EC2와 서버리스 Lambda 백엔드 모두로 트래픽을 분기할 수 있습니다.\n- **SSL/TLS 종단**: AWS Certificate Manager(ACM)에서 발급받은 인증서를 ALB의 HTTPS 리스너에 연결하여 암/복호화 오버헤드를 백엔드 대신 ALB에서 처리(SSL Termination)할 수 있습니다.\n- **AWS WAF 연동**: ALB는 AWS WAF와 네이티브하게 통합되어 OWASP Top 10 및 웹 공격을 로드 밸런서 계층에서 차단할 수 있습니다.\n\n**오답 분석:**\n- **1번 (NLB)**: Network Load Balancer는 4계층(전송 계층 - TCP/UDP/TLS)에서 동작하므로 HTTP 패킷 내부의 URL 경로를 검사할 수 없어 경로 기반 라우팅을 수행할 수 없으며, AWS WAF를 직접 연결할 수 없습니다.\n- **3번 (Route 53 경로 기반 라우팅)**: Amazon Route 53은 DNS 서비스로 호스트명(도메인)만 IP/엔드포인트로 변환할 수 있으며, 7계층 HTTP URL 경로(`/records/*` 등)를 인식하여 트래픽을 분기할 수 없습니다.\n- **4번 (CloudFront + Lambda@Edge + 다중 NLB)**: Lambda@Edge와 여러 개의 NLB를 배포하는 구성은 단일 ALB의 기본 기능을 활용하는 것에 비해 아키텍처가 불필요하게 복잡해지고 운영 및 관리 오버헤드가 크게 증가합니다.",
    explanation_en: "**Correct Answer: Option 2 (Index 1)**\n\n**Explanation:**\n- **Application Load Balancer (ALB)** operates at OSI Layer 7 (Application Layer) and natively supports content-based routing, including **path-based routing** (e.g., routing `/records/*` vs `/documents/*`) and host header routing.\n- **Target Types**: An ALB target group supports **Amazon EC2 instances**, **IP addresses**, containers, and **AWS Lambda functions**. This allows the ALB to route HTTP/HTTPS traffic directly to both EC2 instances and serverless Lambda functions from a single endpoint without additional infrastructure.\n- **SSL/TLS Termination**: An AWS Certificate Manager (ACM) certificate can be attached directly to the ALB's HTTPS listener to offload TLS decryption/encryption.\n- **AWS WAF Integration**: ALB integrates natively with AWS WAF, allowing security rules (such as OWASP Top 10 mitigation and SQL injection inspection) to be applied directly at the load balancer level.\n\n**Why other options are incorrect:**\n- **Option 1 (NLB)**: Network Load Balancers operate at Layer 4 (Transport Layer - TCP/UDP/TLS). They cannot inspect Layer 7 HTTP request headers or URL paths, cannot perform path-based routing, and do not support direct AWS WAF association in this manner.\n- **Option 3 (Route 53 Path-based routing)**: Amazon Route 53 is a DNS management service that resolves domain names to IP addresses or AWS resource endpoints. DNS has no visibility into Layer 7 HTTP request paths (such as `/records/*`), so Route 53 cannot route traffic based on URL path.\n- **Option 4 (CloudFront + Lambda@Edge + multiple NLBs)**: While CloudFront with Lambda@Edge can inspect request paths, provisioning multiple NLBs and custom edge code introduces significant architectural complexity, higher costs, and substantial operational overhead compared to a single ALB."
  },
  {
    id: "gen32",
    service_id: "alb",
    conceptIds: ["alb"],
    domain_id: "networking",
    difficulty: "Medium",
    question_ko: "지역 항공사인 AeroVoyage는 AWS 기반으로 온라인 항공권 예약 및 승객 관리 플랫폼을 운영하고 있습니다. 이 플랫폼은 다음과 같은 여러 마이크로서비스로 구성되어 있습니다:\n\n- Amazon EC2 인스턴스의 Auto Scaling 그룹에서 실행되는 항공편 검색 및 예약 엔진\n- `awsvpc` 네트워크 모드를 사용하는 Amazon ECS 기반 컨테이너 서비스로 호스팅되는 마일리지 멤버십 포털\n- 서버리스 AWS Lambda 함수로 구동되는 모바일 체크인 및 좌석 배정 서비스\n\n모든 웹 트래픽은 HTTPS로 암호화되어야 합니다. 이 플랫폼은 여러 서브도메인(`booking.aerovoyage.com` 및 `rewards.aerovoyage.com`)으로 서비스되며, 체크인 요청은 `/checkin/*` 경로로 전달됩니다. 솔루션 아키텍트는 여러 도메인에 대한 SSL/TLS 인증서를 단일 엔드포인트에서 종료(Termination)하고, 최소한의 운영 복잡성으로 각 요청을 적절한 백엔드 서비스로 라우팅하는 아키텍처를 설계해야 합니다.\n\n이러한 요구 사항을 충족하는 솔루션은 무엇입니까?",
    question_en: "A regional airline company, AeroVoyage, operates an online booking and passenger management platform hosted on AWS. The platform consists of several distinct microservices:\n\n- A flight search and booking engine running on an Auto Scaling group of Amazon EC2 instances.\n- A frequent flyer loyalty portal hosted on containerized services in Amazon ECS using the `awsvpc` network mode.\n- A mobile check-in and seat assignment service powered by serverless AWS Lambda functions.\n\nAll web traffic must be encrypted using HTTPS. The platform serves multiple subdomains (`booking.aerovoyage.com` and `rewards.aerovoyage.com`), while check-in requests are sent to the `/checkin/*` path. A solutions architect must design a solution that terminates SSL/TLS for multiple domains with their respective certificates and routes requests to the appropriate backend service with the least operational overhead.\n\nWhich solution meets these requirements?",
    options_ko: [
      "HTTPS 리스너로 구성된 Classic Load Balancer(CLB)를 배포합니다. AWS IAM에 인증서를 업로드하고, 리스너에 경로 기반 라우팅 규칙을 구성하여 EC2 인스턴스, ECS 컨테이너, Lambda 함수로 요청을 전달합니다.",
      "단일 오리진으로 Amazon API Gateway 리전 엔드포인트를 사용하는 Amazon CloudFront 배포를 생성합니다. 대상 그룹을 사용하지 않고 호스트 헤더를 검사하여 EC2 인스턴스, ECS 태스크 및 Lambda 함수의 프라이빗 IP 주소로 직접 트래픽을 전달하도록 API Gateway를 구성합니다.",
      "여러 가용 영역에 걸쳐 Application Load Balancer(ALB)를 배포합니다. SNI(Server Name Indication)를 사용하여 HTTPS 리스너에 ACM 인증서들을 연결하고, 호스트 기반 및 경로 기반 라우팅 조건이 포함된 리스너 규칙을 구성하여 각각의 EC2 인스턴스, IP 주소, Lambda 대상 그룹(Target Group)으로 트래픽을 라우팅합니다.",
      "TLS 리스너가 있는 Network Load Balancer(NLB)를 배포합니다. 리스너에 ACM 인증서를 추가하고, 요청 경로 및 호스트 헤더를 기반으로 EC2 인스턴스, ECS 태스크, AWS Lambda 함수에 트래픽을 분산하도록 전송 계층 라우팅 규칙을 구성합니다."
    ],
    options_en: [
      "Deploy a Classic Load Balancer (CLB) configured with an HTTPS listener. Upload the certificates to AWS IAM, and configure path-based routing rules on the listener to forward requests to EC2 instances, ECS containers, and Lambda functions.",
      "Deploy an Amazon CloudFront distribution with an Amazon API Gateway regional endpoint as the single origin. Configure API Gateway to inspect host headers and forward traffic directly to the private IP addresses of the EC2 instances, ECS tasks, and Lambda functions without using target groups.",
      "Deploy an Application Load Balancer (ALB) across multiple Availability Zones. Attach the ACM certificates to an HTTPS listener using Server Name Indication (SNI), and configure listener rules with host-based and path-based routing conditions to route traffic to the respective EC2 instance, IP address, and Lambda target groups.",
      "Deploy a Network Load Balancer (NLB) with a TLS listener. Add the ACM certificates to the listener, and configure transport-level routing rules to distribute traffic across EC2 instances, ECS tasks, and AWS Lambda functions based on the request path and host header."
    ],
    answer: 2,
    explanation_ko: "Application Load Balancer(ALB)는 OSI 모델의 계층 7(애플리케이션 계층)에서 작동하며 HTTP 및 HTTPS 트래픽을 지능적으로 라우팅하는 데 최적화되어 있습니다.\n\n정답인 B가 가장 적합한 이유:\n1. **호스트 기반 및 경로 기반 라우팅**: ALB 리스너 규칙은 Host 헤더(`booking.aerovoyage.com` 및 `rewards.aerovoyage.com`)와 URL 경로(`/checkin/*`)를 검사하여 트래픽을 각각의 전용 대상 그룹(Target Group)으로 전달할 수 있습니다.\n2. **다양한 대상 유형(Target Types) 지원**: ALB는 다음과 같은 대상 유형을 네이티브하게 지원합니다.\n   - `instance`: Auto Scaling 그룹의 EC2 인스턴스\n   - `ip`: `awsvpc` 네트워크 모드를 사용하는 Amazon ECS 태스크\n   - `lambda`: 서버리스 AWS Lambda 함수\n3. **SNI(Server Name Indication) 지원**: ALB의 HTTPS 리스너는 SNI를 지원하므로 여러 개의 ACM(AWS Certificate Manager) SSL/TLS 인증서를 단일 리스너에 바인딩할 수 있습니다. 클라이언트가 요청한 호스트 이름에 따라 적절한 인증서를 제공하여 SSL 종료를 처리합니다.\n\n오답 분석:\n- **A가 틀린 이유**: Network Load Balancer(NLB)는 계층 4(전송 계층)에서 동작하므로 HTTP/HTTPS 계층의 호스트 헤더나 URL 경로를 검사하여 라우팅할 수 없습니다.\n- **C가 틀린 이유**: Classic Load Balancer(CLB)는 이전 세대의 로드 밸런서로, 단일 리스너에서의 SNI(여러 인증서 지원), 호스트/경로 기반 라우팅, Lambda 대상 그룹을 지원하지 않습니다.\n- **D가 틀린 이유**: API Gateway를 통해 프라이빗 EC2 및 ECS 태스크로 라우팅하려면 VPC Link 및 복잡한 프라이빗 통합 설정이 필요하여 운영 복잡성이 크게 증가합니다. ALB를 사용하는 것이 훨씬 간단하고 표준적인 아키텍처입니다.",
    explanation_en: "An Application Load Balancer (ALB) operates at Layer 7 (Application layer) of the OSI model and is purpose-built for HTTP and HTTPS traffic management.\n\nKey reasons why Option B is the best solution:\n1. **Path-Based and Host-Based Routing**: ALB listener rules can evaluate HTTP headers (such as `Host: booking.aerovoyage.com` vs `Host: rewards.aerovoyage.com`) as well as URL request paths (such as `/checkin/*`) to direct incoming requests to specific target groups.\n2. **Support for Diverse Target Types**: ALBs natively support multiple target types:\n   - `instance`: for EC2 instances in an Auto Scaling group.\n   - `ip`: for ECS tasks operating under `awsvpc` network mode.\n   - `lambda`: for serverless AWS Lambda functions.\n3. **Server Name Indication (SNI)**: ALB supports SNI on HTTPS listeners, allowing multiple SSL/TLS certificates managed by AWS Certificate Manager (ACM) to be attached to a single listener. The ALB automatically serves the matching certificate based on the client hostname.\n\nWhy the other options are incorrect:\n- **Option A is incorrect**: A Network Load Balancer (NLB) operates at Layer 4 (Transport layer). It does not inspect Layer 7 HTTP request headers or URL paths and cannot perform path-based or host-based routing.\n- **Option C is incorrect**: Classic Load Balancers (CLBs) are legacy load balancers. They do not support SNI (only one certificate per listener), nor do they support host-based/path-based routing rules or Lambda function target groups.\n- **Option D is incorrect**: Routing traffic from API Gateway to private EC2 instances and ECS tasks requires complex VPC Links and private integrations. An ALB provides native integration with EC2 Auto Scaling, ECS, and Lambda target groups with far less operational complexity."
  },
  {
    id: "gen33",
    service_id: "alb",
    conceptIds: ["alb"],
    domain_id: "networking",
    difficulty: "Medium",
    question_ko: "모바일 게임 개발사인 PixelArcade는 새로운 크로스 플랫폼 모바일 게임을 위한 백엔드 아키텍처를 설계하고 있습니다. 백엔드 서비스는 HTTPS를 통해 여러 REST API를 제공합니다.\n- 플레이어 인증 및 매치메이킹 요청(`/api/auth/*` 및 `/api/match/*`)은 Auto Scaling 그룹의 Amazon EC2 인스턴스에서 실행되는 백엔드 마이크로서비스에서 처리됩니다.\n- 일일 퀘스트 보상 및 리더보드 조회(`/api/rewards/*` 및 `/api/leaderboard/*`)는 서버리스 AWS Lambda 함수에서 처리됩니다.\n\n개발사는 SSL/TLS 인증서 종료를 지원하는 단일 HTTPS 엔드포인트를 구성하고, URL 경로를 기반으로 들어오는 요청을 적절한 대상 그룹으로 자동 라우팅해야 합니다. 또한 일반적인 웹 계층 공격을 차단하기 위해 AWS WAF와의 통합이 필요합니다.\n\n최소한의 운영 오버헤드로 이러한 요구 사항을 충족하는 솔루션은 무엇입니까?",
    question_en: "A mobile game studio, PixelArcade, is developing the backend architecture for a new cross-platform mobile game. The backend exposes several REST APIs over HTTPS:\n- Player authentication and matchmaking requests (`/api/auth/*` and `/api/match/*`) are handled by backend microservices running on Amazon EC2 instances in an Auto Scaling group.\n- Daily quest rewards and leaderboard queries (`/api/rewards/*` and `/api/leaderboard/*`) are processed by serverless AWS Lambda functions.\n\nThe studio requires a unified HTTPS entry point with SSL/TLS termination that can automatically route incoming requests to the appropriate target group based on the URL path. Additionally, the architecture must integrate with AWS WAF to protect against common web-layer exploits.\n\nWhich solution meets these requirements with the LEAST operational overhead?",
    options_ko: [
      "Amazon S3 오리진으로 구성된 Amazon CloudFront 배포를 생성합니다. Lambda@Edge 뷰어 요청 함수를 사용하여 URL 경로를 검사하고 프라이빗 EC2 인스턴스 및 Lambda 함수로 요청을 전달하는 역방향 프록시(Reverse Proxy)로 동작하도록 구현합니다.",
      "여러 가용 영역에 걸쳐 HTTPS 리스너 및 AWS Certificate Manager(ACM) 인증서가 구성된 Application Load Balancer(ALB)를 배포합니다. 경로 기반 리스너 규칙을 구성하여 트래픽을 EC2 대상 그룹 및 Lambda 대상 그룹으로 라우팅합니다. ALB에 AWS WAF 웹 ACL을 직접 연결합니다.",
      "EC2 인스턴스용 Application Load Balancer(ALB)와 Lambda 함수용 Amazon API Gateway REST API를 배포합니다. URL 경로를 검사하고 ALB와 API Gateway 간에 들어오는 트래픽을 분산하도록 가중치 기반 라우팅 정책으로 Amazon Route 53을 구성합니다.",
      "HTTPS 리스너가 구성된 Network Load Balancer(NLB)를 배포합니다. 요청 URL 경로를 기반으로 리스너 라우팅 규칙을 생성하여 EC2 인스턴스 대상 그룹 및 Lambda 대상 그룹으로 트래픽을 전달합니다. NLB에 AWS WAF 웹 ACL을 연결합니다."
    ],
    options_en: [
      "Deploy an Amazon CloudFront distribution configured with an Amazon S3 origin. Use Lambda@Edge viewer request functions to inspect the URL paths and act as a reverse proxy forwarding requests to the private EC2 instances and Lambda functions.",
      "Deploy an Application Load Balancer (ALB) across multiple Availability Zones with an HTTPS listener and an AWS Certificate Manager (ACM) certificate. Configure path-based listener rules to route traffic to an EC2 target group and a Lambda target group. Associate an AWS WAF web ACL directly with the ALB.",
      "Deploy an Application Load Balancer (ALB) for the EC2 instances and an Amazon API Gateway REST API for the Lambda functions. Configure Amazon Route 53 with weighted routing policies to inspect the URL path and distribute incoming traffic between the ALB and API Gateway.",
      "Deploy a Network Load Balancer (NLB) with an HTTPS listener. Create listener routing rules based on the request URL path to route traffic to an EC2 instance target group and a Lambda target group. Associate an AWS WAF web ACL with the NLB."
    ],
    answer: 1,
    explanation_ko: "- **정답 (Option C, 인덱스 2)인 이유**: Application Load Balancer(ALB)는 OSI 7계층(애플리케이션 계층)에서 동작하며, 요청 URL 경로(예: `/api/auth/*` 및 `/api/rewards/*`)를 기반으로 서로 다른 대상 그룹에 트래픽을 전달하는 경로 기반 라우팅을 기본적으로 지원합니다. ALB는 Amazon EC2 인스턴스와 AWS Lambda 함수 모두를 대상 그룹의 대상으로 직접 등록할 수 있습니다. 또한 AWS Certificate Manager(ACM)를 통한 SSL/TLS 인증서 종료와 웹 취약점 방어를 위한 AWS WAF 웹 ACL 연결을 직접 지원하므로, 최소한의 운영 오버헤드로 요구 사항을 충족합니다.\n- **Option A (인덱스 0)가 오답인 이유**: Network Load Balancer(NLB)는 4계층(전송 계층)에서 동작하므로 HTTP 요청 경로를 검사하여 경로 기반 라우팅을 수행할 수 없습니다. 또한 NLB에는 AWS WAF 웹 ACL을 직접 연결할 수 없습니다.\n- **Option B (인덱스 1)가 오답인 이유**: Amazon Route 53은 DNS 서비스로 도메인 이름 확인 단계에서 작동하므로, HTTP URL 경로(`/api/rewards/*` 등)를 검사하여 라우팅할 수 없습니다.\n- **Option D (인덱스 3)가 오답인 이유**: Lambda@Edge를 활용하여 수동으로 역방향 프록시를 구축하는 것은 ALB의 내장 기능(경로 기반 라우팅 및 Lambda 대상 그룹)을 활용하는 것에 비해 아키텍처가 지나치게 복잡하고 운영 오버헤드가 큽니다.",
    explanation_en: "- **Option C (Index 2) is correct** because an Application Load Balancer (ALB) operates at Layer 7 (application layer) and natively supports path-based routing rules (such as routing `/api/auth/*` and `/api/rewards/*` to different backends). ALBs can target both Amazon EC2 instances and AWS Lambda functions directly without needing intermediate proxy services. Furthermore, ALBs integrate with AWS Certificate Manager (ACM) for centralized SSL/TLS termination and support direct attachment of AWS WAF web ACLs to protect against web vulnerabilities with minimal operational overhead.\n- **Option A (Index 0) is incorrect** because a Network Load Balancer (NLB) operates at Layer 4 (transport layer) and cannot inspect HTTP request headers or URL paths for path-based routing. NLB also does not directly associate with AWS WAF web ACLs.\n- **Option B (Index 1) is incorrect** because Amazon Route 53 is a DNS-level routing service and does not inspect HTTP request paths (DNS queries only resolve hostnames, not URL paths like `/api/rewards/*`).\n- **Option D (Index 3) is incorrect** because using Lambda@Edge as a custom reverse proxy adds unnecessary development, maintenance, and operational complexity compared to the native Layer 7 routing and Lambda target capabilities of an ALB."
  },
  {
    id: "gen34",
    service_id: "alb",
    conceptIds: ["alb"],
    domain_id: "networking",
    difficulty: "Medium",
    question_ko: "한 대학교에서 신규 디지털 교육 기능을 지원하기 위해 온라인 학습 포털의 아키텍처를 현대화하고 있습니다. 이 포털은 다음과 같은 3개의 서로 다른 백엔드 워크로드로 구성되어 있습니다:\n\n- Auto Scaling 그룹 내의 Amazon EC2 인스턴스에서 실행되는 핵심 강의 관리 웹 애플리케이션\n- AWS Lambda 함수에서 실행되는 새로 개발된 서버리스 퀴즈 채점 마이크로서비스\n- 기존 AWS Direct Connect 연결을 통해 접근 가능하며 프라이빗 IPv4 주소로 식별되는 대학교 온프레미스 데이터 센터의 레거시 학생 성적 관리 시스템\n\n대학교는 AWS Certificate Manager(ACM)의 SSL/TLS 인증서를 사용하여 HTTPS 트래픽을 종료(SSL termination)할 수 있는 단일 퍼블릭 엔드포인트를 구축하고자 합니다. 이 솔루션은 들어오는 요청의 URL 경로(예: `/courses/*`, `/quiz/*`, `/grades/*`)를 검사하여 최소한의 운영 오버헤드로 해당 백엔드로 트래픽을 라우팅해야 합니다.\n\n이러한 요구 사항을 충족하는 솔루션은 무엇입니까?",
    question_en: "A university is modernizing its online learning portal to support new digital education capabilities. The portal comprises three distinct backend workloads:\n\n- A core course management web application running on Amazon EC2 instances within an Auto Scaling group.\n- A newly developed, serverless quiz evaluation microservice running on AWS Lambda functions.\n- A legacy student grading system hosted in the university's on-premises data center, reachable over an existing AWS Direct Connect connection and identified by private IPv4 addresses.\n\nThe university requires a centralized, single public-facing entry point that can terminate HTTPS traffic using an SSL/TLS certificate from AWS Certificate Manager (ACM). The solution must inspect incoming request URL paths (such as `/courses/*`, `/quiz/*`, and `/grades/*`) and route traffic to the corresponding backend with the least operational overhead.\n\nWhich solution meets these requirements?",
    options_ko: [
      "HTTPS 리스너 및 ACM 인증서가 구성된 Application Load Balancer(ALB)를 배포합니다. 경로 기반 리스너 규칙을 구성하여 target type이 instance, lambda, ip로 각각 설정된 개별 대상 그룹으로 요청을 전달합니다.",
      "TLS 리스너 및 ACM 인증서가 구성된 Network Load Balancer(NLB)를 배포합니다. 경로 기반 라우팅 조건을 가진 대상 그룹을 생성하여 EC2 인스턴스, Lambda 함수 및 온프레미스 IP 주소로 요청을 전달합니다.",
      "Amazon API Gateway HTTP API를 오리진으로 사용하는 Amazon CloudFront 배포를 생성합니다. 사용자 정의 AWS Lambda 역방향 프록시를 통해 EC2 인스턴스 및 온프레미스 IP로 트래픽을 전달하도록 /courses/* 및 /grades/*에 대한 API Gateway 통합 라우팅을 구성합니다.",
      "HTTPS 리스너 및 ACM 인증서가 구성된 Classic Load Balancer(CLB)를 배포합니다. URL 경로 패턴을 평가하여 EC2 인스턴스, Lambda 함수 및 온프레미스 서버로 트래픽을 전달하도록 리스너 정책을 구성합니다."
    ],
    options_en: [
      "Deploy an Application Load Balancer (ALB) with an HTTPS listener and an ACM certificate. Configure path-based listener rules to forward requests to separate target groups configured with target types of instance, lambda, and ip.",
      "Deploy a Network Load Balancer (NLB) configured with a TLS listener and an ACM certificate. Create target groups with path-based routing conditions that forward requests to the EC2 instances, Lambda functions, and on-premises IP addresses.",
      "Deploy an Amazon CloudFront distribution backed by an Amazon API Gateway HTTP API. Configure API Gateway integration routes for /courses/* and /grades/* to forward traffic to the EC2 instances and on-premises IPs through a custom AWS Lambda reverse proxy.",
      "Deploy a Classic Load Balancer (CLB) with an HTTPS listener and an ACM certificate. Configure listener policies to evaluate URL path patterns and forward traffic to the EC2 instances, Lambda functions, and on-premises servers."
    ],
    answer: 0,
    explanation_ko: "**정답: 3번 (인덱스 2)**\n\n**정답 해설:**\nApplication Load Balancer(ALB)는 OSI 모델의 계층 7(애플리케이션 계층)에서 작동하며 HTTP 및 HTTPS 트래픽 처리에 최적화되어 있습니다. 문제의 요구 사항을 다음과 같이 완벽히 충족합니다:\n1. **SSL/TLS 종료(Termination)**: ALB의 HTTPS 리스너에 AWS Certificate Manager(ACM) 인증서를 연결하여 로드 밸런서에서 안전하게 HTTPS 암호화를 종료할 수 있습니다.\n2. **경로 기반 라우팅(Path-based Routing)**: ALB 리스너 규칙을 통해 들어오는 HTTP 요청의 URL 경로(예: `/courses/*`, `/quiz/*`, `/grades/*`)를 확인하고 각각의 대상 그룹으로 트래픽을 분기할 수 있습니다.\n3. **다양한 대상 유형(Target Types) 지원**: ALB 대상 그룹은 3가지 주요 대상 유형을 기본 지원합니다.\n   - `instance`: Auto Scaling 그룹 내의 Amazon EC2 인스턴스로 라우팅\n   - `lambda`: 별도의 API Gateway 없이도 HTTP 요청으로 AWS Lambda 함수 직접 실행\n   - `ip`: VPC 내부뿐만 아니라 AWS Direct Connect 또는 VPN으로 연결된 온프레미스 데이터 센터의 프라이빗 IPv4 주소로 라우팅\n\n따라서 단일 ALB와 대상 그룹 규칙을 활용하는 것이 최소한의 운영 오버헤드로 모든 요구 사항을 충족하는 가장 이상적인 아키텍처입니다.\n\n**오답 해설:**\n- **1번 (NLB)**: Network Load Balancer는 계층 4(전송 계층 - TCP/UDP/TLS)에서 작동하므로 HTTP 요청 URL 경로를 해석하거나 경로 기반 라우팅을 수행할 수 없습니다.\n- **2번 (CLB)**: Classic Load Balancer는 이전 세대 로드 밸런서로, 고급 경로 기반 라우팅 규칙 및 Lambda 함수나 온프레미스 IP 대상 그룹 연결을 지원하지 않습니다.\n- **4번 (CloudFront + API Gateway + Lambda 역방향 프록시)**: CloudFront 및 API Gateway 뒤에 커스텀 Lambda 역방향 프록시를 두어 EC2 및 온프레미스로 중계하는 아키텍처는 불필요하게 복잡하며, 코드 작성 및 유지 관리 등 상당한 운영 오버헤드가 발생합니다.",
    explanation_en: "**Correct Answer: Option 3 (index 2)**\n\n**Why it is correct:**\nAn Application Load Balancer (ALB) operates at Layer 7 (Application Layer) of the OSI model and is purpose-built for HTTP and HTTPS traffic. It provides the following key capabilities required by the scenario:\n1. **SSL/TLS Termination**: An ALB can directly bind an SSL/TLS certificate from AWS Certificate Manager (ACM) to its HTTPS listener, terminating encryption at the load balancer.\n2. **Path-Based Routing**: ALB listener rules can evaluate HTTP request URL path patterns (e.g., `/courses/*`, `/quiz/*`, `/grades/*`) and forward incoming requests to corresponding target groups.\n3. **Flexible Target Types**: ALB target groups natively support three distinct target types:\n   - `instance`: Routes traffic to Amazon EC2 instances (such as those in an Auto Scaling group).\n   - `lambda`: Invokes an AWS Lambda function directly from HTTP requests without requiring an API Gateway.\n   - `ip`: Routes traffic to private IPv4 addresses within a VPC or across an AWS Direct Connect / Site-to-Site VPN connection to on-premises servers.\n\nUsing a single ALB with these target groups fulfills all requirements with minimal operational overhead and architecture complexity.\n\n**Why other options are incorrect:**\n- **Option 1 (NLB)**: A Network Load Balancer (NLB) operates at Layer 4 (Transport Layer - TCP/UDP/TLS). It does not parse HTTP request headers or URL paths and therefore cannot perform path-based routing.\n- **Option 2 (CLB)**: Classic Load Balancer is a legacy generation load balancer that lacks support for advanced Layer 7 path-based routing rules and cannot register Lambda functions or on-premises IP targets via target groups.\n- **Option 4 (CloudFront + API Gateway + Lambda Reverse Proxy)**: While theoretically configurable, using API Gateway with a custom Lambda reverse proxy to forward traffic to EC2 instances and on-premises IPs introduces high architectural complexity, custom code maintenance, and unnecessary operational overhead compared to a native ALB."
  },
  {
    id: "gen35",
    service_id: "cost",
    conceptIds: ["cost"],
    domain_id: "principle",
    difficulty: "Medium",
    question_ko: "의료 기록 관리 스타트업이 AWS에서 멀티 티어 애플리케이션을 운영하고 있으며, 월간 클라우드 인프라 비용을 절감하고자 합니다. 솔루션 아키텍트는 현재 환경을 검토하고 다음과 같은 운영 요구 사항 및 사용 패턴을 확인했습니다:\n\n- 매일 밤 4시간 동안 환자 기록을 처리하는 야간 배치 분석 작업이 실행됩니다. 이 작업은 상태 비저장(stateless)이며 내결함성을 갖추고 있고, 중간 체크포인트를 Amazon S3에 저장하므로 실행 중인 인스턴스가 예기치 않게 중단되더라도 안전하게 복구할 수 있습니다.\n- 환자의 진료 기록 PDF 문서는 Amazon S3 Standard에 저장됩니다. 해당 문서의 접근 패턴은 예측할 수 없으며, 협력 클리닉에 대한 환자의 불규칙한 내원 일정에 따라 크게 변동합니다.\n- 프라이빗 서브넷에 위치한 백엔드 EC2 인스턴스가 기존 NAT 게이트웨이를 통해 매일 수백 기가바이트의 의료 영상 데이터 세트를 Amazon S3에서 다운로드하여 상당한 데이터 처리 비용이 발생하고 있습니다.\n\n이러한 요구 사항을 가장 비용 효율적으로 충족하는 권장 사항의 조합은 무엇입니까?",
    question_en: "A healthcare records startup hosts its multi-tier application on AWS and wants to optimize its monthly cloud infrastructure costs. A solutions architect reviews the environment and notes the following operational requirements and usage patterns:\n\n- A nightly batch analytics job processes daily patient records for 4 hours. The job is stateless, fault-tolerant, and writes intermediate checkpoints to Amazon S3, allowing it to easily recover if an underlying instance is terminated unexpectedly.\n- Medical record PDF documents are stored in Amazon S3 Standard. The access patterns for these documents are unpredictable and fluctuate based on unscheduled patient visits to partner clinics.\n- Backend EC2 instances located in private subnets download hundreds of gigabytes of medical imaging datasets daily from Amazon S3 through an existing NAT gateway, generating significant data processing charges.\n\nWhich combination of recommendations will meet these requirements MOST cost-effectively?",
    options_ko: [
      "야간 배치 분석 작업에 대해 Amazon EC2 스팟 인스턴스(Spot Instances)를 사용합니다. 진료 기록 PDF 문서를 S3 Intelligent-Tiering으로 전환하도록 S3 수명 주기 정책을 구성합니다. VPC 내에 Amazon S3용 게이트웨이 VPC 엔드포인트(Gateway VPC endpoint)를 생성하고 프라이빗 서브넷 라우팅 테이블을 업데이트합니다.",
      "야간 배치 분석 작업에 대해 1년 약정 Compute Savings Plans를 구매합니다. 진료 기록 PDF 문서를 S3 Standard-Infrequent Access (S3 Standard-IA)로 전환하도록 S3 수명 주기 정책을 구성합니다. VPC 내에 Amazon S3용 인터페이스 VPC 엔드포인트(Interface VPC endpoint)를 프로비저닝합니다.",
      "야간 배치 분석 작업에 대해 3년 약정 표준 예약 인스턴스(Standard Reserved Instances)를 구매합니다. 진료 기록 PDF 문서를 S3 One Zone-Infrequent Access (S3 One Zone-IA)로 전환하도록 S3 수명 주기 정책을 구성합니다. 프라이빗 서브넷과 Amazon S3 간의 프라이빗 연결을 위해 AWS Direct Connect를 구성합니다.",
      "야간 배치 분석 작업에 대해 Auto Scaling 그룹과 함께 Amazon EC2 온디맨드 인스턴스를 사용합니다. 진료 기록 PDF 문서를 S3 Glacier Flexible Retrieval로 전환하도록 S3 수명 주기 정책을 구성합니다. NAT 게이트웨이를 대체하기 위해 여러 가용 영역에 걸쳐 EC2 NAT 인스턴스 플릿을 배포합니다."
    ],
    options_en: [
      "Use Amazon EC2 Spot Instances for the nightly batch analytics job. Configure an S3 Lifecycle policy to transition the medical record PDFs to S3 Intelligent-Tiering. Provision a Gateway VPC endpoint for Amazon S3 in the VPC and update the private subnet route tables.",
      "Purchase 1-year Compute Savings Plans for the nightly batch analytics job. Configure an S3 Lifecycle policy to transition the medical record PDFs to S3 Standard-Infrequent Access (S3 Standard-IA). Provision an Interface VPC endpoint for Amazon S3 in the VPC.",
      "Purchase 3-year Standard Reserved Instances for the nightly batch analytics job. Configure an S3 Lifecycle policy to transition the medical record PDFs to S3 One Zone-Infrequent Access (S3 One Zone-IA). Configure AWS Direct Connect to establish a private connection between the private subnets and Amazon S3.",
      "Use Amazon EC2 On-Demand Instances with an Auto Scaling group for the nightly batch analytics job. Configure an S3 Lifecycle policy to transition the medical record PDFs to S3 Glacier Flexible Retrieval. Deploy a fleet of EC2 NAT instances across multiple Availability Zones to replace the NAT gateway."
    ],
    answer: 0,
    explanation_ko: "### 정답: 3번째 보기 (Index 2)\n\n**정답인 이유:**\n1. **컴퓨팅 비용 최적화 (Amazon EC2 스팟 인스턴스):** 야간 배치 분석 작업은 매일 4시간만 실행되며, 상태 비저장(stateless)이고 내결함성을 갖추고 있으며 S3에 체크포인트를 저장합니다. 스팟 인스턴스는 온디맨드 가격 대비 최대 90% 저렴하므로 중단 가능한 배치 워크로드에 가장 비용 효율적입니다.\n2. **스토리지 비용 최적화 (S3 Intelligent-Tiering):** 환자 진료 기록 PDF 문서는 내원 일정에 따라 접근 빈도를 예측할 수 없습니다. S3 Intelligent-Tiering은 데이터 접근 패턴을 모니터링하여 객체를 빈번/비빈번 액세스 계층으로 자동 이동시키며, 데이터 검색(retrieval) 수수료가 없어 불규칙한 접근 패턴에 가장 경제적입니다.\n3. **데이터 전송 비용 최적화 (S3용 게이트웨이 VPC 엔드포인트):** 프라이빗 서브넷에서 NAT 게이트웨이를 통해 S3 데이터를 대량 다운로드하면 GB당 데이터 처리 수수료($0.045/GB)가 지속적으로 발생합니다. Amazon S3용 게이트웨이 VPC 엔드포인트(Gateway VPC Endpoint)는 시간당 요금 및 데이터 처리 요금이 전혀 없는 완전 무료 서비스로, 트래픽을 AWS 전용 네트워크를 통해 직접 라우팅하여 NAT 게이트웨이 비용을 완전히 제거합니다.\n\n---\n\n### 오답 분석:\n- **1번째 보기 (Index 0):** Compute Savings Plans는 24/7 연속 실행되는 일정한 워크로드에 적합하며, 하루 4시간만 실행되는 중단 가능한 배치 작업에는 스팟 인스턴스보다 비용 효율이 떨어집니다. S3 Standard-IA는 데이터 검색 시 GB당 검색 수수료가 부과되므로 예측 불가능한 접근 패턴에는 부적합합니다. 또한 S3용 인터페이스 VPC 엔드포인트는 게이트웨이 VPC 엔드포인트(무료)와 달리 시간당 비용 및 GB당 데이터 처리 비용이 발생합니다.\n- **2번째 보기 (Index 1):** 온디맨드 인스턴스는 할인 혜택이 없어 배치 작업에 비효율적입니다. S3 Glacier Flexible Retrieval은 데이터를 검색하는 데 수 분에서 수 시간이 소요되므로 환자가 병원에 방문했을 때 즉각적인 조회가 불가능합니다. NAT 인스턴스는 고가용성 구성 및 관리 부담이 크며 EC2 인스턴스 실행 비용이 계속 발생합니다.\n- **4번째 보기 (Index 3):** 3년 예약 인스턴스는 24시간 상시 가동 워크로드를 위한 것으로, 하루 4시간만 실행되는 작업에는 막대한 유휴 비용이 발생합니다. S3 One Zone-IA는 단일 가용 영역에만 저장되어 중요 의료 데이터의 내구성에 취약하고 검색 수수료가 부과됩니다. AWS Direct Connect는 온프레미스와 AWS 간의 전용망 연결 서비스이며 VPC 내부에서 S3로 트래픽을 라우팅하기 위한 수단이 아닙니다.",
    explanation_en: "### Correct Answer: Option 3 (Index 2)\n\n**Why Option 3 is correct:**\n1. **Compute Cost (Amazon EC2 Spot Instances):** The batch analytics workload runs for only 4 hours a day, is stateless, fault-tolerant, and persists intermediate checkpoints to Amazon S3. Spot Instances provide up to a 90% discount compared to On-Demand pricing and are the optimal choice for interruptible, flexible batch processing.\n2. **Storage Cost (S3 Intelligent-Tiering):** The medical record PDFs exhibit unknown, changing, and unpredictable access patterns due to unscheduled patient visits. S3 Intelligent-Tiering automatically optimizes storage costs by moving data between access tiers (Frequent, Infrequent, Archive Instant) based on usage patterns with zero retrieval fees and no operational overhead.\n3. **Data Transfer Cost (Gateway VPC Endpoint for Amazon S3):** Incurring high NAT gateway data processing fees ($0.045/GB) when downloading large datasets from S3 is a common architectural bottleneck. A Gateway VPC endpoint for Amazon S3 is completely free of charge (no hourly fees, no data processing fees) and routes traffic directly across the AWS private network, eliminating NAT gateway processing costs.\n\n---\n\n### Distractor Analysis:\n- **Option 1 (Index 0):** Compute Savings Plans commit to continuous baseline compute usage over 1 or 3 years and are intended for steady 24/7 workloads, making them less cost-effective than Spot Instances for short 4-hour batch jobs. S3 Standard-IA imposes per-GB data retrieval fees, making it unsuitable for unpredictable access patterns. Furthermore, Interface VPC endpoints for S3 incur hourly and per-GB data processing fees, whereas Gateway VPC endpoints are free.\n- **Option 2 (Index 1):** EC2 On-Demand Instances do not provide cost savings for flexible batch workloads. S3 Glacier Flexible Retrieval has retrieval times ranging from minutes to hours, which violates the need to view patient records immediately during clinic visits. Replacing NAT gateways with NAT instances introduces management overhead, lacks automated high availability, and still incurs EC2 compute and data transfer costs.\n- **Option 4 (Index 3):** Standard Reserved Instances require paying for 24/7 committed capacity throughout the year, causing substantial idle capacity waste for a 4-hour nightly job. S3 One Zone-IA stores data in only one Availability Zone (risking data loss if an AZ suffers an outage) and charges data retrieval fees. AWS Direct Connect is designed for dedicated hybrid cloud connections between on-premises data centers and AWS, not for routing VPC traffic to Amazon S3."
  },
  {
    id: "gen36",
    service_id: "cost",
    conceptIds: ["cost"],
    domain_id: "principle",
    difficulty: "Medium",
    question_ko: "한 지역 항공사가 항공권 예약 플랫폼과 운항 데이터 분석 워크로드를 AWS에서 운영하고 있습니다. 현재 아키텍처는 다음과 같은 워크로드 특성을 가지고 있습니다:\n- 핵심 예약 API는 향후 최소 3년 동안 연중무휴(24/7)로 실행될 예정이며, 예측 가능하고 안정적인 기준(Baseline) 트래픽을 처리하는 Amazon EC2 인스턴스에서 구동됩니다.\n- 노선 수익성 및 연료 소모량 계산 엔진은 매일 밤 4시간 동안 Amazon EC2에서 배치 처리 작업을 실행합니다. 이 작업은 컨테이너화되어 있고 내결함성(fault-tolerant)을 갖추고 있어 중단 후 재개되어도 문제가 없습니다.\n- 승객 전자 항공권(e-ticket) 및 탑승권 PDF 파일은 Amazon S3에 저장됩니다. 이 파일들은 예약 후 첫 30일 동안 빈번하게 조회됩니다. 30일 이후에는 조회가 급감하지만, 항공 규정상 7년 동안 보관해야 합니다. 감사 목적으로 몇 시간 이내에 검색(retrieval)할 수 있으면 충분합니다.\n\n솔루션스 아키텍트는 모든 운영 및 규정 준수 요구사항을 충족하면서 비용을 최적화할 수 있는 솔루션을 제안해야 합니다. 솔루션스 아키텍트가 권장해야 하는 조치의 조합은 무엇입니까?",
    question_en: "A regional airline operates its flight reservation platform and analytical workloads on AWS. The current architecture consists of the following components:\n- The primary booking API runs on Amazon EC2 instances with a predictable, steady-state baseline load that will operate 24/7 for at least the next 3 years.\n- A route-profitability and fuel-consumption calculation engine runs batch processing jobs on Amazon EC2 for 4 hours every night. The jobs are containerized, fault-tolerant, and can be safely interrupted and resumed.\n- Passenger e-tickets and boarding passes are stored as PDF files in Amazon S3. These files are accessed frequently during the first 30 days after booking. After 30 days, access drops sharply, but aviation regulations require retaining the files for 7 years. Retrieval within a few hours is acceptable for audit purposes.\n\nA solutions architect must recommend a cost-effective solution that satisfies all operational and regulatory requirements. Which combination of actions should the solutions architect recommend?",
    options_ko: [
      "- 핵심 예약 API EC2 인스턴스를 위해 선결제 없음(No Upfront) 조건의 1년 약정 리전 예약 인스턴스(Regional Reserved Instances)를 구매합니다.\n- 매일 밤 실행되는 계산 배치 작업을 위해 Amazon EC2 전용 인스턴스(Dedicated Instances)를 시작합니다.\n- PDF 파일을 S3 Intelligent-Tiering에 저장하고 Archive Access 및 Deep Archive Access 티어를 활성화합니다.",
      "- 핵심 예약 API를 Auto Scaling이 구성된 온디맨드 EC2 인스턴스에서 실행합니다.\n- 매일 밤 실행되는 계산 배치 작업을 위해 3년 약정 표준 예약 인스턴스(Standard Reserved Instances)를 구매합니다.\n- S3 수명 주기 정책을 구성하여 PDF 파일을 1일 차에 S3 Standard에서 S3 Glacier Deep Archive로 바로 전환하고, 승객이 티켓을 조회할 때 신속(Expedited) 검색을 사용합니다.",
      "- 핵심 예약 API EC2 인스턴스를 위해 3년 약정 Compute Savings Plans를 구매합니다.\n- 매일 밤 실행되는 계산 배치 작업을 위해 Auto Scaling 그룹 내에서 Amazon EC2 스팟 인스턴스(Spot Instances)를 프로비저닝합니다.\n- S3 수명 주기 정책을 구성하여 30일 후 PDF 파일을 S3 Standard에서 S3 Standard-IA로 전환하고, 90일 후 S3 Glacier Flexible Retrieval로 전환하며, 7년 후 객체를 만료(삭제)합니다.",
      "- 핵심 예약 API EC2 인스턴스를 위해 3년 약정 EC2 스팟 인스턴스(Spot Instances)를 구매합니다.\n- 매일 밤 실행되는 계산 배치 작업을 위해 1년 약정 온디맨드 용량 예약(On-Demand Capacity Reservations)을 구매합니다.\n- S3 수명 주기 정책을 구성하여 30일 후 PDF 파일을 S3 Standard에서 S3 One Zone-IA로 전환하고 7년 후 삭제합니다."
    ],
    options_en: [
      "- Purchase 1-year Regional Reserved Instances with No Upfront for the primary booking API EC2 instances.\n- Launch Amazon EC2 Dedicated Instances for the nightly calculation batch jobs.\n- Store PDF files in S3 Intelligent-Tiering and enable the Archive Access and Deep Archive Access tiers.",
      "- Run the primary booking API on On-Demand EC2 instances configured with Auto Scaling.\n- Purchase 3-year Standard Reserved Instances for the nightly calculation batch jobs.\n- Configure an S3 Lifecycle policy to transition PDF files directly from S3 Standard to S3 Glacier Deep Archive on day 1, and use Expedited retrieval when passengers access their tickets.",
      "- Purchase 3-year Compute Savings Plans for the primary booking API EC2 instances.\n- Provision Amazon EC2 Spot Instances within an Auto Scaling group for the nightly calculation batch jobs.\n- Configure an S3 Lifecycle policy to transition PDF files from S3 Standard to S3 Standard-IA after 30 days, transition to S3 Glacier Flexible Retrieval after 90 days, and expire the objects after 7 years.",
      "- Purchase 3-year EC2 Spot Instances for the primary booking API EC2 instances.\n- Purchase 1-year On-Demand Capacity Reservations for the nightly calculation batch jobs.\n- Configure an S3 Lifecycle policy to transition PDF files from S3 Standard to S3 One Zone-IA after 30 days, and delete them after 7 years."
    ],
    answer: 2,
    explanation_ko: "**정답: Option 3 (인덱스 2)**\n\n**정답인 이유:**\n1. **컴퓨팅 - 핵심 예약 API:** 핵심 예약 애플리케이션은 향후 최소 3년 동안 24/7 연중무휴로 실행되는 예측 가능하고 안정적인 기준(Baseline) 부하를 갖습니다. 3년 약정 Compute Savings Plans(또는 EC2 Instance Savings Plans)는 지속적이고 일정한 컴퓨팅 워크로드에 대해 최대 72%의 가장 높은 비용 절감 효과를 제공합니다.\n2. **컴퓨팅 - 야간 배치 처리:** 노선 및 연료 계산 워크로드는 하루 4시간만 실행되며, 컨테이너화되어 있고 내결함성(중단 가능)을 갖추고 있습니다. Amazon EC2 스팟 인스턴스(Spot Instances)는 온디맨드 대비 최대 90% 저렴하여 중단 복구가 가능한 야간 배치 작업에 가장 비용 효율적입니다.\n3. **스토리지 - 전자 항공권 및 탑승권:** 접근 패턴이 명확히 정해져 있고 예측 가능하게 감소합니다(첫 30일 빈번한 접근 → 이후 급감 → 7년 규정 준수 보관, 수 시간 내 검색 허용). S3 수명 주기(Lifecycle) 정책을 통해 30일 후 S3 Standard-IA, 90일 후 S3 Glacier Flexible Retrieval로 전환하고 7년 후 만료(삭제)시키는 것이 불필요한 모니터링 비용 없이 최저 비용을 달성하는 표준 방법입니다.\n\n---\n\n**오답인 이유:**\n- **Option 1 (인덱스 0):** 3년 동안 지속되는 안정적인 워크로드를 온디맨드로 실행하면 약정 할인을 전혀 받지 못해 비용이 낭비됩니다. 하루 4시간만 실행되는 작업에 3년 표준 예약 인스턴스를 구매하면 매일 20시간분의 유휴 용량 비용을 지불하게 됩니다. 또한 S3 Glacier Deep Archive는 신속(Expedited) 검색을 지원하지 않으며, 1일 차에 아카이브하면 첫 30일간의 빈번한 조회 요구사항을 충족할 수 없습니다.\n- **Option 2 (인덱스 1):** 스팟 인스턴스는 3년 약정으로 구매하는 상품이 아니며, 언제든 회수될 수 있으므로 중단되면 안 되는 24/7 핵심 예약 API에는 적합하지 않습니다. 온디맨드 용량 예약(Capacity Reservation)은 용량 확보만 보장할 뿐 자체적인 비용 할인 혜택이 없습니다. S3 One Zone-IA는 단일 AZ에만 저장되므로 다중 AZ 복원력이 없어 규정 준수용 필수 문서 보관에 적합하지 않습니다.\n- **Option 4 (인덱스 3):** 3년 운영이 확정된 워크로드에 선결제 없는 1년 예약 인스턴스를 사용하는 것은 3년 약정 대비 할인율이 크게 떨어집니다. 전용 인스턴스(Dedicated Instances)는 하드웨어 격리 규정이 필요할 때 사용하는 고비용 옵션으로 배치 작업 비용을 불필요하게 증가시킵니다. S3 Intelligent-Tiering은 객체당 월별 모니터링/자동화 수수료가 발생하므로, 접근 패턴이 명확하고 예측 가능한 경우에는 정적 S3 수명 주기 정책을 사용하는 것이 더 저렴합니다.",
    explanation_en: "**Correct Answer: Option 3 (Index 2)**\n\n**Why this solution is optimal:**\n1. **Compute - Core Booking API:** The core booking application has a predictable, steady-state baseline load that runs 24/7 continuously for at least 3 years. A 3-year Compute Savings Plan (or EC2 Instance Savings Plan) provides the highest possible cost savings (up to 72%) for committed, continuous compute usage.\n2. **Compute - Nightly Batch Processing:** The route and fuel calculation workload runs for only 4 hours per night, is containerized, and is fault-tolerant/stateless. Amazon EC2 Spot Instances offer up to 90% discount compared to On-Demand pricing and are the ideal choice for interruptible batch workloads.\n3. **Storage - E-Tickets & Boarding Passes:** The access pattern is known, deterministic, and declining over time (frequently accessed in the first 30 days, rarely accessed afterwards, retained for 7 years for compliance, retrieval acceptable within hours). Using S3 Lifecycle policies to transition data to S3 Standard-IA at 30 days, then to S3 Glacier Flexible Retrieval at 90 days, and expiring at 7 years optimizes storage costs without paying unnecessary automation/monitoring fees or risking availability.\n\n---\n\n**Why other options are incorrect:**\n- **Option 1 (Index 0):** Running a 3-year steady baseline on On-Demand instances pays the maximum rate and ignores available commitment discounts. Purchasing a 3-year Standard Reserved Instance for a job running only 4 hours/day results in paying for 20 hours of unused idle capacity every day. S3 Glacier Deep Archive does not support Expedited retrievals, and archiving immediately on day 1 breaks the 30-day frequent access requirement.\n- **Option 2 (Index 1):** Spot Instances cannot be purchased with a 3-year commitment, and their interruptible nature makes them unsuitable for mission-critical 24/7 booking APIs. On-Demand Capacity Reservations only guarantee compute capacity availability; they do not provide any cost discounts by themselves. S3 One Zone-IA lacks multi-AZ resilience, making it inappropriate for regulatory compliance records.\n- **Option 4 (Index 3):** A 1-year No Upfront Reserved Instance provides significantly lower cost savings than a 3-year commitment when a 3-year requirement is already known. Dedicated Instances incur additional per-hour dedicated host surcharges and are intended for regulatory hardware isolation, unnecessarily inflating batch compute costs. S3 Intelligent-Tiering incurs a monthly per-object monitoring and automation charge; when access patterns are strictly predictable and known, standard S3 Lifecycle transitions are more cost-effective."
  },
  {
    id: "gen37",
    service_id: "cost",
    conceptIds: ["cost"],
    domain_id: "principle",
    difficulty: "Medium",
    question_ko: "한 모바일 게임 개발사가 AWS에서 게임 백엔드 및 분석 인프라를 운영하고 있습니다. 해당 아키텍처는 다음과 같은 구성 요소로 이루어져 있습니다:\n• 연중무휴(24/7) 지속해서 실행되며 예측 가능하고 일정한 기준 부하(baseline workload)를 가지는 Amazon EC2 인스턴스 기반의 라이브 게임 API 서비스\n• 매일 밤 플레이어 텔레메트리 및 경기 로그를 처리하는 3시간 길이의 배치 데이터 변환 작업. 이 배치 작업은 여러 컴퓨팅 인스턴스에 걸쳐 실행되며 상태를 저장하지 않고(stateless), 인스턴스가 중단되더라도 저장된 체크포인트에서 자동으로 재개 가능함\n• Amazon S3 버킷에 저장되는 게임 리플레이 파일 및 텔레메트리 로그. 파일은 처음 30일 동안 자주 액세스됩니다. 31일에서 180일 사이에는 드물게 액세스되지만 요청 시 밀리초(ms) 단위로 즉시 액세스할 수 있어야 합니다. 180일 이후에는 규정 준수 및 장기 분석 목적으로 보관되며 3~5시간의 검색(retrieval) 지연 시간을 허용할 수 있습니다.\n\n이러한 요구 사항을 가장 비용 효율적으로 충족하는 조치 조합은 무엇입니까?",
    question_en: "A mobile game studio operates a backend and analytics infrastructure on AWS. The architecture consists of the following components:\n• Live game API services hosted on Amazon EC2 instances that run continuously 24/7 with a predictable, steady baseline workload.\n• A nightly 3-hour batch data transformation job that processes player telemetry and match logs. The batch job runs across multiple compute instances, is stateless, and can automatically resume from saved checkpoints if any instance is interrupted.\n• Game replay files and telemetry logs stored in an Amazon S3 bucket. Files are accessed frequently for the first 30 days. Between day 31 and day 180, access is infrequent, but files must be accessible within milliseconds when requested. After 180 days, the files are retained for long-term compliance and analytics, where a retrieval time of 3–5 hours is acceptable.\n\nWhich combination of actions will meet these requirements MOST cost-effectively?",
    options_ko: [
      "24/7 API EC2 인스턴스에 대해 Compute Savings Plans를 구매합니다. 야간 배치 처리 노드에는 EC2 Spot 인스턴스를 사용합니다. 30일 후 객체를 S3 Standard에서 S3 Standard-Infrequent Access(S3 Standard-IA)로 전환하고, 180일 후 S3 Glacier Flexible Retrieval로 전환하는 S3 수명 주기 정책을 생성합니다.",
      "24/7 API EC2 인스턴스와 배치 처리 노드 모두에 대해 1년 전액 선결제(All Upfront) 예약 인스턴스(Reserved Instances)를 구매합니다. 30일 후 객체를 S3 Standard에서 S3 One Zone-Infrequent Access(S3 One Zone-IA)로 전환하고, 180일 후 S3 Glacier Deep Archive로 전환하는 S3 수명 주기 정책을 생성합니다.",
      "24/7 API EC2 인스턴스에 대해 Compute Savings Plans를 구매합니다. 야간 배치 처리 노드에는 온디맨드 EC2 인스턴스를 사용합니다. 30일 후 객체를 S3 Standard에서 S3 Glacier Instant Retrieval로 전환하고, 180일 후 S3 Glacier Deep Archive로 전환하는 S3 수명 주기 정책을 생성합니다.",
      "24/7 API EC2 인스턴스와 배치 처리 노드 모두에 대해 EC2 Spot 인스턴스를 배포합니다. 30일 후 객체를 S3 Standard에서 S3 Standard-Infrequent Access(S3 Standard-IA)로 전환하고, 180일 후 S3 Glacier Flexible Retrieval로 전환하는 S3 수명 주기 정책을 생성합니다."
    ],
    options_en: [
      "Purchase Compute Savings Plans for the 24/7 API EC2 instances. Use EC2 Spot Instances for the nightly batch processing nodes. Create an S3 Lifecycle policy to transition objects from S3 Standard to S3 Standard-Infrequent Access (S3 Standard-IA) after 30 days, and to S3 Glacier Flexible Retrieval after 180 days.",
      "Purchase 1-year All Upfront Reserved Instances for both the 24/7 API EC2 instances and the batch processing nodes. Create an S3 Lifecycle policy to transition objects from S3 Standard to S3 One Zone-Infrequent Access (S3 One Zone-IA) after 30 days, and to S3 Glacier Deep Archive after 180 days.",
      "Purchase Compute Savings Plans for the 24/7 API EC2 instances. Use On-Demand EC2 Instances for the nightly batch processing nodes. Create an S3 Lifecycle policy to transition objects from S3 Standard to S3 Glacier Instant Retrieval after 30 days, and to S3 Glacier Deep Archive after 180 days.",
      "Deploy EC2 Spot Instances for both the 24/7 API EC2 instances and the batch processing nodes. Create an S3 Lifecycle policy to transition objects from S3 Standard to S3 Standard-Infrequent Access (S3 Standard-IA) after 30 days, and to S3 Glacier Flexible Retrieval after 180 days."
    ],
    answer: 0,
    explanation_ko: "**정답: Option C**\n\n**정답 해설 (Option C):**\n1. **24/7 상시 실행 컴퓨팅 (API EC2 인스턴스)**: 연중무휴 안정적이고 일정한 기준 부하를 가지는 워크로드에는 **Compute Savings Plans**(또는 예약 인스턴스)를 적용하여 온디맨드 대비 최대 66~72%의 비용을 절감하는 것이 가장 비용 효율적입니다.\n2. **단기 실행 및 내결함성 배치 컴퓨팅 (야간 3시간 작업)**: 하루 3시간만 실행되며 상태를 저장하지 않고(stateless) 체크포인트를 통해 중단 후 재개가 가능한 작업에는 온디맨드 대비 최대 90% 저렴한 **EC2 Spot 인스턴스**를 사용하는 것이 최적입니다.\n3. **스토리지 수명 주기 계층화 (S3 Lifecycle)**:\n   - **최초 30일**: 빈번한 조회를 위해 **S3 Standard** 유지.\n   - **31일~180일**: 드물게 액세스되지만 밀리초 단위의 즉시 검색이 필요하므로 **S3 Standard-Infrequent Access(S3 Standard-IA)**로 전환.\n   - **180일 이후**: 3~5시간의 검색 지연을 허용하는 장기 보관 요구 사항을 충족하기 위해 표준 검색 시간이 3~5시간인 **S3 Glacier Flexible Retrieval**로 전환.\n\n**오답 분석:**\n- **Option A가 오답인 이유**: 매일 3시간만 실행되는 배치 작업에 예약 인스턴스(RI)를 구매하면 하루 21시간 분량의 비용이 낭비됩니다. 또한 S3 Glacier Deep Archive의 표준 검색 시간은 최대 12시간(대용량은 48시간)이 걸리므로 3~5시간 검색 조건을 충족하지 못합니다.\n- **Option B가 오답인 이유**: 24/7 중단 없이 서비스되어야 하는 실시간 게임 API 서버에 Spot 인스턴스를 사용할 경우, AWS의 용량 회수로 인한 예기치 않은 인스턴스 종료 및 서비스 장애가 발생할 수 있습니다.\n- **Option D가 오답인 이유**: 중단 복구가 가능한 단기 배치 작업에 고비용의 온디맨드 인스턴스를 사용하는 것은 비용 낭비입니다. 또한 S3 Glacier Deep Archive는 3~5시간 검색 요구 사항을 만족할 수 없습니다.",
    explanation_en: "**Correct Answer: Option C**\n\n**Why Option C is correct:**\n1. **Always-On Compute (24/7 Baseline EC2)**: For workloads with steady, predictable, 24/7 utilization, **Compute Savings Plans** (or Reserved Instances) offer significant cost savings (up to 66–72% compared to On-Demand).\n2. **Interruptible, Short-Duration Batch Compute**: The 3-hour nightly data aggregation job is stateless, distributed, and fault-tolerant with checkpointing. **EC2 Spot Instances** are the most cost-effective choice here, saving up to 90% compared to On-Demand rates.\n3. **Storage Lifecycle Tiering**:\n   - **First 30 days**: Retained in **S3 Standard** for frequent access.\n   - **Days 31–180**: Transitioning to **S3 Standard-Infrequent Access (S3 Standard-IA)** after 30 days reduces storage costs while retaining millisecond retrieval times.\n   - **After 180 days**: Transitioning to **S3 Glacier Flexible Retrieval** satisfies the requirement for long-term archiving with standard retrieval times of 3–5 hours.\n\n**Distractor Analysis:**\n- **Option A is incorrect**: Purchasing Reserved Instances for a workload that runs only 3 hours per day means paying for 21 hours of unused capacity every day. Furthermore, S3 Glacier Deep Archive requires 12 to 48 hours for retrieval, which fails the 3–5 hour retrieval requirement.\n- **Option B is incorrect**: Using EC2 Spot Instances for live production 24/7 API servers introduces a high risk of service interruption and player disconnection when Spot capacity is reclaimed.\n- **Option D is incorrect**: Using On-Demand instances for interruptible, fault-tolerant batch workloads is substantially more expensive than using Spot Instances. Additionally, S3 Glacier Deep Archive does not meet the 3–5 hour retrieval time requirement."
  },
  {
    id: "gen38",
    service_id: "cost",
    conceptIds: ["cost"],
    domain_id: "principle",
    difficulty: "Medium",
    question_ko: "한 대학교가 AWS에서 온라인 학습 관리 시스템(LMS)을 운영 중이며, 월간 인프라 비용을 절감하고자 합니다. 솔루션스 아키텍트가 아키텍처를 분석하여 다음과 같은 운영 특성을 확인했습니다.\n\n- 교수진이 업로드한 원본 강의 동영상을 야간에 일괄 트랜스코딩하는 배치 작업이 실행됩니다. 트랜스코딩 소프트웨어는 컨테이너화되어 있고 상태를 저장하지 않으며(stateless), 작업이 중단되더라도 데이터 손실 없이 원활하게 재개하거나 다시 시작할 수 있습니다.\n- Amazon S3 버킷에 저장된 강의 녹화 영상은 4개월(120일)의 학기 동안 학생들이 빈번하게 조회합니다. 학기가 종료된 후에는 접근 빈도가 급격히 감소하지만, 대학 규정에 따라 인증 감사 목적으로 5년간 보관해야 하며 요청 시 3~5시간 이내에 검색(retrieval)할 수 있어야 합니다.\n- 프라이빗 서브넷에 위치한 백엔드 LMS 애플리케이션 서버들이 NAT 게이트웨이를 통해 Amazon S3에서 강의 계획서 아카이브 및 과제 제출물을 빈번히 다운로드하면서 막대한 데이터 처리 비용이 발생하고 있습니다.\n\n이러한 요구사항을 가장 비용 효율적으로 충족하는 아키텍처 변경 조합은 무엇입니까?",
    question_en: "A university operates an online learning management system (LMS) on AWS and wants to reduce its monthly infrastructure costs. A solutions architect reviews the architecture and identifies the following operational characteristics:\n\n- Nightly batch jobs transcode raw lecture videos uploaded by instructors. The transcoding software is containerized, stateless, and can seamlessly resume or restart interrupted jobs without data loss.\n- Lecture recordings stored in an Amazon S3 bucket are accessed frequently by students throughout the 4-month (120-day) academic semester. After the semester ends, access drops significantly, but university policy requires preserving the videos for 5 years for accreditation audits, with retrieval required within 3 to 5 hours.\n- Backend LMS application servers in private subnets frequently download course syllabus archives and student submissions from Amazon S3 through a NAT gateway, generating substantial data processing charges.\n\nWhich combination of architectural changes will meet these requirements MOST cost-effectively?",
    options_ko: [
      "Amazon EC2 스팟 인스턴스에서 동영상 트랜스코딩 배치 작업을 실행합니다. 강의 녹화 영상을 120일 후에 S3 Standard-Infrequent Access(S3 Standard-IA)로 전환하고, 1년 후에 S3 Glacier Flexible Retrieval로 전환하며, 5년 후에 만료(삭제)하도록 S3 수명 주기 규칙을 구성합니다. Amazon S3용 게이트웨이 VPC 엔드포인트를 생성하고 프라이빗 서브넷에 연결된 라우팅 테이블을 업데이트합니다.",
      "야간 동영상 트랜스코딩 인스턴스를 위해 3년 전액 선결제(All Upfront) Compute Savings Plans를 구매합니다. 강의 녹화 영상을 120일 후에 S3 One Zone-IA로 전환하고 5년 후에 삭제하도록 S3 수명 주기 규칙을 구성합니다. 프라이빗 서브넷에 Amazon S3용 인터페이스 VPC 엔드포인트(AWS PrivateLink)를 생성합니다.",
      "Amazon EC2 스팟 인스턴스에서 동영상 트랜스코딩 배치 작업을 실행합니다. 강의 녹화 영상을 30일 후에 S3 Glacier Deep Archive로 전환하고 5년 후에 만료(삭제)하도록 S3 수명 주기 규칙을 구성합니다. S3 데이터 전송 부하를 분산하기 위해 두 번째 가용 영역에 추가 NAT 게이트웨이를 프로비저닝합니다.",
      "동적 조정 정책이 적용된 Auto Scaling 그룹으로 관리되는 Amazon EC2 온디맨드 인스턴스에서 동영상 트랜스코딩 작업을 실행합니다. 강의 녹화 영상 버킷에 대해 S3 Intelligent-Tiering을 활성화하고 5년 보관을 위한 아카이브 정책을 구성합니다. 백엔드 애플리케이션 서버에 퍼블릭 IP 주소를 할당하고 인터넷 게이트웨이를 배포하여 S3 트래픽을 직접 라우팅합니다."
    ],
    options_en: [
      "Run the video transcoding batch jobs on Amazon EC2 Spot Instances. Configure an S3 Lifecycle rule to transition lecture recordings to S3 Standard-Infrequent Access (S3 Standard-IA) after 120 days, transition them to S3 Glacier Flexible Retrieval after 1 year, and expire them after 5 years. Create a Gateway VPC Endpoint for Amazon S3 and update the route tables associated with the private subnets.",
      "Purchase 3-year All Upfront Compute Savings Plans for the nightly video transcoding instances. Configure an S3 Lifecycle rule to transition lecture recordings to S3 One Zone-IA after 120 days and delete them after 5 years. Create an Interface VPC Endpoint (AWS PrivateLink) for Amazon S3 in the private subnets.",
      "Run the video transcoding batch jobs on Amazon EC2 Spot Instances. Configure an S3 Lifecycle rule to transition lecture recordings to S3 Glacier Deep Archive after 30 days and expire them after 5 years. Provision an additional NAT Gateway in a second Availability Zone to distribute and balance the S3 data transfer load.",
      "Run the video transcoding jobs on Amazon EC2 On-Demand Instances managed by an Auto Scaling group with dynamic scaling policies. Enable S3 Intelligent-Tiering for the lecture recordings bucket and configure an archive policy for 5-year retention. Assign public IP addresses to the backend application servers and deploy an Internet Gateway to route S3 traffic directly."
    ],
    answer: 0,
    explanation_ko: "- **컴퓨팅 비용 최적화 (EC2 스팟 인스턴스)**: 야간 동영상 트랜스코딩 작업은 상태를 저장하지 않는(stateless) 컨테이너 기반 배치 작업이며, 자동 재시도 기능을 갖추고 있어 중단을 허용할 수 있습니다. Amazon EC2 스팟 인스턴스는 온디맨드 대비 최대 90%의 비용 절감 효과를 제공하므로 장애 허용 배치 워크로드에 가장 비용 효율적인 선택입니다. Savings Plans나 예약 인스턴스는 24/7 상시 가동되는 안정적인 워크로드에 적합하며, 짧은 야간 배치 작업에는 적합하지 않습니다.\n\n- **스토리지 비용 최적화 (S3 수명 주기 정책)**: 접근 패턴이 매우 명확하고 예측 가능합니다(120일 학기 중 빈번한 접근, 학기 종료 후 드문 접근, 3~5시간 이내 검색이 필요한 5년 규정 준수 보관). 120일 후 S3 Standard-IA로 전환하면 학기 후 간헐적 조회에 필요한 밀리초 단위 검색 속도를 유지하면서 스토리지 비용을 절감할 수 있습니다. 1년 후 S3 Glacier Flexible Retrieval로 전환하면 3~5시간 표준 검색 시간 요구사항을 충족하면서 5년 감사 보관 비용을 극대화하여 절감할 수 있습니다. 30일 만에 Glacier Deep Archive로 전환하는 것은 학기 중 학생 조회를 방해하고 표준 검색에 최대 12시간이 소요되므로 요구사항에 위배됩니다. S3 One Zone-IA는 단일 AZ에만 저장되어 중요 감사 데이터에 부적합하며, S3 Intelligent-Tiering은 패턴이 예측 가능할 때 불필요한 객체당 모니터링 수수료가 발생합니다.\n\n- **데이터 전송 및 네트워크 비용 최적화 (S3용 게이트웨이 VPC 엔드포인트)**: NAT 게이트웨이를 통해 S3로 트래픽을 전송하면 시간당 요금 외에도 GB당 $0.045의 데이터 처리 요금이 발생합니다. Amazon S3용 게이트웨이 VPC 엔드포인트를 생성하고 프라이빗 서브넷 라우팅 테이블을 업데이트하면 추가 비용 없이 AWS 내부 네트워크를 통해 S3와 직접 통신하므로 NAT 게이트웨이 데이터 처리 요금을 완전히 제거할 수 있습니다. 반면 인터페이스 VPC 엔드포인트(AWS PrivateLink)는 시간당 요금 및 데이터 처리 요금이 발생합니다.",
    explanation_en: "- **Compute Cost Optimization (EC2 Spot Instances)**: The nightly video transcoding jobs are stateless, containerized, and fault-tolerant with automatic retry capabilities. Amazon EC2 Spot Instances provide up to a 90% discount compared to On-Demand pricing and are the most cost-effective compute choice for interruptible batch workloads. Savings Plans and Reserved Instances are designed for continuous 24/7 steady-state workloads, making them less cost-effective for short nightly batches.\n\n- **Storage Cost Optimization (S3 Lifecycle Policy)**: The access pattern is predictable: frequent access during the 120-day semester, followed by infrequent access, and long-term retention for 5 years with a 3–5 hour retrieval requirement. Transitioning objects to S3 Standard-IA after 120 days lowers storage costs while preserving millisecond retrieval during post-semester reviews. Transitioning to S3 Glacier Flexible Retrieval after 1 year significantly reduces long-term archival costs while satisfying the 3–5 hour standard retrieval window for compliance audits. Transitioning to Glacier Deep Archive after 30 days is incorrect because it interrupts active semester access and requires up to 12 hours for retrieval. S3 One Zone-IA lacks multi-AZ resilience for critical audit records, and S3 Intelligent-Tiering incurs unnecessary monthly per-object monitoring fees for a well-known, predictable access pattern.\n\n- **Data Transfer & Network Cost Optimization (Gateway VPC Endpoint for S3)**: Routing S3 traffic through a NAT Gateway incurs hourly charges and data processing fees ($0.045 per GB). Creating a Gateway VPC Endpoint for Amazon S3 and updating private route tables allows EC2 instances in private subnets to communicate with S3 directly over the AWS private network at no cost, completely eliminating NAT Gateway data processing fees. In contrast, Interface VPC Endpoints (AWS PrivateLink) incur hourly endpoint and data processing charges."
  },
  {
    id: "gen39",
    service_id: "hybrid",
    conceptIds: ["hybrid"],
    domain_id: "principle",
    difficulty: "Medium",
    question_ko: "한 헬스케어 스타트업이 디지털 병리 슬라이드 및 임상 영상 데이터의 급격한 증가로 인해 온프레미스 NAS(Network Attached Storage) 스토리지 용량 부족 문제를 겪고 있습니다. Windows 기반 임상 워크스테이션은 표준 SMB(Server Message Block) 프로토콜을 사용하여 최근 14일 동안 생성된 영상 데이터에 대해 지연 시간이 짧은 읽기 및 쓰기 접근 권한을 유지해야 합니다. 반면 14일이 지난 이전 영상은 규정 준수를 위해 Amazon S3에 수년간 안전하고 내구성 있게 보관되어야 합니다. 이 스타트업은 기존 클라이언트 소프트웨어나 작업 워크플로를 변경하지 않고 관리 오버헤드를 최소화할 수 있는 확장 가능한 하이브리드 솔루션을 원합니다.\n\n이러한 요구 사항을 가장 비용 효율적으로 충족하는 솔루션은 무엇입니까?",
    question_en: "A healthcare startup is experiencing rapid data growth from digital pathology slides and clinical imaging. The company's on-premises Network Attached Storage (NAS) array is running out of capacity. Clinical workstations running Windows must maintain low-latency read and write access to recently acquired scans from the past 14 days using standard Server Message Block (SMB) protocols. Older scans must be securely and durably stored in Amazon S3 for multi-year compliance retention. The startup wants a scalable hybrid solution that minimizes administrative overhead and requires no modifications to existing client software or workflows.\n\nWhich solution meets these requirements MOST cost-effectively?",
    options_ko: [
      "VPC로의 AWS Site-to-Site VPN 연결을 설정하고, 임상 워크스테이션이 VPN을 통해 Amazon Elastic File System(Amazon EFS) 파일 시스템을 직접 마운트하도록 구성합니다.",
      "온프레미스에 AWS DataSync 에이전트를 설치하여 NAS에서 Amazon S3 버킷으로 매시간 데이터 복제를 예약하고, 워크스테이션에서 필요에 따라 파일을 조회하는 커스텀 스크립트를 구현합니다.",
      "온프레미스 가상 어플라이언스로 Amazon S3 File Gateway를 배포하고, 최근 파일을 위한 로컬 캐시 스토리지를 할당한 후 S3 수명 주기 규칙이 적용된 Amazon S3 버킷 기반의 SMB 파일 공유를 제공합니다.",
      "AWS Snowball Edge Storage Optimized 디바이스를 로컬 네트워크에 연결하여 SMB 타깃으로 마운트하고, AWS Backup을 사용하여 이전 파일을 Amazon S3 Glacier로 자동 동기화하도록 구성합니다."
    ],
    options_en: [
      "Establish an AWS Site-to-Site VPN connection to the VPC and configure clinical workstations to mount an Amazon Elastic File System (Amazon EFS) file system directly over the VPN.",
      "Install an AWS DataSync agent on-premises to schedule hourly data replication from the NAS to an Amazon S3 bucket, and implement custom scripts on workstations to retrieve files on demand.",
      "Deploy an Amazon S3 File Gateway as a virtual appliance on-premises, allocate local cache storage for recent files, and present an SMB file share backed by an Amazon S3 bucket with S3 Lifecycle rules.",
      "Connect an AWS Snowball Edge Storage Optimized device to the local network, mount it as an SMB target, and use AWS Backup to automatically sync older files to Amazon S3 Glacier."
    ],
    answer: 2,
    explanation_ko: "### 해설\n\n**정답: 온프레미스 가상 어플라이언스로 Amazon S3 File Gateway를 배포하고, 최근 파일을 위한 로컬 캐시 스토리지를 할당한 후 S3 수명 주기 규칙이 적용된 Amazon S3 버킷 기반의 SMB 파일 공유를 제공합니다.**\n\n#### 핵심 아키텍처 개념:\nAWS 하이브리드 연동 서비스 선택 기준:\n1. **네트워크 연결**: Site-to-Site VPN(빠르고 경제적) vs. Direct Connect(일관된 대역폭 및 초저지연).\n2. **데이터 마이그레이션**: AWS DataSync(네트워크 기반 대용량 전송) vs. Snow Family(오프라인 물리적 대용량 이동).\n3. **하이브리드 스토리지 확장**: AWS Storage Gateway(기존 프로토콜인 SMB/NFS/iSCSI를 유지하며 클라우드로 스토리지 용량 확장 및 로컬 캐싱 제공).\n\n#### 정답인 이유:\n- **Amazon S3 File Gateway(AWS Storage Gateway 제품군)**는 표준 파일 프로토콜(SMB 및 NFS)을 사용하여 온프레미스 환경과 Amazon S3 스토리지를 완벽하게 연결합니다.\n- Windows 임상 워크스테이션은 클라이언트 에이전트 설치나 워크플로 변경 없이 기존 방식대로 SMB 네트워크 드라이브를 마운트하여 사용할 수 있습니다.\n- 온프레미스 VM에 구성된 **로컬 캐시**를 통해 최근 14일 동안의 최신 고용량 의료 영상 데이터를 로컬 디스크 수준의 짧은 지연 시간으로 읽고 쓸 수 있습니다.\n- 백엔드 S3 버킷에 저장된 파일은 **S3 수명 주기(Lifecycle)** 정책을 통해 보관 기간(14일 이상) 경과 시 S3 Glacier 등으로 자동 전환되어 장기 규정 준수 비용을 최소화합니다.\n\n---\n\n#### 오답인 이유:\n- **Option 0 (Site-to-Site VPN + Amazon EFS)**: Amazon EFS는 NFSv4 프로토콜을 사용하므로 Windows 워크스테이션의 표준 SMB 환경에 부합하지 않으며, WAN/VPN을 통한 원격 마운트는 대용량 의료 영상 접근 시 네트워크 지연 시간을 유발합니다.\n- **Option 1 (AWS DataSync + 커스텀 스크립트)**: AWS DataSync는 데이터 마이그레이션 및 일괄 전송 도구이며, 엔드유저에게 실시간 파일 시스템 인터페이스와 로컬 캐시를 제공하지 못합니다. 커스텀 스크립트 유지보수는 높은 관리 오버헤드를 발생시킵니다.\n- **Option 3 (AWS Snowball Edge + AWS Backup)**: Snowball Edge는 오프라인 대용량 데이터 이전 및 엣지 컴퓨팅을 위한 임시 장비로, 상시 온프레미스 NAS를 클라우드로 원활하게 확장하는 하이브리드 게이트웨이 용도로 적합하지 않습니다.",
    explanation_en: "### Explanation\n\n**Correct Answer: Deploy an Amazon S3 File Gateway as a virtual appliance on-premises, allocate local cache storage for recent files, and present an SMB file share backed by an Amazon S3 bucket with S3 Lifecycle rules.**\n\n#### Key Architectural Concepts Tested:\nWhen deciding on AWS hybrid integration services:\n1. **Network Connectivity**: AWS Site-to-Site VPN (quick/cost-effective) vs. AWS Direct Connect (consistent bandwidth, low latency).\n2. **Data Movement/Migration**: AWS DataSync (scheduled/online data transfer) vs. AWS Snow Family (offline bulk data transfer).\n3. **Hybrid Storage Extension**: AWS Storage Gateway (extends on-premises storage capacity to AWS using standard storage protocols like SMB/NFS/iSCSI while maintaining local cache).\n\n#### Why the Correct Option is Best:\n- **Amazon S3 File Gateway (part of AWS Storage Gateway)** enables on-premises applications to seamlessly store objects in Amazon S3 using standard file storage protocols (SMB and NFS).\n- Windows clinical workstations can mount the SMB share natively without installing additional software or altering existing user workflows.\n- It provides a **local cache** on-premises to deliver low-latency access to recently written and read medical imaging data (the required 14-day window).\n- Data written to the gateway is asynchronously uploaded as native objects to an Amazon S3 bucket, where **S3 Lifecycle rules** can automatically transition older scans to cost-effective storage classes (e.g., S3 Glacier Flexible Retrieval or Deep Archive) for multi-year compliance retention.\n\n---\n\n#### Why Other Options Are Incorrect:\n- **Option 0 (Site-to-Site VPN + Amazon EFS)**: Amazon EFS natively uses the NFSv4 protocol (not native SMB for Windows clients) and mounting file systems across a VPN over the public internet introduces network latency that fails the low-latency requirement for heavy medical imaging.\n- **Option 1 (AWS DataSync + Custom Scripts)**: AWS DataSync is designed for data migration and scheduled batch transfers, not for providing an interactive, real-time file share interface with local caching for end-user workstations. Using custom scripts adds significant administrative overhead and alters client workflows.\n- **Option 3 (AWS Snowball Edge + AWS Backup)**: AWS Snowball Edge devices are designed for edge computing and one-time/bulk data transfer jobs, not as a permanent, continuously synchronizing hybrid storage extension for on-premises NAS arrays."
  },
  {
    id: "gen40",
    service_id: "hybrid",
    conceptIds: ["hybrid"],
    domain_id: "principle",
    difficulty: "Medium",
    question_ko: "한 지역 항공사가 온프레미스 공항 데이터 센터에서 레거시 항공편 좌석 및 예약 시스템을 운영하고 있습니다. 이 항공사는 최근 고객용 항공권 예약 포털과 탑승 수속 마이크로서비스를 단일 AWS 리전 내 여러 Amazon VPC에 분산하여 배포했습니다. 성수기 연휴 기간 동안 공용 인터넷 정체로 인해 기존 AWS Site-to-Site VPN 연결을 통한 온프레미스 인벤토리 데이터베이스 쿼리 시 간헐적인 연결 시간 초과(Timeout)가 발생하고 있습니다. 항공사는 일관된 네트워크 성능과 짧은 지연 시간을 제공하는 전용 프라이빗 연결을 필요로 합니다. 또한, 최소한의 운영 오버헤드로 현재 및 향후 추가될 모든 VPC 간의 네트워크 연결을 중앙에서 간소화하여 관리할 수 있어야 합니다. 이러한 요구 사항을 충족하는 솔루션은 무엇입니까?",
    question_en: "A regional airline operates a legacy flight inventory and reservation system in its on-premises airport data center. The airline recently migrated its customer-facing booking portal and passenger check-in microservices across multiple Amazon VPCs in a single AWS Region. During peak holiday travel seasons, the booking applications experience intermittent connection timeouts when querying the on-premises inventory database over an existing AWS Site-to-Site VPN connection due to public internet congestion. The airline requires a dedicated private connection that provides consistent network performance and low latency. Additionally, the solution must centrally manage and simplify network connectivity across all current and future VPCs with minimal operational overhead. Which solution meets these requirements?",
    options_ko: [
      "온프레미스 데이터 센터에 대한 AWS Direct Connect 연결을 프로비저닝하고, 각 VPC와 연결된 가상 프라이빗 게이트웨이(VGW)에 대해 개별 프라이빗 가상 인터페이스(Private VIF)를 생성합니다.",
      "온프레미스에 AWS DataSync 에이전트를 배포하여 AWS Site-to-Site VPN 연결을 통해 항공편 인벤토리 데이터베이스를 Amazon Aurora와 지속적으로 동기화합니다.",
      "각 VPC에 연결된 개별 가상 프라이빗 게이트웨이(VGW)에 AWS Global Accelerator가 활성화된 AWS Site-to-Site VPN을 배포합니다.",
      "온프레미스 데이터 센터에 대한 AWS Direct Connect 연결을 프로비저닝하고, Direct Connect 게이트웨이를 생성한 후 모든 VPC를 상호 연결하는 AWS Transit Gateway에 연결합니다."
    ],
    options_en: [
      "Provision an AWS Direct Connect connection to the on-premises data center and create separate private virtual interfaces (private VIFs) for each Virtual Private Gateway (VGW) attached to each VPC.",
      "Deploy AWS DataSync agents on-premises to continuously synchronize the flight inventory database with Amazon Aurora over an AWS Site-to-Site VPN connection.",
      "Deploy an AWS Site-to-Site VPN with AWS Global Accelerator enabled, terminating the VPN connections on individual Virtual Private Gateways (VGWs) attached to each VPC.",
      "Provision an AWS Direct Connect connection to the on-premises data center, create a Direct Connect gateway, and attach it to an AWS Transit Gateway that interconnects all the VPCs."
    ],
    answer: 3,
    explanation_ko: "**정답:** 온프레미스 데이터 센터에 대한 AWS Direct Connect 연결을 프로비저닝하고, Direct Connect 게이트웨이를 생성한 후 모든 VPC를 상호 연결하는 AWS Transit Gateway에 연결합니다.\n\n**정답인 이유:**\n- **전용 프라이빗 연결 및 일관된 성능:** AWS Direct Connect는 온프레미스 데이터 센터와 AWS 간에 공용 인터넷을 우회하는 전용 물리적 네트워크 회선을 제공합니다. 이를 통해 인터넷 정체 문제를 해결하고 항공편 좌석 쿼리에 필요한 일관된 대역폭과 예측 가능한 짧은 지연 시간(Low Latency)을 보장합니다.\n- **중앙 집중식 관리 및 최소 운영 오버헤드:** AWS Transit Gateway는 여러 VPC와 온프레미스 네트워크를 허브 앤 스포크(Hub-and-Spoke) 형태로 중앙에서 연결하는 클라우드 라우터 역할을 합니다. Direct Connect 게이트웨이와 전송 가상 인터페이스(Transit VIF)를 통해 Transit Gateway를 연결하면, 향후 새로운 VPC가 추가되더라도 Transit Gateway에 연결하기만 하면 되므로 네트워크 구성 및 라우팅 관리가 대폭 간소화됩니다.\n\n**오답 설명:**\n- **각 VPC에 연결된 개별 VGW에 AWS Site-to-Site VPN을 배포하는 옵션이 오답인 이유:** Site-to-Site VPN은 여전히 기본 전송망으로 공용 인터넷을 사용하므로 성수기 트래픽 급증 시 전용 물리적 회선 수준의 일관된 성능과 안정성을 보장할 수 없습니다. 또한 각 VPC의 VGW마다 개별 VPN 터널을 구성하는 것은 운영 오버헤드가 큽니다.\n- **각 VPC의 VGW에 개별 프라이빗 가상 인터페이스(Private VIF)를 생성하는 옵션이 오답인 이유:** Direct Connect를 사용하더라도 각 VPC의 VGW에 개별 Private VIF를 1:1로 직접 연결하면 VPC가 늘어날 때마다 새로운 VIF와 BGP 세션을 설정해야 하므로 확장성이 떨어지고 운영 복잡성이 크게 증가합니다. Transit Gateway를 활용하는 것이 모범적인 아키텍처입니다.\n- **온프레미스에 AWS DataSync 에이전트를 배포하는 옵션이 오답인 이유:** AWS DataSync는 파일 및 객체 데이터를 일괄/주기적으로 마이그레이션하거나 동기화하는 서비스입니다. 웹 애플리케이션과 온프레미스 트랜잭션 데이터베이스 간의 실시간 쿼리 및 통신을 처리하기 위한 네트워크 솔루션이 아닙니다.",
    explanation_en: "**Correct Answer:** Provision an AWS Direct Connect connection to the on-premises data center, create a Direct Connect gateway, and attach it to an AWS Transit Gateway that interconnects all the VPCs.\n\n**Why it is correct:**\n- **Dedicated Private Connectivity & Predictable Performance:** AWS Direct Connect establishes a dedicated physical network connection between the on-premises data center and AWS, completely bypassing the public internet. This resolves internet congestion issues and delivers consistent bandwidth with deterministic low latency for real-time booking queries.\n- **Centralized Management with Least Operational Overhead:** AWS Transit Gateway functions as a cloud router in a hub-and-spoke topology, interconnecting multiple VPCs and on-premises networks. By associating a Direct Connect gateway with AWS Transit Gateway via a transit virtual interface (transit VIF), the airline can centrally manage connectivity for all current and future VPCs without provisioning separate point-to-point connections for each VPC.\n\n**Why the other options are incorrect:**\n- **Deploy an AWS Site-to-Site VPN with AWS Global Accelerator enabled... is incorrect:** Site-to-Site VPN relies on public internet transport, which cannot guarantee the dedicated physical capacity and consistent latency required during peak booking periods. Additionally, managing individual Virtual Private Gateways (VGWs) across multiple VPCs introduces high administrative overhead.\n- **Provision an AWS Direct Connect connection... and create separate private virtual interfaces (private VIFs) for each VGW... is incorrect:** Directly connecting private VIFs to individual VGWs requires separate BGP sessions and routing configurations for every single VPC. This approach does not scale easily as new VPCs are added and creates substantial operational overhead compared to using AWS Transit Gateway.\n- **Deploy AWS DataSync agents on-premises to continuously synchronize the flight inventory database... is incorrect:** AWS DataSync is designed for automated batch and scheduled data transfer of files and objects. It is not an OLTP database replication tool or a network connectivity solution for live transactional queries between application microservices and a legacy database."
  },
  {
    id: "gen41",
    service_id: "hybrid",
    conceptIds: ["hybrid"],
    domain_id: "principle",
    difficulty: "Medium",
    question_ko: "모바일 게임 개발 스튜디오의 사내 오피스에서 그래픽 아티스트와 사운드 디자이너들이 대용량 멀티미디어 에셋 및 게임 빌드를 제작하고 협업하고 있습니다. 팀원들은 로컬 SMB 파일 공유를 통해 이러한 에셋에 접근합니다. 출시 예정인 신작 게임이 늘어남에 따라 스튜디오의 온프레미스 NAS(Network Attached Storage) 장비의 물리적 저장 공간이 부족해지고 있습니다.\n\n스튜디오는 다음 요구사항을 충족하면서 스토리지 용량을 AWS로 확장하는 하이브리드 스토리지 솔루션을 도입하고자 합니다:\n- 크리에이티브 워크스테이션에서 설정 변경이나 별도 클라이언트 소프트웨어 설치 없이 기존 표준 SMB 파일 공유 프로토콜을 그대로 사용해야 합니다.\n- 최근 생성되었거나 자주 접근하는 에셋에 대해 짧은 지연 시간(low-latency)의 로컬 접근 성능을 제공해야 합니다.\n- 장기 보관 및 확장성을 위해 데이터가 Amazon S3에 비용 효율적으로 저장되어야 합니다.\n\n가장 적은 운영 오버헤드로 이러한 요구사항을 충족하는 솔루션은 무엇입니까?",
    question_en: "A mobile game studio has an on-premises development office where artists and sound designers collaborate on large multimedia assets and game builds. The team accesses these assets through local SMB file shares. Due to several upcoming game launches, the studio's on-premises Network Attached Storage (NAS) array is running out of physical storage capacity.\n\nThe studio needs a hybrid storage solution that extends capacity to AWS while meeting the following requirements:\n- Creative workstations must continue accessing files over standard SMB file shares without configuration changes or new client software.\n- The solution must provide low-latency access to recently created and frequently accessed assets.\n- Data must be stored cost-effectively in Amazon S3 for long-term retention and scalability.\n\nWhich solution meets these requirements with the LEAST operational overhead?",
    options_ko: [
      "온프레미스 가상 머신에 AWS DataSync 에이전트를 설정하여 로컬 NAS에서 Amazon S3로 매시간 동기화 작업을 수행합니다. 워크스테이션이 SFTP를 통해 필요한 파일을 다운로드할 수 있도록 AWS Transfer Family 서버를 구성합니다.",
      "온프레미스 가상 머신에 AWS Storage Gateway의 S3 File Gateway를 배포합니다. Amazon S3 버킷과 매핑된 SMB 파일 공유를 생성하고 로컬 캐시 디스크를 구성한 뒤, 워크스테이션이 해당 로컬 게이트웨이에 연결하도록 합니다.",
      "온프레미스에 AWS Storage Gateway의 Volume Gateway를 저장 볼륨(Stored Volume) 모드로 배포합니다. 스토리지를 iSCSI 타겟으로 워크스테이션에 제공하고 클라우드 백업을 위해 정기적인 Amazon EBS 스냅샷을 생성합니다.",
      "VPC에 Amazon FSx for Windows File Server 파일 시스템을 배포합니다. AWS Site-to-Site VPN 연결을 설정하고 크리에이티브 워크스테이션이 VPN을 통해 원격 FSx 파일 시스템을 직접 마운트하도록 구성합니다."
    ],
    options_en: [
      "Set up an AWS DataSync agent on an on-premises virtual machine to execute hourly scheduled sync tasks from the local NAS to Amazon S3. Configure an AWS Transfer Family server so workstations can download hot files via SFTP.",
      "Deploy an AWS Storage Gateway S3 File Gateway as a virtual machine on-premises. Create an SMB file share mapped to an Amazon S3 bucket, configure a local cache disk, and have the workstations connect to the local gateway.",
      "Deploy an AWS Storage Gateway Volume Gateway in Stored Volume mode on-premises. Expose the storage as an iSCSI target to workstations and create periodic Amazon EBS snapshots for cloud backup.",
      "Deploy an Amazon FSx for Windows File Server file system in a VPC. Establish an AWS Site-to-Site VPN connection and configure creative workstations to mount the remote FSx file system directly over the VPN."
    ],
    answer: 1,
    explanation_ko: "**정답: B**\n\n**정답인 이유 (Option B):**\nAWS Storage Gateway의 **S3 File Gateway**는 온프레미스 환경과 클라우드 스토리지를 원활하게 연결하는 하이브리드 스토리지 서비스입니다. 로컬 클라이언트에 표준 파일 인터페이스(NFS 또는 SMB)를 제공하면서 데이터를 Amazon S3 버킷에 객체 형태로 비동기 저장합니다.\n- **기존 워크플로우 유지:** 크리에이티브 워크스테이션에서 별도의 클라이언트 소프트웨어나 복잡한 설정 변경 없이 기존과 동일하게 로컬 SMB 파일 공유로 마운트하여 사용할 수 있습니다.\n- **낮은 지연 시간(Low Latency):** 온프레미스 게이트웨이에 로컬 캐시 디스크를 구성하여 최근에 생성되거나 자주 접근하는 핫 데이터를 로컬 네트워크 속도로 빠르게 읽고 쓸 수 있습니다.\n- **비용 효율성 및 무제한 확장:** 기본 데이터가 Amazon S3에 저장되므로 온프레미스 NAS의 용량 한계 문제를 해결하고 사용한 만큼만 비용을 지불하는 높은 비용 효율성을 제공합니다.\n\n---\n\n**오답인 이유:**\n- **Option A가 오답인 이유:** Site-to-Site VPN을 통해 클라우드에 있는 Amazon FSx for Windows File Server를 직접 마운트하면 대용량 멀티미디어 파일 작업 시 인터넷/VPN 네트워크 지연이 발생하며 로컬 캐싱 기능이 제공되지 않습니다. 또한 S3 대비 스토리지 비용이 높습니다.\n- **Option C가 오답인 이유:** AWS DataSync는 주기적인 배치 데이터 전송 및 마이그레이션 도구이며, 실시간 대화형 파일 시스템 역할을 대체할 수 없습니다. 또한 AWS Transfer Family(SFTP)를 도입하면 기존의 투명한 SMB 마운트 워크플로우가 깨지고 아티스트가 별도로 파일을 업로드/다운로드해야 하는 운영 오버헤드가 발생합니다.\n- **Option D가 오답인 이유:** Volume Gateway의 *저장 볼륨(Stored Volume)* 모드는 전체 원본 데이터를 온프레미스에 보관하고 EBS 스냅샷으로 백업만 클라우드에 전송하므로 온프레미스 스토리지 용량 부족 문제를 해결할 수 없습니다. 또한 Volume Gateway는 블록 스토리지(iSCSI) 인터페이스를 제공하므로 여러 워크스테이션이 동시에 공유하는 파일 공유 시스템(SMB)으로 적합하지 않습니다.",
    explanation_en: "**Correct Answer: B**\n\n**Why Option B is correct:**\nAWS Storage Gateway's **S3 File Gateway** seamlessly bridges on-premises environments and cloud storage. It presents a standard file-based interface (NFS or SMB) to local clients while asynchronously persisting data as objects in Amazon S3. \n- **Preserves existing workflow:** Creative workstations can mount standard SMB shares without needing custom client software or workflow adjustments.\n- **Low latency:** A local cache disk stores recently read and written working assets on-premises, delivering sub-millisecond local network speeds for hot data.\n- **Scalable & Cost-effective:** The primary repository is Amazon S3, solving the on-premises NAS capacity exhaustion with pay-as-you-go cloud economics.\n\n---\n\n**Why other options are incorrect:**\n- **Option A is incorrect:** Mounting an Amazon FSx for Windows File Server remotely over a Site-to-Site VPN introduces noticeable latency and bandwidth constraints when artists interact with large multimedia assets. Additionally, it lacks local caching on-premises and is more expensive than storing assets directly in Amazon S3.\n- **Option C is incorrect:** AWS DataSync is designed for automated, scheduled batch data migrations and transfers, not as a continuous interactive file system. Replacing SMB file shares with SFTP via AWS Transfer Family breaks the seamless local workflow and requires new tools/client interactions.\n- **Option D is incorrect:** Volume Gateway in *Stored Volume* mode maintains the entire primary dataset on-premises and only backs up point-in-time snapshots to EBS, which fails to solve the physical NAS capacity exhaustion. Furthermore, Volume Gateway provides iSCSI block-level targets rather than multi-client shared SMB file systems for artist workstations."
  },
  {
    id: "gen42",
    service_id: "hybrid",
    conceptIds: ["hybrid"],
    domain_id: "principle",
    difficulty: "Medium",
    question_ko: "한 대학교에서 학생 서비스, 라이브 비디오 스트리밍, 강의 관리, 학습 분석 등을 위해 동일한 AWS 리전 내의 여러 Amazon VPC에 걸쳐 온라인 학습 포털을 운영하고 있습니다. 모든 VPC의 워크로드는 캠퍼스 온프레미스 데이터 센터에 위치한 레거시 학생 정보 시스템(SIS)을 조회하고 로컬 Active Directory 서버를 통해 사용자를 인증하기 위해 전용의 일관된 고대역폭과 짧은 지연 시간을 갖춘 네트워크 연결이 필요합니다. 또한 대학교는 향후 1년 동안 수십 개의 학과별 VPC를 추가할 계획이며, 네트워크 복잡성과 운영 오버헤드를 최소화하는 솔루션을 원합니다.\n\n이러한 요구 사항을 충족하기 위해 솔루션 아키텍트가 추천해야 하는 솔루션은 무엇입니까?",
    question_en: "A university hosts its online learning portal on AWS across multiple Amazon VPCs in the same AWS Region, including separate VPCs for student services, live video streaming, course management, and learning analytics. The workloads in all VPCs require dedicated, consistent high-throughput, and low-latency network connectivity to the university's on-premises campus data center to query the legacy Student Information System (SIS) and authenticate users against local Active Directory servers. Additionally, the university plans to add dozens of new departmental VPCs over the next year and wants a solution that minimizes network complexity and operational overhead.\n\nWhich solution should a solutions architect recommend to meet these requirements?",
    options_ko: [
      "모든 VPC 간에 풀 메시(full-mesh) VPC 피어링 연결을 구성합니다. 캠퍼스 데이터 센터의 고객 게이트웨이(Customer Gateway)에서 각 VPC의 가상 프라이빗 게이트웨이(VGW)로 연결되는 AWS Site-to-Site VPN을 각각 생성합니다.",
      "각 VPC에 AWS Storage Gateway 볼륨 게이트웨이(Volume Gateway)를 배포합니다. 각 Storage Gateway와 캠퍼스 데이터 센터 라우터 사이에 IPsec VPN 터널을 구성하여 네트워크 트래픽을 동기화합니다.",
      "AWS Transit Gateway를 생성하고 기존 및 신규 VPC를 모두 Transit Gateway에 연결합니다. AWS Direct Connect 연결을 설정하고, 전송 가상 인터페이스(Transit VIF)를 사용하여 Direct Connect 게이트웨이와 연결한 후, Direct Connect 게이트웨이를 Transit Gateway에 연결합니다.",
      "프라이빗 가상 인터페이스(Private VIF)가 연결된 Direct Connect 게이트웨이와 AWS Direct Connect 연결을 설정합니다. Direct Connect 게이트웨이에 연결된 중앙 허브 VPC를 생성하고, 다른 모든 VPC를 이 허브 VPC와 피어링하여 캠퍼스 트래픽을 라우팅합니다."
    ],
    options_en: [
      "Configure a full mesh of VPC peering connections between all VPCs. Establish an AWS Site-to-Site VPN connection from the customer gateway in the campus data center to a virtual private gateway in each VPC.",
      "Deploy an AWS Storage Gateway Volume Gateway in each VPC. Configure an IPsec VPN tunnel between each Storage Gateway and the campus data center router to synchronize network traffic.",
      "Create an AWS Transit Gateway and attach all existing and new VPCs to it. Establish an AWS Direct Connect connection, associate it with a Direct Connect gateway using a transit virtual interface (transit VIF), and attach the Direct Connect gateway to the Transit Gateway.",
      "Set up an AWS Direct Connect connection with private virtual interfaces (private VIFs) attached to a Direct Connect gateway. Create a central hub VPC connected to the Direct Connect gateway and peer all other VPCs to the hub VPC to route campus traffic."
    ],
    answer: 2,
    explanation_ko: "- 정답 (B): AWS Transit Gateway는 여러 VPC와 온프레미스 네트워크를 중앙에서 상호 연결하는 클라우드 라우터 역할을 합니다. Direct Connect 게이트웨이 및 전송 가상 인터페이스(Transit VIF)를 통해 AWS Direct Connect와 연동하면 캠퍼스 데이터 센터와 여러 VPC 간에 전용의 일관된 고대역폭과 초저지연 네트워크 연결을 제공합니다. 향후 새로운 학과별 VPC가 추가되더라도 Transit Gateway에 연결(Attachment)만 추가하면 되므로 네트워크 복잡성과 운영 오버헤드가 최소화됩니다.\n- 오답 (A): AWS Site-to-Site VPN은 공용 인터넷을 통해 트래픽을 전송하므로 Direct Connect와 같은 일관된 고대역폭 및 저지연 전용선을 보장하지 못합니다. 또한 수십 개 VPC에 대해 개별 VPN 터널과 풀 메시(full-mesh) VPC 피어링을 구성·관리하는 것은 막대한 운영 오버헤드를 발생시킵니다.\n- 오답 (C): VPC 피어링은 전이적 라우팅(Transitive Routing)을 지원하지 않습니다. 따라서 온프레미스에서 Direct Connect로 연결된 중앙 허브 VPC를 통과하여 피어링된 다른 스포크 VPC로 트래픽을 전달하는 에지 투 에지(edge-to-edge) 라우팅이 불가능합니다.\n- 오답 (D): AWS Storage Gateway는 온프레미스 블록/파일/테이프 스토리지를 AWS 클라우드(S3/EBS)로 확장하기 위한 하이브리드 스토리지 서비스이며, 애플리케이션 및 데이터베이스 쿼리 트래픽을 라우팅하기 위한 네트워크 연결 솔루션이 아닙니다.",
    explanation_en: "- Option B is correct: AWS Transit Gateway acts as a central cloud router connecting multiple VPCs and on-premises networks. When integrated with AWS Direct Connect using a Direct Connect gateway and a Transit Virtual Interface (Transit VIF), it provides dedicated, low-latency, and consistent high-throughput connectivity to multiple VPCs from the campus data center. As dozens of new departmental VPCs are added, they can simply be attached to the Transit Gateway, minimizing network complexity and operational overhead.\n- Option A is incorrect: AWS Site-to-Site VPN routes traffic over the public internet, which cannot guarantee consistent high throughput or dedicated low latency compared to Direct Connect. Moreover, managing separate VPN connections and full-mesh VPC peering for dozens of VPCs introduces extreme operational overhead.\n- Option C is incorrect: VPC peering does not support transitive routing (edge-to-edge routing). Traffic originating from on-premises cannot traverse through a central hub VPC via VPC peering to reach other spoke VPCs.\n- Option D is incorrect: AWS Storage Gateway is a hybrid storage service used for block, file, or tape storage integration with Amazon S3 and EBS, not a networking solution for routing TCP/IP application traffic and database queries between VPCs and on-premises infrastructure."
  },
  {
    id: "gen43",
    service_id: "ha",
    conceptIds: ["ha"],
    domain_id: "principle",
    difficulty: "Medium",
    question_ko: "한 헬스케어 전자의무기록(EHR) 스타트업이 AWS 환경에 규정 준수 웹 애플리케이션을 배포하고 있습니다. 애플리케이션 계층은 프라이빗 서브넷의 Amazon EC2 인스턴스에서 실행되며, 환자의 검사 결과를 처리하기 위해 인터넷을 통해 외부 의료 검사기관 API에 안정적으로 접근해야 합니다. 애플리케이션의 진료 기록 데이터는 Amazon RDS for MySQL 데이터베이스에 저장됩니다. 스타트업은 모든 계층에서 단일 장애점(SPOF)을 제거하고 수동 개입 없는 자동 장애 조치를 지원하는 고가용성 및 내결함성 아키텍처를 구현하고자 합니다.\n\n이러한 요구 사항을 충족하는 솔루션은 무엇입니까?",
    question_en: "A healthcare records startup is deploying a HIPAA-compliant electronic health record (EHR) web application on AWS. The application tier runs on Amazon EC2 instances in private subnets and must reliably access external medical laboratory APIs over the internet to retrieve patient lab results. The application stores clinical records in an Amazon RDS for MySQL database. The startup requires a highly available, fault-tolerant architecture that eliminates all single points of failure across all tiers and provides automatic failover with zero manual intervention.\n\nWhich solution meets these requirements?",
    options_ko: [
      "2개의 가용 영역(AZ)에 걸친 퍼블릭 서브넷에 Application Load Balancer를 배포합니다. 2개의 프라이빗 서브넷에 걸쳐 EC2 인스턴스용 Auto Scaling 그룹을 구성합니다. 두 프라이빗 서브넷의 아웃바운드 인터넷 트래픽 처리를 위해 하나의 퍼블릭 서브넷에 단일 NAT Gateway를 배포합니다. Amazon RDS for MySQL DB 인스턴스를 Multi-AZ 구성으로 배포합니다.",
      "2개의 가용 영역에 걸친 퍼블릭 서브넷에 Application Load Balancer를 배포합니다. 두 가용 영역 모두의 프라이빗 서브넷에 걸치도록 EC2 인스턴스용 Auto Scaling 그룹을 구성합니다. 아웃바운드 인터넷 연결을 위해 각 가용 영역의 퍼블릭 서브넷마다 NAT Gateway를 각각 배포합니다. Amazon RDS for MySQL DB 인스턴스를 Multi-AZ 구성으로 배포합니다.",
      "2개의 가용 영역에 걸친 퍼블릭 서브넷에 Application Load Balancer를 배포합니다. 최소 용량이 2개인 EC2 인스턴스 Auto Scaling 그룹을 단일 프라이빗 서브넷에만 국한하여 구성합니다. 각 퍼블릭 서브넷마다 NAT Gateway를 배포합니다. Amazon RDS for MySQL DB 인스턴스를 Multi-AZ 구성으로 배포합니다.",
      "2개의 가용 영역에 걸친 퍼블릭 서브넷에 Application Load Balancer를 배포합니다. 2개의 프라이빗 서브넷에 걸쳐 EC2 인스턴스용 Auto Scaling 그룹을 구성합니다. 각 퍼블릭 서브넷마다 NAT Gateway를 배포합니다. Amazon RDS for MySQL DB 인스턴스를 단일 가용 영역에 배포하고 두 번째 가용 영역에 비동기 읽기 전용 복제본(Read Replica)을 생성합니다."
    ],
    options_en: [
      "Deploy an Application Load Balancer in public subnets across two Availability Zones. Configure an Auto Scaling group for EC2 instances across two private subnets. Deploy a single NAT Gateway in one public subnet for outbound internet traffic from both private subnets. Deploy an Amazon RDS for MySQL DB instance in a Multi-AZ configuration.",
      "Deploy an Application Load Balancer in public subnets across two Availability Zones. Configure an Auto Scaling group for EC2 instances spanning private subnets across both Availability Zones. Deploy a NAT Gateway in each public subnet in each Availability Zone for outbound internet connectivity. Deploy an Amazon RDS for MySQL DB instance in a Multi-AZ deployment.",
      "Deploy an Application Load Balancer in public subnets across two Availability Zones. Configure an Auto Scaling group for EC2 instances confined to a single private subnet with a minimum capacity of two instances. Deploy a NAT Gateway in each public subnet. Deploy an Amazon RDS for MySQL DB instance in a Multi-AZ deployment.",
      "Deploy an Application Load Balancer in public subnets across two Availability Zones. Configure an Auto Scaling group for EC2 instances across two private subnets. Deploy a NAT Gateway in each public subnet. Deploy an Amazon RDS for MySQL DB instance in a single Availability Zone with an asynchronous Read Replica in a second Availability Zone."
    ],
    answer: 1,
    explanation_ko: "모든 계층에서 단일 장애점(SPOF)을 제거하고 고가용성(High Availability) 및 내결함성을 달성하기 위한 올바른 AWS 아키텍처 구성은 다음과 같습니다:\n\n1. **웹/애플리케이션 계층:** 다중 가용 영역(Multi-AZ)에 걸친 Application Load Balancer(ALB)와 여러 AZ의 프라이빗 서브넷에 분산된 Auto Scaling 그룹을 사용하여 특정 AZ 장애 시에도 서비스가 지속되도록 합니다.\n2. **네트워크/아웃바운드 계층:** NAT Gateway는 단일 AZ 내에서는 자체 이중화되지만 AZ 간 장애 복구는 지원하지 않습니다. 따라서 단일 NAT Gateway만 사용할 경우 해당 AZ 장애 시 모든 프라이빗 서브넷의 외부 인터넷 통신(외부 검사기관 API 호출)이 차단되는 단일 장애점(SPOF)이 됩니다. 고가용성을 위해서는 각 AZ의 퍼블릭 서브넷마다 개별 NAT Gateway를 배치하고 각 프라이빗 라우팅 테이블이 로컬 AZ의 NAT Gateway를 가리키도록 구성해야 합니다.\n3. **데이터베이스 계층:** Amazon RDS Multi-AZ 배포는 다른 AZ의 대기 인스턴스로 동기식 복제를 수행하며, 기본 인스턴스 장애 시 다운타임 및 수동 개입 없이 자동으로 장애 조치(Failover)를 수행합니다.\n\n**오답 분석:**\n- **보기 1 (단일 NAT Gateway):** NAT Gateway가 위치한 AZ 장애 시 외부 API 통신이 전면 중단되므로 네트워크 계층에 단일 장애점(SPOF)이 존재합니다.\n- **보기 2 (단일 AZ + Read Replica):** RDS 읽기 전용 복제본(Read Replica)은 비동기 복제 방식이며 주 DB 장애 시 수동 승격 및 엔드포인트 수정이 필요하므로 자동 장애 조치를 제공하지 못합니다.\n- **보기 4 (단일 서브넷 ASG):** Auto Scaling 그룹이 단일 프라이빗 서브넷(단일 AZ)에 국한되어 있어 해당 AZ 장애 시 컴퓨팅 계층 전체가 중단됩니다.",
    explanation_en: "To design a truly highly available and fault-tolerant architecture on AWS that eliminates all single points of failure (SPOF) across every tier:\n\n1. **Web/App Compute Tier:** Deploying an Application Load Balancer (ALB) across multiple Availability Zones alongside an Auto Scaling group spanning subnets in multiple AZs ensures that application instances automatically scale and survive the complete loss of an AZ.\n2. **Network/Outbound Tier:** Although a NAT Gateway is redundant within a single AZ, it does not span multiple AZs. If an architecture deploys only a single NAT Gateway, an outage in that specific AZ will sever outbound internet connectivity for private subnets across all AZs (breaking access to third-party lab APIs). True high availability requires a NAT Gateway deployed in each AZ's public subnet, with private route tables directing traffic to their local AZ's NAT Gateway.\n3. **Database Tier:** Amazon RDS Multi-AZ provides synchronous data replication to a standby instance in another AZ with automated failover upon primary instance failure.\n\n**Why other options are incorrect:**\n- **Option 1 (Single NAT Gateway):** Creates a single point of failure at the network tier for outbound API calls if the AZ hosting the NAT Gateway experiences an outage.\n- **Option 2 (Single-AZ with Read Replica):** Standard RDS Read Replicas use asynchronous replication and require manual promotion/DNS updates during failover, which does not provide seamless, automated high availability.\n- **Option 4 (Single Subnet ASG):** Placing the Auto Scaling group within a single private subnet leaves the entire compute tier vulnerable to a single AZ failure."
  },
  {
    id: "gen44",
    service_id: "ha",
    conceptIds: ["ha"],
    domain_id: "principle",
    difficulty: "Medium",
    question_ko: "한 지역 항공사가 핵심 항공권 예약 및 좌석 배정 플랫폼을 AWS로 마이그레이션하고 있습니다. 이 플랫폼은 프라이빗 서브넷의 Amazon EC2 인스턴스에서 호스팅되는 웹/API 애플리케이션 계층과 관계형 PostgreSQL 데이터베이스 계층으로 구성됩니다. 애플리케이션 인스턴스는 인터넷을 통해 외부 결제 처리 API 및 글로벌 항공 유통 시스템을 빈번하게 호출해야 합니다. 회사는 단일 가용 영역(AZ)에 장애가 발생하더라도 항공권 예약 업무나 외부 결제 처리가 중단되지 않도록 모든 계층에 걸쳐 최고의 고가용성 및 내결함성을 요구합니다.\n\n이러한 요구 사항을 충족하기 위해 솔루션스 아키텍트가 추천해야 하는 아키텍처는 무엇입니까?",
    question_en: "A regional airline is migrating its mission-critical flight booking and seat reservation platform to AWS. The platform consists of a web/API application layer hosted on Amazon EC2 instances in private subnets and a relational PostgreSQL database layer. The application instances must frequently call external payment processing APIs and global airline distribution systems over the internet. The company requires maximum high availability and fault tolerance across all tiers, ensuring that the failure of any single Availability Zone will not disrupt passenger booking operations or external payment processing.\n\nWhich architecture should a solutions architect recommend to satisfy these requirements?",
    options_ko: [
      "단일 가용 영역에 Network Load Balancer를 배포하여 여러 프라이빗 서브넷의 EC2 인스턴스로 트래픽을 라우팅합니다. 각 프라이빗 서브넷에 EC2 NAT 인스턴스를 배포합니다. 매시간 자동 스냅샷이 생성되도록 구성된 단일 가용 영역의 Amazon RDS DB 인스턴스를 사용합니다.",
      "여러 가용 영역에 걸쳐 Application Load Balancer를 배포하고 단일 가용 영역의 EC2 인스턴스로 라우팅합니다. 아웃바운드 연결을 위해 단일 NAT 게이트웨이가 있는 AWS Transit Gateway를 배포합니다. 다중 AZ 배포를 사용하는 Amazon RDS DB 인스턴스를 구성합니다.",
      "여러 가용 영역에 걸쳐 Application Load Balancer를 배포하여 여러 프라이빗 서브넷에 걸친 EC2 인스턴스의 Auto Scaling 그룹으로 트래픽을 전달합니다. 외부 결제 API 트래픽을 위해 각 가용 영역의 퍼블릭 서브넷마다 NAT 게이트웨이를 배치합니다. Amazon RDS 다중 AZ(Multi-AZ) DB 인스턴스 배포를 사용합니다.",
      "여러 가용 영역에 걸쳐 Application Load Balancer를 배포하여 여러 프라이빗 서브넷에 걸친 EC2 인스턴스의 Auto Scaling 그룹으로 트래픽을 전달합니다. 외부 결제 API 트래픽을 위해 단일 퍼블릭 서브넷에 하나의 NAT 게이트웨이를 생성합니다. 데이터베이스 고가용성을 위해 교차 AZ 읽기 전용 복제본(Read Replica)이 있는 Amazon RDS DB 인스턴스를 구성합니다."
    ],
    options_en: [
      "Deploy a Network Load Balancer in a single Availability Zone routing traffic to EC2 instances across multiple private subnets. Deploy an EC2 NAT instance in each private subnet. Use an Amazon RDS DB instance deployed in a single Availability Zone with automated snapshots every hour.",
      "Deploy an Application Load Balancer across multiple Availability Zones routing to EC2 instances in a single Availability Zone. Deploy an AWS Transit Gateway with a single NAT Gateway for outbound connectivity. Configure an Amazon RDS DB instance with Multi-AZ deployment.",
      "Deploy an Application Load Balancer across multiple Availability Zones forwarding traffic to an Auto Scaling group of EC2 instances spanning multiple private subnets. Provision a NAT Gateway in the public subnet of each Availability Zone for outbound payment API traffic. Use an Amazon RDS Multi-AZ DB instance deployment.",
      "Deploy an Application Load Balancer across multiple Availability Zones forwarding traffic to an Auto Scaling group of EC2 instances spanning multiple private subnets. Create a single NAT Gateway in one public subnet for outbound payment API traffic. Configure an Amazon RDS DB instance with cross-AZ read replicas for database high availability."
    ],
    answer: 2,
    explanation_ko: "전체 아키텍처에서 완벽한 고가용성(HA)을 달성하고 모든 단일 장애점(SPOF)을 제거하기 위해서는 각 계층별로 다중 AZ 이중화가 구성되어야 합니다:\n\n1. **웹/애플리케이션 계층**: 여러 가용 영역(AZ)에 걸쳐 배포된 Application Load Balancer(ALB)와 여러 AZ의 프라이빗 서브넷에 걸친 Auto Scaling 그룹을 결합하면 특정 AZ 장애 시에도 정상 AZ의 인스턴스로 트래픽이 원활하게 분산되고 자동 복구가 이루어집니다.\n2. **아웃바운드 / NAT 게이트웨이 계층**: 프라이빗 서브넷의 인스턴스가 외부 결제 게이트웨이 및 글로벌 항공 유통망 API와 통신하려면 NAT 게이트웨이가 필요합니다. NAT 게이트웨이는 특정 AZ에 배포되는 리소스이므로 단일 NAT 게이트웨이만 사용할 경우 해당 AZ 장애 시 다른 모든 AZ의 인스턴스도 인터넷 아웃바운드 연결이 끊어지는 단일 장애점이 됩니다. 따라서 각 AZ의 퍼블릭 서브넷마다 개별 NAT 게이트웨이를 배치하고 각 AZ의 프라이빗 라우팅 테이블을 독립적으로 구성해야 합니다.\n3. **데이터베이스 계층**: Amazon RDS 다중 AZ(Multi-AZ) 배포는 다른 AZ의 예비(Standby) 인스턴스로 데이터를 동기식 복제하며, 장애 발생 시 자동으로 장애 조치(Failover)를 수행합니다. 일반 읽기 전용 복제본(Read Replica)은 비동기 복제 방식이자 읽기 트래픽 분산 목적이므로 자동 장애 조치를 지원하지 않습니다.\n\n- **보기 A는 오답입니다**: 단일 NAT 게이트웨이가 아웃바운드 결제 트래픽의 단일 장애점(SPOF)이 되며, 읽기 전용 복제본은 자동 동기식 장애 조치를 제공하지 않습니다.\n- **보기 B는 오답입니다**: 단일 AZ 로드 밸런서 및 단일 AZ RDS 인스턴스는 여러 계층에 걸쳐 단일 장애점을 남기므로 고가용성을 만족하지 못합니다.\n- **보기 D는 오답입니다**: EC2 인스턴스를 단일 AZ에만 배치하면 컴퓨팅 계층의 내결함성이 완전히 상실되며, 단일 NAT 게이트웨이 역시 아웃바운드 장애점이 됩니다.",
    explanation_en: "To achieve complete high availability (HA) and eliminate all single points of failure (SPOF) across the entire architecture:\n\n1. **Web/App Layer**: Deploying an Application Load Balancer (ALB) across multiple Availability Zones (AZs) along with an Auto Scaling group spanning private subnets across multiple AZs ensures that incoming requests are distributed evenly and that compute capacity survives the failure of an entire AZ.\n2. **Outbound / NAT Gateway Layer**: Private EC2 instances require outbound internet connectivity to communicate with third-party payment gateways and airline distribution APIs. Because a NAT Gateway is an AZ-redundant managed service within its own AZ, placing a single NAT Gateway creates a single point of failure (if that AZ fails, instances in other AZs lose egress connectivity). Best practice dictates deploying a separate NAT Gateway in each AZ's public subnet and routing the corresponding private subnets locally.\n3. **Database Layer**: Amazon RDS Multi-AZ deployment maintains a synchronous standby replica in a different AZ and provides automatic failover without manual intervention. Standard Read Replicas use asynchronous replication primarily for read offloading and do not provide seamless automatic failover.\n\n- **Option A is incorrect**: A single NAT Gateway represents a single point of failure for outbound payment transactions, and Read Replicas do not provide automatic synchronous failover.\n- **Option B is incorrect**: A single-AZ Load Balancer, single-AZ RDS DB instance, and manual snapshot restoration do not meet high availability or zero-downtime fault tolerance requirements.\n- **Option D is incorrect**: Restricting EC2 instances to a single AZ creates a compute-tier single point of failure, and using a single NAT Gateway leaves the egress path vulnerable to AZ outages."
  },
  {
    id: "gen45",
    service_id: "ha",
    conceptIds: ["ha"],
    domain_id: "principle",
    difficulty: "Medium",
    question_ko: "한 모바일 게임 개발사에서 신작 실시간 멀티플레이어 턴제 게임을 위해 AWS 기반의 백엔드 인프라를 설계하고 있습니다. 이 아키텍처는 Application Load Balancer(ALB), 프라이빗 서브넷에서 매치메이킹 서비스를 실행하는 Amazon EC2 인스턴스, 플레이어 프로필 및 랭킹 데이터를 저장하는 Amazon RDS for PostgreSQL 데이터베이스로 구성됩니다. 또한 EC2 인스턴스는 인터넷상의 외부 서드파티 안티치트(Anti-cheat) 검증 서버로 정기적인 아웃바운드 HTTPS 요청을 전송해야 합니다.\n\n개발사는 단일 가용 영역(AZ) 장애가 발생하더라도 서비스가 중단되지 않도록 전체 솔루션이 고가용성(HA)과 내결함성(Fault Tolerance)을 갖추고, 모든 아키텍처 계층에서 단일 장애점(SPOF)이 없도록 구성하고자 합니다.\n\n이러한 요구사항을 충족하는 아키텍처 구성은 무엇입니까?",
    question_en: "A mobile game studio is designing the backend infrastructure on AWS for its upcoming real-time multiplayer turn-based game. The architecture consists of an Application Load Balancer (ALB), Amazon EC2 instances in private subnets running matchmaking services, and an Amazon RDS for PostgreSQL database storing player profile and ranking data. The EC2 instances must also make periodic outbound HTTPS requests to external third-party anti-cheat verification servers on the internet.\n\nThe studio requires the entire solution to be highly available, fault-tolerant, and resilient against an Availability Zone (AZ) outage, ensuring there is no single point of failure (SPOF) across any architectural tier.\n\nWhich combination of actions will meet these requirements?",
    options_ko: [
      "3개 AZ의 퍼블릭 서브넷에 걸쳐 ALB를 배포합니다. 3개 AZ의 프라이빗 서브넷에 걸쳐 EC2 인스턴스용 Auto Scaling 그룹을 구성합니다. 3개 AZ의 퍼블릭 서브넷 각각에 NAT 게이트웨이를 배포하고, 각 프라이빗 라우팅 테이블이 동일한 AZ에 위치한 NAT 게이트웨이로 트래픽을 라우팅하도록 구성합니다. Amazon RDS for PostgreSQL을 다중 AZ(Multi-AZ)로 배포합니다.",
      "3개 AZ의 퍼블릭 서브넷에 걸쳐 ALB를 배포합니다. 동일한 3개 AZ의 프라이빗 서브넷에 걸쳐 EC2 인스턴스용 Auto Scaling 그룹을 구성합니다. 하나의 퍼블릭 서브넷에 단일 NAT 게이트웨이를 배포하고 모든 프라이빗 서브넷의 아웃바운드 트래픽을 이 NAT 게이트웨이로 라우팅합니다. Amazon RDS for PostgreSQL을 다중 AZ(Multi-AZ)로 배포합니다.",
      "3개 AZ의 퍼블릭 서브넷에 걸쳐 ALB를 배포합니다. 단일 AZ 내의 프라이빗 서브넷에 EC2 인스턴스용 Auto Scaling 그룹을 구성합니다. 3개 퍼블릭 서브넷 각각에 NAT 게이트웨이를 배포합니다. 두 번째 AZ에 비동기 읽기 전용 복제본(Read Replica)을 갖춘 Amazon RDS for PostgreSQL을 구성합니다.",
      "단일 퍼블릭 서브넷에 ALB를 배포합니다. 2개 AZ의 프라이빗 서브넷에 걸쳐 EC2 인스턴스용 Auto Scaling 그룹을 구성합니다. 2개 AZ의 퍼블릭 서브넷에 NAT 게이트웨이를 배포합니다. 자동 일일 스냅샷이 활성화된 단일 인스턴스로 Amazon RDS for PostgreSQL을 구성합니다."
    ],
    options_en: [
      "Deploy the ALB across public subnets in three AZs. Configure an Auto Scaling group for the EC2 instances spanning private subnets across the three AZs. Deploy a NAT Gateway in a public subnet in each of the three AZs, and configure private route tables to route traffic to the NAT Gateway in their respective AZ. Configure Amazon RDS for PostgreSQL in a Multi-AZ deployment.",
      "Deploy the ALB across public subnets in three AZs. Configure an Auto Scaling group for the EC2 instances spanning private subnets across the three AZs. Deploy a single NAT Gateway in one public subnet, and route all private subnet outbound traffic through this NAT Gateway. Configure Amazon RDS for PostgreSQL in a Multi-AZ deployment.",
      "Deploy the ALB across public subnets in three AZs. Configure an Auto Scaling group for the EC2 instances in a private subnet within a single AZ. Deploy a NAT Gateway in each of the three public subnets. Configure Amazon RDS for PostgreSQL with an asynchronous Read Replica in a second AZ.",
      "Deploy the ALB in a single public subnet. Configure an Auto Scaling group for the EC2 instances across private subnets in two AZs. Deploy NAT Gateways in public subnets across two AZs. Configure Amazon RDS for PostgreSQL as a single-instance DB with automated daily snapshots enabled."
    ],
    answer: 0,
    explanation_ko: "정답은 C(세 번째 옵션)입니다. 모든 아키텍처 계층에서 단일 장애점(SPOF)을 완전히 제거하고 완벽한 고가용성(HA)을 제공하기 때문입니다.\n\n1. 로드 밸런싱 계층: 3개 가용 영역(AZ)에 걸친 퍼블릭 서브넷에 ALB 배포.\n2. 컴퓨팅 계층: 3개 AZ의 프라이빗 서브넷에 분산된 EC2 Auto Scaling 그룹 구성.\n3. 네트워크/아웃바운드 계층: 각 AZ마다 독립적인 NAT 게이트웨이를 배포하고, 각 프라이빗 서브넷이 동일한 AZ의 NAT 게이트웨이를 통해 인터넷으로 나가도록 라우팅 테이블 구성. 특정 AZ에 장애가 발생해도 다른 AZ의 아웃바운드 인터넷 통신에 영향을 주지 않음.\n4. 데이터베이스 계층: 동기식 복제 및 자동 장애 조치(Failover)를 제공하는 Amazon RDS 다중 AZ(Multi-AZ) 배포 구성.\n\n오답 분석:\n- Option A는 오답입니다. 단일 NAT 게이트웨이만 프로비저닝하면 네트워크 아웃바운드 단일 장애점(SPOF)이 발생합니다. 해당 NAT 게이트웨이가 있는 AZ에 장애가 발생하면 다른 AZ의 모든 프라이빗 EC2 인스턴스가 서드파티 안티치트 서버로의 외부 통신을 할 수 없게 됩니다.\n- Option B는 오답입니다. Auto Scaling 그룹이 단일 AZ에만 한정되어 있어 컴퓨팅 계층의 고가용성을 만족하지 못합니다. 또한 RDS 읽기 전용 복제본(Read Replica)은 비동기 복제 방식이며 장애 조치 시 수동 승격이 필요하므로 다중 AZ 자동 장애 조치를 대체할 수 없습니다.\n- Option D는 오답입니다. 단일 서브넷에 ALB를 배포하는 것은 로드 밸런싱 계층의 SPOF이며, 단일 AZ RDS의 자동 스냅샷 기능은 AZ 장애 시 즉각적인 고가용성(HA)이나 자동 장애 조치를 제공하지 못합니다.",
    explanation_en: "Option C is the correct answer because it provides complete high availability (HA) and eliminates all Single Points of Failure (SPOFs) across all architectural tiers:\n1. Load Balancing Tier: ALB deployed across multiple public subnets spanning three Availability Zones (AZs).\n2. Compute Tier: Auto Scaling group distributing EC2 instances across private subnets in three AZs.\n3. Networking/Egress Tier: A NAT Gateway deployed in each AZ with private subnets routing outbound traffic through the local NAT Gateway in their respective AZ. If a single AZ fails, outbound internet connectivity for the surviving AZs remains unaffected.\n4. Database Tier: Amazon RDS for PostgreSQL configured with Multi-AZ deployment for automated synchronous replication and failover.\n\nWhy the other options are incorrect:\n- Option A is incorrect because deploying a single NAT Gateway creates a single point of failure at the networking tier. If the AZ hosting the single NAT Gateway experiences an outage, all EC2 instances in all private subnets lose their outbound connectivity to the anti-cheat servers.\n- Option B is incorrect because placing the Auto Scaling group in a single AZ introduces a compute SPOF. Furthermore, an RDS Read Replica uses asynchronous replication and requires manual promotion during an outage, unlike automated Multi-AZ failover.\n- Option D is incorrect because an ALB requires subnets in at least two AZs to be highly available (a single subnet ALB is a SPOF), and automated snapshots for a single-AZ RDS instance do not provide automated high availability or fast recovery during an AZ outage."
  }
];

function getAllQuestions() {
  return QUESTION_BANK;
}

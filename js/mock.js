export const banners = [
  {
    id: 1,
    image: 'https://picsum.photos/seed/xiangqi1/750/330',
    title: '2026春季象棋公开赛',
    linkType: 'activity',
    linkId: 1,
  },
  {
    id: 2,
    image: 'https://picsum.photos/seed/xiangqi2/750/330',
    title: '青少年象棋训练营',
    linkType: 'activity',
    linkId: 2,
  },
  {
    id: 3,
    image: 'https://picsum.photos/seed/xiangqi3/750/330',
    title: '象棋大师公益讲座',
    linkType: 'activity',
    linkId: 3,
  },
];

export const gridItems = [
  { id: 1, icon: '🏆', label: '赛事报名', action: 'route', route: '#/activities' },
  { id: 9, icon: '📰', label: '实时资讯', action: 'route', route: '#/articles' },
  { id: 2, icon: '📖', label: '协会简介', action: 'route', route: '#/about' },
  { id: 8, icon: '🎯', label: '等级评定', action: 'toast', message: '功能开发中，敬请期待' },
];

export const activities = [
  {
    id: 1,
    title: '2026朝阳区春季象棋公开赛',
    cover: 'https://picsum.photos/seed/act1/400/300',
    status: 'open',
    startTime: '2026-06-15 09:00',
    endTime: '2026-06-15 18:00',
    location: '朝阳区体育馆',
    address: '北京市朝阳区工体北路8号',
    fee: 50,
    capacity: 64,
    enrolled: 38,
    organizer: '朝阳区象棋协会',
    registerDeadline: '2026-06-10 23:59',
    rules: '一、参赛资格\n面向朝阳区象棋爱好者，年龄不限，身体健康。\n\n二、竞赛办法\n采用积分制，共赛七轮，每轮50分钟，每步30秒加秒。\n\n三、奖励办法\n各组前三名颁发奖杯及证书，第四至八名颁发优胜奖。',
    supplementaryRules: '1. 参赛选手须提前15分钟到场签到，迟到15分钟视为弃权。\n2. 比赛期间禁止使用手机等电子设备，违者判负。\n3. 组委会保留对竞赛规则的最终解释权。',
    groupList: [
      { name: '成人组 A 组', members: ['王明', '李强', '张伟', '刘洋', '陈磊', '赵军', '孙浩', '周杰'] },
      { name: '成人组 B 组', members: ['吴刚', '郑华', '冯涛', '钱进', '黄勇', '林峰', '何亮', '马超'] },
      { name: '青少年组', members: ['小明', '小红', '小刚', '小丽', '小华', '小强', '小芳', '小军'] },
    ],
  },
  {
    id: 2,
    title: '青少年象棋暑期训练营',
    cover: 'https://picsum.photos/seed/act2/400/300',
    status: 'open',
    startTime: '2026-07-10 08:30',
    endTime: '2026-08-20 17:00',
    location: '协会培训中心',
    address: '北京市朝阳区望京街道阜通东大街1号',
    fee: 2800,
    capacity: 30,
    enrolled: 22,
    organizer: '朝阳区象棋协会',
    registerDeadline: '2026-07-05 18:00',
    rules: '一、招生对象\n6-16岁青少年，零基础或有基础均可报名。\n\n二、课程设置\n每周一至周五上午授课，内容包括开局、中局、残局及实战对弈。\n\n三、结业考核\n训练营结束进行综合测评，合格者颁发培训证书。',
    supplementaryRules: '1. 学员须自备象棋及笔记本。\n2. 请假需提前告知教练，累计缺课超过3次不予退费。\n3. 训练期间遵守课堂纪律，服从教练安排。',
    groupList: [
      { name: '初级班', members: ['张小明', '李小红', '王小刚', '赵小丽', '刘小华', '陈小强'] },
      { name: '提高班', members: ['孙小峰', '周小杰', '吴小亮', '郑小涛', '冯小勇', '钱小进'] },
    ],
  },
  {
    id: 3,
    title: '象棋大师公益讲座',
    cover: 'https://picsum.photos/seed/act3/400/300',
    status: 'open',
    startTime: '2026-05-28 14:00',
    endTime: '2026-05-28 16:30',
    location: '朝阳区图书馆',
    address: '北京市朝阳区芍药居北里301号',
    fee: 0,
    capacity: 100,
    enrolled: 67,
    organizer: '朝阳区象棋协会',
    registerDeadline: '2026-05-25 12:00',
    rules: '一、讲座主题\n象棋文化与中局战术精讲。\n\n二、参与方式\n免费向公众开放，凭报名编号入场，座位有限，先到先得。\n\n三、注意事项\n请保持会场安静，讲座期间可进行笔记记录。',
    supplementaryRules: '1. 讲座结束后设有互动问答环节，欢迎棋友提问。\n2. 现场禁止录音录像，如需资料请关注公众号获取。\n3. 未成年人须由家长陪同入场。',
    groupList: [
      { name: '已报名听众（部分）', members: ['棋友A', '棋友B', '棋友C', '棋友D', '棋友E', '棋友F', '棋友G', '棋友H'] },
    ],
  },
  {
    id: 4,
    title: '2025冬季象棋邀请赛',
    cover: 'https://picsum.photos/seed/act4/400/300',
    status: 'ended',
    startTime: '2025-12-20 09:00',
    endTime: '2025-12-20 17:00',
    location: '朝阳区文化中心',
    address: '北京市朝阳区朝阳公园南路1号',
    fee: 30,
    capacity: 48,
    enrolled: 48,
    organizer: '朝阳区象棋协会',
    registerDeadline: '2025-12-15 18:00',
    rules: '2025年度冬季邀请赛竞赛规程（已归档）。\n\n比赛采用积分制，共赛五轮，各轮对阵由电脑抽签决定。',
    supplementaryRules: '本赛事已圆满结束，规程仅供查阅。',
    groupList: [
      { name: '甲组', members: ['冠军-王明', '亚军-李强', '季军-张伟'] },
    ],
  },
  {
    id: 5,
    title: '社区象棋友谊赛',
    cover: 'https://picsum.photos/seed/act5/400/300',
    status: 'open',
    startTime: '2026-06-01 09:00',
    endTime: '2026-06-01 15:00',
    location: '望京社区活动中心',
    address: '北京市朝阳区望京西园四区',
    fee: 0,
    capacity: 32,
    enrolled: 32,
    organizer: '朝阳区象棋协会',
    registerDeadline: '2026-05-28 18:00',
    rules: '一、参赛对象\n望京街道各社区居民及象棋爱好者。\n\n二、比赛形式\n设团体赛与个人赛，团体赛每队3人，个人赛采用积分制。\n\n三、奖励\n各项目前三名将获得纪念品及证书。',
    supplementaryRules: '1. 比赛当日请携带身份证件签到。\n2. 友谊第一，比赛第二，服从裁判判罚。\n3. 如遇恶劣天气，比赛时间另行通知。',
    groupList: [
      { name: '望京西园队', members: ['队员甲', '队员乙', '队员丙'] },
      { name: '望京花园队', members: ['队员丁', '队员戊', '队员己'] },
      { name: '个人赛 A 组', members: ['选手1', '选手2', '选手3', '选手4'] },
    ],
  },
];

export const articles = [
  {
    id: 1,
    title: '2026春季象棋公开赛报名火热进行中',
    cover: 'https://picsum.photos/seed/article1/600/360',
    summary: '朝阳区春季象棋公开赛现已开放报名，欢迎全区棋友踊跃参与，共设成人组与青少年组。',
    publishedAt: '2026-05-22 09:30',
    blocks: [
      { type: 'paragraph', text: '2026朝阳区春季象棋公开赛将于6月15日在朝阳区体育馆举行。本次赛事由朝阳区象棋协会主办，面向全区象棋爱好者开放报名。' },
      { type: 'image', src: 'https://picsum.photos/seed/article1b/750/420', caption: '往届比赛现场' },
      { type: 'paragraph', text: '比赛采用积分制，共赛七轮。报名截止日期为6月10日，名额有限，请尽早通过小程序完成报名。' },
    ],
  },
  {
    id: 2,
    title: '象棋大师许银川将莅临协会开展公益讲座',
    cover: 'https://picsum.photos/seed/article2/600/360',
    summary: '著名象棋特级大师许银川将于本月底亲临朝阳区象棋协会，为棋友带来精彩公益讲座。',
    publishedAt: '2026-05-20 16:00',
    blocks: [
      { type: 'paragraph', text: '应朝阳区象棋协会邀请，象棋特级大师许银川将于5月28日下午在朝阳区图书馆举办公益讲座，主题为中局战术与实战心得。' },
      { type: 'image', src: 'https://picsum.photos/seed/article2b/750/420', caption: '讲座预告海报' },
      { type: 'paragraph', text: '讲座免费向公众开放，名额100人，请通过活动预约通道提前报名，凭报名编号入场。' },
      { type: 'image', src: 'https://picsum.photos/seed/article2c/750/420', caption: '朝阳区图书馆讲座厅' },
    ],
  },
  {
    id: 3,
    title: '青少年象棋暑期训练营开始招生',
    cover: 'https://picsum.photos/seed/article3/600/360',
    summary: '为期六周的系统象棋训练营面向6-16岁青少年招生，配备专业教练一对一辅导。',
    publishedAt: '2026-05-18 11:20',
    blocks: [
      { type: 'paragraph', text: '朝阳区象棋协会青少年暑期训练营现已开始招生。训练营将于7月10日开班，课程涵盖开局原理、中局战术、残局技巧及实战对弈。' },
      { type: 'image', src: 'https://picsum.photos/seed/article3b/750/420', caption: '训练营课堂场景' },
      { type: 'paragraph', text: '配备资深教练团队，小班授课，结业颁发培训证书。早鸟优惠截止7月5日，欢迎家长咨询报名。' },
    ],
  },
  {
    id: 4,
    title: '协会棋手王明获全国业余棋王赛北京赛区季军',
    cover: 'https://picsum.photos/seed/article4/600/360',
    summary: '协会推荐选手王明在刚刚结束的全国业余棋王赛北京赛区中脱颖而出，获得第三名。',
    publishedAt: '2026-05-15 10:00',
    blocks: [
      { type: 'paragraph', text: '在刚刚结束的2026全国业余棋王赛北京赛区比赛中，由朝阳区象棋协会推荐的选手王明表现出色，一路过关斩将，最终获得第三名。' },
      { type: 'image', src: 'https://picsum.photos/seed/article4b/750/420', caption: '王明在颁奖仪式' },
      { type: 'paragraph', text: '王明表示，感谢协会长期以来的培养与支持。协会对王明表示热烈祝贺，并将继续发掘和培养更多优秀棋手。' },
    ],
  },
  {
    id: 5,
    title: '象棋进校园活动走进朝阳实验小学',
    cover: 'https://picsum.photos/seed/article5/600/360',
    summary: '协会教练团队为200余名小学生带来生动有趣的象棋入门课程，现场气氛热烈。',
    publishedAt: '2026-05-10 14:45',
    blocks: [
      { type: 'paragraph', text: '4月8日，朝阳区象棋协会"象棋进校园"活动走进朝阳实验小学。200余名三年级学生参与了此次象棋入门体验课。' },
      { type: 'image', src: 'https://picsum.photos/seed/article5b/750/420', caption: '学生们正在学习象棋规则' },
      { type: 'paragraph', text: '教练们用通俗易懂的方式讲解象棋基本走法，学生们踊跃参与互动。协会计划在本学期内走进更多学校，让象棋文化在青少年中生根发芽。' },
    ],
  },
];

export const news = [
  {
    id: 1,
    title: '朝阳区象棋协会2026年度工作计划发布',
    summary: '新一年，协会将继续推进象棋普及工作，举办更多赛事与培训活动。',
    date: '2026-05-10',
    content: '2026年，朝阳区象棋协会将以"普及象棋文化、培养青少年棋手"为核心目标，计划举办春季公开赛、暑期训练营、社区友谊赛等多项活动。\n\n协会还将加强与各中小学的合作，推进象棋进校园项目，让更多青少年感受象棋魅力。\n\n欢迎广大棋友关注协会公众号，获取最新活动信息。',
  },
  {
    id: 2,
    title: '我协会棋手在全国业余棋王赛中获佳绩',
    summary: '协会推荐选手王明在2026全国业余棋王赛北京赛区中获得第三名。',
    date: '2026-04-22',
    content: '在刚刚结束的2026全国业余棋王赛北京赛区比赛中，由朝阳区象棋协会推荐的选手王明表现出色，一路过关斩将，最终获得第三名的好成绩。\n\n王明表示，感谢协会提供的训练平台和比赛机会，未来将继续努力，争取更好成绩。\n\n协会对王明表示祝贺，也将继续发掘和培养更多优秀棋手。',
  },
  {
    id: 3,
    title: '象棋进校园活动走进朝阳实验小学',
    summary: '协会教练团队为200余名小学生带来精彩的象棋入门课程。',
    date: '2026-04-08',
    content: '4月8日，朝阳区象棋协会"象棋进校园"活动走进朝阳实验小学。协会资深教练为200余名三年级学生带来了生动有趣的象棋入门课程。\n\n课堂上，教练们用通俗易懂的方式讲解象棋基本规则，学生们踊跃参与互动，现场气氛热烈。\n\n协会计划在本学期内走进更多学校，让象棋文化在青少年中生根发芽。',
  },
  {
    id: 4,
    title: '关于调整协会办公地址的通知',
    summary: '自2026年5月1日起，协会办公地址迁至新址，请棋友留意。',
    date: '2026-03-28',
    content: '各位棋友：\n\n因业务发展需要，朝阳区象棋协会办公地址自2026年5月1日起迁至：北京市朝阳区望京街道阜通东大街1号。\n\n办公时间：周一至周五 9:00-17:00。\n\n咨询电话：010-12345678。\n\n给您带来不便，敬请谅解。',
  },
];

export const aboutInfo = {
  title: '朝阳区象棋协会',
  intro: '朝阳区象棋协会成立于2010年，是朝阳区内推广象棋运动、组织赛事活动、培养象棋人才的专业社会团体。\n\n协会现有注册会员800余人，其中包括多名国家二级运动员及业余棋王。协会每年举办各类赛事10余场，培训青少年棋手500余人次。\n\n我们的使命是：传承象棋文化，普及象棋运动，培养优秀棋手，推动朝阳区象棋事业蓬勃发展。',
  heroImage: 'https://picsum.photos/seed/about/750/400',
  contact: {
    address: '北京市朝阳区望京街道阜通东大街1号',
    phone: '010-12345678',
    email: 'chaoyang-xiangqi@example.com',
    wechat: 'cy_xiangqi',
    hours: '周一至周五 9:00-17:00',
  },
};

export function getActivityById(id) {
  return activities.find(a => a.id === Number(id)) || null;
}

export function getArticleById(id) {
  return articles.find(a => a.id === Number(id)) || null;
}

export function getNewsById(id) {
  return news.find(n => n.id === Number(id)) || null;
}

export function getOpenActivities(limit) {
  const open = activities.filter(a => {
    if (a.status === 'ended') return false;
    const enrolled = a.enrolled;
    return enrolled < a.capacity || a.status === 'open';
  });
  return limit ? open.slice(0, limit) : open;
}

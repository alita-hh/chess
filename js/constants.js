export const CHESS_TYPES = [
  { value: 'weiqi', label: '围棋' },
  { value: 'gomoku', label: '五子棋' },
  { value: 'chess', label: '国际象棋' },
  { value: 'xiangqi', label: '象棋' },
  { value: 'checkers', label: '国际跳棋' },
];

export const ID_TYPES = [
  { value: 'id_card', label: '身份证' },
  { value: 'passport', label: '护照' },
  { value: 'hk_macao', label: '港澳通行证' },
  { value: 'taiwan', label: '台胞证' },
  { value: 'other', label: '其他' },
];

export const GENDERS = [
  { value: 'male', label: '男' },
  { value: 'female', label: '女' },
  { value: 'other', label: '其他' },
];

export const REVIEW_STATUS = {
  pending_first: { label: '待初审', cls: 'badge-pending', hint: '您的证书已提交，协会正在进行初审，请耐心等待' },
  pending_second: { label: '待复审', cls: 'badge-review', hint: '初审已通过，正在进行复审' },
  approved: { label: '审核通过', cls: 'badge-open', hint: '证书已审核通过，等级已生效' },
  rejected: { label: '审核驳回', cls: 'badge-rejected', hint: '审核未通过，请查看原因并修改后重新提交' },
};

export const CERT_LEVELS = {
  weiqi: ['业余1段', '业余2段', '业余3段', '业余4段', '业余5段', '初段', '1段', '2段', '3段'],
  gomoku: ['初级', '中级', '高级', '一级', '二级', '三级'],
  chess: ['一级棋士', '二级棋士', '三级棋士', '棋协大师', '国际大师'],
  xiangqi: ['业余一级', '业余二级', '业余三级', '业余四级', '业余五级', '棋协大师'],
  checkers: ['初级', '中级', '高级', '一级', '二级'],
};

export const GRADES = [
  '幼儿园小班', '幼儿园中班', '幼儿园大班',
  '小学一年级', '小学二年级', '小学三年级', '小学四年级', '小学五年级', '小学六年级',
  '初中一年级', '初中二年级', '初中三年级',
  '高中一年级', '高中二年级', '高中三年级',
  '大学', '其他',
];

export function getChessTypeLabel(value) {
  return CHESS_TYPES.find(t => t.value === value)?.label || value;
}

export function getIdTypeLabel(value) {
  return ID_TYPES.find(t => t.value === value)?.label || value;
}

export function getGenderLabel(value) {
  return GENDERS.find(g => g.value === value)?.label || value;
}

/** 等级认证申请级别字典（rank 越大等级越高） */
export const XQ_CERT_LEVELS = [
  { value: 'level_3', label: '三级棋士', rank: 1 },
  { value: 'level_2', label: '二级棋士', rank: 2 },
  { value: 'level_1', label: '一级棋士', rank: 3 },
  { value: 'master', label: '棋协大师', rank: 4 },
];

export function getApplyLevelLabel(value) {
  return XQ_CERT_LEVELS.find(l => l.value === value)?.label || value;
}

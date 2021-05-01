import request from '@/utils/request'

// 查询论文列表
export function listPaper(query) {
  return request({
    url: '/system/paper/list',
    method: 'get',
    params: query
  })
}

// 查询技术接口
export function listSkill(query) {
  return request({
    url: '/system/skill/list',
    method: 'get',
    params: query
  })
}

// 修改论文信息
export function updatePaper(data) {
  return request({
    url: '/system/paper',
    method: 'put',
    data: data
  })
}

// 通用上传文件接口
export  function uploadFile(data) {
  return request({
    url: '/common/upload',
    method: 'post',
    data: data
  })
}

// 上传论文信息
export function uploadPaper(data) {
  return request({
    url: '/system/paper',
    method: 'post',
    data: data
  })
}


// 下载论文
export function downloadPaper(paperId) {
  return request({
    url: '/common/downloadPaper?fileName=test.txt&delete=false',
    method: 'get'
  })
}

// 查询paper详细
export function getPaper(paperId) {
  return request({
    url: '/system/paper/info/' + paperId,
    method: 'get'
  })
}

// 删除论文
export function delPaper(paperId) {
  return request({
    url: '/system/paper/' + paperId,
    method: 'delete'
  })
}

// 获取课题来源所占比重数
export function getTitleSource() {
  return request({
    url: '/system/chart/titleSource/',
    method: 'get'
  })
}

// 获取指导老师所占比重数
export function getTeacherSource() {
  return request({
    url: '/system/chart/teacherSource/',
    method: 'get'
  })
}

// 获取热门技术
export function getHotTechnology() {
  return request({
    url: '/system/chart/getTopTen/',
    method: 'get'
  })
}

// 获取知识图谱
export function getKnowledgeGraphData() {
  return request({
    url: '/system/chart/tu/',
    method: 'get'
  })
}

// 获取热门技术曲线图数据
export function getTechByYear() {
  return request({
    url: '/system/chart/techByYear',
    method: 'get'
  })
}

// 获取词云图
export function getCloud() {
  return request({
    url: '/system/chart/wordUrl',
    method: 'get'
  })
}

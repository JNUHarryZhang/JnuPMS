import request from '@/utils/request'

// 获取热门技术
export function getHotTechnology() {
  return request({
    url: '/getHotTechnology',
    method: 'get'
  })
}


import request, { noCacheParams } from "@/utils/request";
import * as MCNAPI from "./NCMAPI";

// TODO 删除mv相关功能

/**
 * 获取 mv 数据
 * 说明 : 调用此接口 , 传入 mvid ( 在搜索音乐的时候传 type=1004 获得 ) , 可获取对应 MV 数据 , 数据包含 mv 名字 , 歌手 , 发布时间 , mv 视频地址等数据 ,
 * 其中 mv 视频 网易做了防盗链处理 , 可能不能直接播放 , 需要播放的话需要调用 ' mv 地址' 接口
 * - 调用例子 : /mv/detail?mvid=5436712
 
 */
export function mvDetail(mvid: MCNAPI.mv_detail[0]["mvid"]) {
	return request({
		url: "/mv/detail",
		method: "get",
		params: noCacheParams({ mvid }),
	});
}

/**
 * mv 地址
 * 说明 : 调用此接口 , 传入 mv id,可获取 mv 播放地址
 * - id: mv id
 * - r: 分辨率,默认1080,可从 /mv/detail 接口获取分辨率列表
 * - 调用例子 : /mv/url?id=5436712 /mv/url?id=10896407&r=1080
 */
export function mvUrl(params: MCNAPI.mv_url[0]) {
	return request({
		url: "/mv/url",
		method: "get",
		params,
	});
}

/**
 * 相似 mv
 * 说明 : 调用此接口 , 传入 mvid 可获取相似 mv
 */
export function simiMv(mvid: MCNAPI.simi_mv[0]["mvid"]) {
	return request({
		url: "/simi/mv",
		method: "get",
		params: { mvid },
	});
}

/**
 * 收藏/取消收藏 MV
 * 说明 : 调用此接口,可收藏/取消收藏 MV
 * - mvid: mv id
 * - t: 1 为收藏,其他为取消收藏
 */

export function likeAMV(params: MCNAPI.mv_sub[0]) {
	return request({
		url: "/mv/sub",
		method: "post",
		params: noCacheParams(params),
	});
}

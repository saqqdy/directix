import type { I18nMessages } from '../types'

export const zhCN: I18nMessages = {
	directives: {
		debounce: {
			description: '防抖指令，延迟执行事件处理函数',
			params: {
				wait: '延迟时间（毫秒）',
				leading: '是否在延迟开始前调用',
				trailing: '是否在延迟结束后调用',
			},
			errors: {
				invalid_wait: 'wait 参数无效，必须为正数',
				invalid_handler: 'handler 必须是一个函数',
			},
		},
		throttle: {
			description: '节流指令，限制事件触发频率',
			params: {
				interval: '执行间隔（毫秒）',
				leading: '是否在间隔开始时调用',
				trailing: '是否在间隔结束时调用',
			},
			errors: {
				invalid_interval: 'interval 参数无效，必须为正数',
				invalid_handler: 'handler 必须是一个函数',
			},
		},
		copy: {
			description: '复制指令，点击复制文本到剪贴板',
			params: {
				value: '要复制的文本',
				onSuccess: '复制成功回调',
				onError: '复制失败回调',
			},
			errors: {
				empty_value: '没有要复制的文本',
				clipboard_failed: '剪贴板 API 失败，回退到 execCommand',
			},
		},
		lazy: {
			description: '懒加载指令，延迟加载图片或组件',
			params: {
				src: '图片源地址',
				threshold: '触发阈值',
				rootMargin: '根元素边距',
			},
			errors: {
				invalid_src: 'src 参数无效',
				observer_failed: 'IntersectionObserver 创建失败',
			},
		},
		permission: {
			description: '权限指令，根据权限控制元素显示',
			params: {
				value: '权限值或权限数组',
				mode: '权限模式：any 或 all',
			},
			errors: {
				empty_permission: '权限值不能为空',
				invalid_mode: 'mode 必须是 any 或 all',
			},
		},
		mask: {
			description: '输入掩码指令，格式化输入内容',
			params: {
				pattern: '掩码模式',
				placeholder: '占位符',
				allowIncomplete: '是否允许不完整输入',
			},
			errors: {
				invalid_pattern: 'pattern 参数无效',
			},
		},
		hotkey: {
			description: '热键指令，绑定键盘快捷键',
			params: {
				key: '快捷键组合',
				handler: '处理函数',
				prevent: '是否阻止默认行为',
			},
			errors: {
				invalid_key: '快捷键格式无效',
				conflict: '快捷键冲突：{key}',
			},
		},
		clickoutside: {
			description: '点击外部指令，检测元素外部点击',
			params: {
				handler: '点击外部时的处理函数',
				exclude: '排除的元素列表',
			},
			errors: {
				invalid_handler: 'handler 必须是一个函数',
			},
		},
		longpress: {
			description: '长按指令，检测长按手势',
			params: {
				duration: '长按时长（毫秒）',
				handler: '长按触发函数',
			},
			errors: {
				invalid_duration: 'duration 必须为正数',
			},
		},
		draggable: {
			description: '拖拽指令，使元素可拖拽',
			params: {
				axis: '拖拽轴：x、y 或空',
				bounds: '拖拽边界',
				handle: '拖拽手柄选择器',
			},
			errors: {
				invalid_bounds: 'bounds 参数无效',
			},
		},
		intersect: {
			description: '交叉观察指令，检测元素可见性',
			params: {
				threshold: '可见阈值',
				rootMargin: '根元素边距',
				once: '是否只触发一次',
			},
			errors: {
				observer_failed: 'IntersectionObserver 创建失败',
			},
		},
		loading: {
			description: '加载指令，显示加载状态',
			params: {
				value: '是否加载中',
				text: '加载提示文字',
				spinner: '加载图标',
			},
		},
		skeleton: {
			description: '骨架屏指令，显示内容占位符',
			params: {
				value: '是否显示骨架屏',
				variant: '骨架屏变体',
				animation: '动画类型',
			},
		},
		virtualList: {
			description: '虚拟列表指令，优化大数据渲染',
			params: {
				itemSize: '项目高度',
				buffer: '缓冲区大小',
				estimatedSize: '预估高度',
			},
			errors: {
				invalid_itemSize: 'itemSize 必须为正数',
			},
		},
		infiniteScroll: {
			description: '无限滚动指令，实现滚动加载更多',
			params: {
				handler: '加载更多的处理函数',
				distance: '触发距离',
				disabled: '是否禁用',
			},
			errors: {
				invalid_handler: 'handler 必须是一个函数',
			},
		},
		watermark: {
			description: '水印指令，为元素添加水印',
			params: {
				content: '水印内容',
				fontSize: '字体大小',
				color: '水印颜色',
				opacity: '透明度',
			},
			errors: {
				empty_content: '水印内容不能为空',
			},
		},
		contextmenu: {
			description: '右键菜单指令，自定义右键菜单',
			params: {
				items: '菜单项列表',
				handler: '菜单项点击处理',
			},
			errors: {
				empty_items: '菜单项列表不能为空',
			},
		},
		fullscreen: {
			description: '全屏指令，使元素全屏显示',
			params: {
				value: '是否全屏',
				onEnter: '进入全屏回调',
				onExit: '退出全屏回调',
			},
			errors: {
				not_supported: '当前浏览器不支持全屏 API',
			},
		},
		imagePreview: {
			description: '图片预览指令，点击预览大图',
			params: {
				src: '图片源地址',
				list: '图片列表',
				initialIndex: '初始索引',
			},
			errors: {
				invalid_src: 'src 参数无效',
			},
		},
		tooltip: {
			description: '提示指令，显示悬浮提示',
			params: {
				content: '提示内容',
				placement: '显示位置',
				trigger: '触发方式',
			},
			errors: {
				empty_content: '提示内容不能为空',
			},
		},
		lottie: {
			description: 'Lottie 动画指令，播放 Lottie 动画',
			params: {
				path: '动画文件路径',
				animationData: '动画数据',
				loop: '是否循环',
				autoplay: '是否自动播放',
			},
			errors: {
				invalid_source: '必须提供 path 或 animationData',
				load_failed: 'Lottie 动画加载失败',
			},
		},
		swipe: {
			description: '滑动手势指令，检测滑动方向',
			params: {
				threshold: '滑动阈值',
				velocity: '速度阈值',
				onSwipe: '滑动回调',
			},
			errors: {
				invalid_threshold: 'threshold 必须为正数',
			},
		},
		touch: {
			description: '触摸手势指令，统一处理触摸事件',
			params: {
				onStart: '触摸开始回调',
				onMove: '触摸移动回调',
				onEnd: '触摸结束回调',
			},
		},
		pan: {
			description: '平移手势指令，检测平移操作',
			params: {
				threshold: '触发阈值',
				direction: '平移方向：all、horizontal、vertical',
			},
		},
		pinch: {
			description: '捏合手势指令，检测缩放操作',
			params: {
				threshold: '缩放阈值',
				onPinch: '缩放回调',
			},
		},
		rotateGesture: {
			description: '旋转手势指令，检测旋转操作',
			params: {
				threshold: '旋转角度阈值',
				onRotate: '旋转回调',
			},
		},
		parallax: {
			description: '视差滚动指令，创建视差效果',
			params: {
				speed: '视差速度',
				direction: '视差方向',
			},
		},
		typewriter: {
			description: '打字机指令，实现打字机效果',
			params: {
				text: '要显示的文本',
				speed: '打字速度',
				delay: '延迟开始',
			},
			errors: {
				empty_text: '文本内容不能为空',
			},
		},
		countdown: {
			description: '倒计时指令，显示倒计时',
			params: {
				time: '倒计时时间（毫秒）',
				format: '时间格式',
				onFinish: '完成回调',
			},
			errors: {
				invalid_time: 'time 必须为正数',
			},
		},
		counter: {
			description: '计数器指令，数字动画',
			params: {
				from: '起始值',
				to: '结束值',
				duration: '动画时长',
				decimals: '小数位数',
			},
			errors: {
				invalid_range: 'from 和 to 必须为数字',
			},
		},
		progress: {
			description: '进度条指令，显示进度',
			params: {
				value: '进度值（0-100）',
				showText: '是否显示文字',
				strokeWidth: '线条宽度',
			},
			errors: {
				invalid_value: 'value 必须在 0-100 之间',
			},
		},
		emoji: {
			description: '表情选择指令，表情选择器',
			params: {
				onSelect: '选择回调',
				exclude: '排除的表情类别',
			},
		},
		money: {
			description: '金额输入指令，格式化金额',
			params: {
				currency: '货币符号',
				precision: '小数位数',
				thousands: '千位分隔符',
			},
		},
		number: {
			description: '数字输入指令，限制数字输入',
			params: {
				min: '最小值',
				max: '最大值',
				precision: '小数位数',
			},
			errors: {
				invalid_range: 'min 必须小于 max',
			},
		},
		truncate: {
			description: '截断指令，截断文本',
			params: {
				length: '最大长度',
				omission: '省略符号',
			},
			errors: {
				invalid_length: 'length 必须为正整数',
			},
		},
		ellipsis: {
			description: '省略号指令，CSS 省略显示',
			params: {
				lines: '最大行数',
			},
		},
		highlight: {
			description: '高亮指令，高亮文本内容',
			params: {
				keyword: '高亮关键词',
				color: '高亮颜色',
				className: 'CSS 类名',
			},
			errors: {
				empty_keyword: '关键词不能为空',
			},
		},
		sanitize: {
			description: '净化指令，净化 HTML 内容',
			params: {
				allowedTags: '允许的标签',
				allowedAttrs: '允许的属性',
			},
		},
		focus: {
			description: '聚焦指令，自动聚焦元素',
			params: {
				value: '是否聚焦',
				preventScroll: '是否阻止滚动',
			},
		},
		visible: {
			description: '可见性指令，控制元素显示',
			params: {
				value: '是否可见',
			},
		},
		blur: {
			description: '模糊指令，模糊元素内容',
			params: {
				value: '模糊程度',
				transition: '过渡效果',
			},
		},
		hover: {
			description: '悬停指令，检测鼠标悬停',
			params: {
				onEnter: '进入回调',
				onLeave: '离开回调',
			},
		},
		fade: {
			description: '淡入淡出指令，淡入淡出效果',
			params: {
				duration: '动画时长',
				delay: '延迟时间',
			},
		},
		clickWave: {
			description: '点击波纹指令，点击波纹效果',
			params: {
				color: '波纹颜色',
				duration: '动画时长',
			},
		},
		clickDelay: {
			description: '点击延迟指令，防止快速点击',
			params: {
				delay: '延迟时间',
			},
			errors: {
				invalid_delay: 'delay 必须为正数',
			},
		},
		scroll: {
			description: '滚动指令，滚动行为控制',
			params: {
				behavior: '滚动行为',
				smooth: '是否平滑滚动',
			},
		},
		sticky: {
			description: '粘性定位指令，粘性定位效果',
			params: {
				offsetTop: '顶部偏移',
				offsetBottom: '底部偏移',
			},
		},
		print: {
			description: '打印指令，打印元素内容',
			params: {
				title: '打印标题',
				onBefore: '打印前回调',
				onAfter: '打印后回调',
			},
		},
		export_: {
			description: '导出指令，导出元素内容',
			params: {
				type: '导出类型：image、pdf',
				filename: '文件名',
				quality: '质量',
			},
			errors: {
				unsupported_type: '不支持的导出类型',
			},
		},
		pullRefresh: {
			description: '下拉刷新指令，下拉刷新功能',
			params: {
				onRefresh: '刷新回调',
				distance: '触发距离',
			},
			errors: {
				invalid_handler: 'onRefresh 必须是一个函数',
			},
		},
		resize: {
			description: '调整大小指令，监听元素尺寸变化',
			params: {
				handler: '尺寸变化回调',
				debounce: '防抖时间',
			},
			errors: {
				observer_failed: 'ResizeObserver 创建失败',
			},
		},
		mutation: {
			description: '变化观察指令，监听 DOM 变化',
			params: {
				handler: '变化回调',
				options: '观察选项',
			},
			errors: {
				observer_failed: 'MutationObserver 创建失败',
			},
		},
		ripple: {
			description: '涟漪指令，Material Design 涟漪效果',
			params: {
				color: '涟漪颜色',
				duration: '动画时长',
			},
		},
		uppercase: {
			description: '大写指令，转换为大写',
		},
		lowercase: {
			description: '小写指令，转换为小写',
		},
		capitalcase: {
			description: '首字母大写指令，首字母大写',
		},
		trim: {
			description: '去空格指令，去除首尾空格',
		},
	},
	errors: {
		invalid_param: '参数 {param} 无效',
		missing_required: '缺少必需参数 {param}',
		type_error: '参数 {param} 类型错误，期望 {expected}，实际 {actual}',
		value_out_of_range: '参数 {param} 值超出范围，应在 {min} 到 {max} 之间',
		not_supported: '{feature} 在当前环境不受支持',
		ssr_not_supported: '指令 {directive} 不支持 SSR',
	},
	warnings: {
		deprecated: '{feature} 已弃用，请使用 {alternative}',
		experimental: '{feature} 是实验性功能，可能在未来版本中更改',
		performance: '{feature} 可能影响性能，建议谨慎使用',
		fallback: '{feature} 失败，回退到 {alternative}',
	},
	help: {
		installation: '使用 npm install directix 安装',
		usage: '在 Vue 应用中注册 Directix 插件',
		contribution: '请参阅 CONTRIBUTING.md 了解如何贡献',
	},
}

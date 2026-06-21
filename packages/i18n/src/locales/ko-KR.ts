import type { I18nMessages } from '../types'

export const koKR: I18nMessages = {
	directives: {
		debounce: {
			description: '디바운스 디렉티브, 이벤트 핸들러 실행을 지연합니다',
			params: {
				wait: '지연 시간 (밀리초)',
				leading: '지연 시작 전 호출 여부',
				trailing: '지연 종료 후 호출 여부',
			},
			errors: {
				invalid_wait: 'wait 매개변수가 유효하지 않습니다. 양수여야 합니다',
				invalid_handler: 'handler는 함수여야 합니다',
			},
		},
		throttle: {
			description: '쓰로틀 디렉티브, 이벤트 트리거 빈도를 제한합니다',
			params: {
				interval: '실행 간격 (밀리초)',
				leading: '간격 시작 시 호출 여부',
				trailing: '간격 종료 시 호출 여부',
			},
			errors: {
				invalid_interval: 'interval 매개변수가 유효하지 않습니다. 양수여야 합니다',
				invalid_handler: 'handler는 함수여야 합니다',
			},
		},
		copy: {
			description: '복사 디렉티브, 클릭 시 텍스트를 클립보드에 복사합니다',
			params: {
				value: '복사할 텍스트',
				onSuccess: '복사 성공 콜백',
				onError: '복사 실패 콜백',
			},
			errors: {
				empty_value: '복사할 텍스트가 없습니다',
				clipboard_failed: '클립보드 API 실패, execCommand로 대체합니다',
			},
		},
		lazy: {
			description: '지연 로딩 디렉티브, 이미지 또는 컴포넌트를 지연 로딩합니다',
			params: {
				src: '이미지 소스 주소',
				threshold: '트리거 임계값',
				rootMargin: '루트 요소 여백',
			},
			errors: {
				invalid_src: 'src 매개변수가 유효하지 않습니다',
				observer_failed: 'IntersectionObserver 생성 실패',
			},
		},
		permission: {
			description: '권한 디렉티브, 권한에 따라 요소 표시를 제어합니다',
			params: {
				value: '권한 값 또는 권한 배열',
				mode: '권한 모드: any 또는 all',
			},
			errors: {
				empty_permission: '권한 값은 비어 있을 수 없습니다',
				invalid_mode: 'mode는 any 또는 all이어야 합니다',
			},
		},
		mask: {
			description: '입력 마스크 디렉티브, 입력 내용을 형식화합니다',
			params: {
				pattern: '마스크 패턴',
				placeholder: '플레이스홀더',
				allowIncomplete: '불완전한 입력 허용 여부',
			},
			errors: {
				invalid_pattern: 'pattern 매개변수가 유효하지 않습니다',
			},
		},
		hotkey: {
			description: '단축키 디렉티브, 키보드 단축키를 바인딩합니다',
			params: {
				key: '단축키 조합',
				handler: '처리 함수',
				prevent: '기본 동작 방지 여부',
			},
			errors: {
				invalid_key: '단축키 형식이 유효하지 않습니다',
				conflict: '단축키 충돌: {key}',
			},
		},
		clickoutside: {
			description: '외부 클릭 디렉티브, 요소 외부 클릭을 감지합니다',
			params: {
				handler: '외부 클릭 시 처리 함수',
				exclude: '제외할 요소 목록',
			},
			errors: {
				invalid_handler: 'handler는 함수여야 합니다',
			},
		},
		longpress: {
			description: '롱프레스 디렉티브, 길게 누르기 제스처를 감지합니다',
			params: {
				duration: '길게 누르기 시간 (밀리초)',
				handler: '롱프레스 트리거 함수',
			},
			errors: {
				invalid_duration: 'duration은 양수여야 합니다',
			},
		},
		draggable: {
			description: '드래그 디렉티브, 요소를 드래그 가능하게 합니다',
			params: {
				axis: '드래그 축: x, y 또는 빈 값',
				bounds: '드래그 경계',
				handle: '드래그 핸들 선택자',
			},
			errors: {
				invalid_bounds: 'bounds 매개변수가 유효하지 않습니다',
			},
		},
		intersect: {
			description: '교차 관찰 디렉티브, 요소 가시성을 감지합니다',
			params: {
				threshold: '가시성 임계값',
				rootMargin: '루트 요소 여백',
				once: '한 번만 트리거 여부',
			},
			errors: {
				observer_failed: 'IntersectionObserver 생성 실패',
			},
		},
		loading: {
			description: '로딩 디렉티브, 로딩 상태를 표시합니다',
			params: {
				value: '로딩 중 여부',
				text: '로딩 안내 텍스트',
				spinner: '로딩 아이콘',
			},
		},
		skeleton: {
			description: '스켈레톤 디렉티브, 콘텐츠 플레이스홀더를 표시합니다',
			params: {
				value: '스켈레톤 표시 여부',
				variant: '스켈레톤 변형',
				animation: '애니메이션 유형',
			},
		},
		virtualList: {
			description: '가상 목록 디렉티브, 대용량 데이터 렌더링을 최적화합니다',
			params: {
				itemSize: '항목 높이',
				buffer: '버퍼 크기',
				estimatedSize: '예상 높이',
			},
			errors: {
				invalid_itemSize: 'itemSize는 양수여야 합니다',
			},
		},
		infiniteScroll: {
			description: '무한 스크롤 디렉티브, 스크롤하여 더 불러오기를 구현합니다',
			params: {
				handler: '더 불러오기 처리 함수',
				distance: '트리거 거리',
				disabled: '비활성화 여부',
			},
			errors: {
				invalid_handler: 'handler는 함수여야 합니다',
			},
		},
		watermark: {
			description: '워터마크 디렉티브, 요소에 워터마크를 추가합니다',
			params: {
				content: '워터마크 내용',
				fontSize: '글꼴 크기',
				color: '워터마크 색상',
				opacity: '투명도',
			},
			errors: {
				empty_content: '워터마크 내용은 비어 있을 수 없습니다',
			},
		},
		contextmenu: {
			description: '우클릭 메뉴 디렉티브, 사용자 정의 우클릭 메뉴를 제공합니다',
			params: {
				items: '메뉴 항목 목록',
				handler: '메뉴 항목 클릭 처리',
			},
			errors: {
				empty_items: '메뉴 항목 목록은 비어 있을 수 없습니다',
			},
		},
		fullscreen: {
			description: '전체화면 디렉티브, 요소를 전체화면으로 표시합니다',
			params: {
				value: '전체화면 여부',
				onEnter: '전체화면 진입 콜백',
				onExit: '전체화면 종료 콜백',
			},
			errors: {
				not_supported: '현재 브라우저에서 전체화면 API를 지원하지 않습니다',
			},
		},
		imagePreview: {
			description: '이미지 미리보기 디렉티브, 클릭 시 큰 이미지를 미리봅니다',
			params: {
				src: '이미지 소스 주소',
				list: '이미지 목록',
				initialIndex: '초기 인덱스',
			},
			errors: {
				invalid_src: 'src 매개변수가 유효하지 않습니다',
			},
		},
		tooltip: {
			description: '툴팁 디렉티브, 호버 시 툴팁을 표시합니다',
			params: {
				content: '툴팁 내용',
				placement: '표시 위치',
				trigger: '트리거 방식',
			},
			errors: {
				empty_content: '툴팁 내용은 비어 있을 수 없습니다',
			},
		},
		lottie: {
			description: 'Lottie 애니메이션 디렉티브, Lottie 애니메이션을 재생합니다',
			params: {
				path: '애니메이션 파일 경로',
				animationData: '애니메이션 데이터',
				loop: '루프 여부',
				autoplay: '자동 재생 여부',
			},
			errors: {
				invalid_source: 'path 또는 animationData를 제공해야 합니다',
				load_failed: 'Lottie 애니메이션 로딩 실패',
			},
		},
		swipe: {
			description: '스와이프 제스처 디렉티브, 스와이프 방향을 감지합니다',
			params: {
				threshold: '스와이프 임계값',
				velocity: '속도 임계값',
				onSwipe: '스와이프 콜백',
			},
			errors: {
				invalid_threshold: 'threshold는 양수여야 합니다',
			},
		},
		touch: {
			description: '터치 제스처 디렉티브, 터치 이벤트를 통합 처리합니다',
			params: {
				onStart: '터치 시작 콜백',
				onMove: '터치 이동 콜백',
				onEnd: '터치 종료 콜백',
			},
		},
		pan: {
			description: '팬 제스처 디렉티브, 팬 조작을 감지합니다',
			params: {
				threshold: '트리거 임계값',
				direction: '팬 방향: all, horizontal, vertical',
			},
		},
		pinch: {
			description: '핀치 제스처 디렉티브, 확대/축소 조작을 감지합니다',
			params: {
				threshold: '확대/축소 임계값',
				onPinch: '확대/축소 콜백',
			},
		},
		rotateGesture: {
			description: '회전 제스처 디렉티브, 회전 조작을 감지합니다',
			params: {
				threshold: '회전 각도 임계값',
				onRotate: '회전 콜백',
			},
		},
		parallax: {
			description: '패럴랙스 디렉티브, 패럴랙스 효과를 만듭니다',
			params: {
				speed: '패럴랙스 속도',
				direction: '패럴랙스 방향',
			},
		},
		typewriter: {
			description: '타자기 디렉티브, 타자기 효과를 구현합니다',
			params: {
				text: '표시할 텍스트',
				speed: '타자 속도',
				delay: '시작 지연',
			},
			errors: {
				empty_text: '텍스트 내용은 비어 있을 수 없습니다',
			},
		},
		countdown: {
			description: '카운트다운 디렉티브, 카운트다운을 표시합니다',
			params: {
				time: '카운트다운 시간 (밀리초)',
				format: '시간 형식',
				onFinish: '완료 콜백',
			},
			errors: {
				invalid_time: 'time은 양수여야 합니다',
			},
		},
		counter: {
			description: '카운터 디렉티브, 숫자 애니메이션입니다',
			params: {
				from: '시작 값',
				to: '종료 값',
				duration: '애니메이션 시간',
				decimals: '소수 자릿수',
			},
			errors: {
				invalid_range: 'from과 to는 숫자여야 합니다',
			},
		},
		progress: {
			description: '진행률 디렉티브, 진행률을 표시합니다',
			params: {
				value: '진행률 값 (0-100)',
				showText: '텍스트 표시 여부',
				strokeWidth: '선 너비',
			},
			errors: {
				invalid_value: 'value는 0-100 사이여야 합니다',
			},
		},
		emoji: {
			description: '이모지 선택 디렉티브, 이모지 선택기입니다',
			params: {
				onSelect: '선택 콜백',
				exclude: '제외할 이모지 카테고리',
			},
		},
		money: {
			description: '금액 입력 디렉티브, 금액을 형식화합니다',
			params: {
				currency: '통화 기호',
				precision: '소수 자릿수',
				thousands: '천 단위 구분 기호',
			},
		},
		number: {
			description: '숫자 입력 디렉티브, 숫자 입력을 제한합니다',
			params: {
				min: '최솟값',
				max: '최댓값',
				precision: '소수 자릿수',
			},
			errors: {
				invalid_range: 'min은 max보다 작아야 합니다',
			},
		},
		truncate: {
			description: '잘라내기 디렉티브, 텍스트를 잘라냅니다',
			params: {
				length: '최대 길이',
				omission: '생략 기호',
			},
			errors: {
				invalid_length: 'length는 양의 정수여야 합니다',
			},
		},
		ellipsis: {
			description: '말줄임표 디렉티브, CSS 말줄임 표시',
			params: {
				lines: '최대 줄 수',
			},
		},
		highlight: {
			description: '하이라이트 디렉티브, 텍스트 콘텐츠를 강조합니다',
			params: {
				keyword: '강조 키워드',
				color: '강조 색상',
				className: 'CSS 클래스명',
			},
			errors: {
				empty_keyword: '키워드는 비어 있을 수 없습니다',
			},
		},
		sanitize: {
			description: '정제 디렉티브, HTML 콘텐츠를 정제합니다',
			params: {
				allowedTags: '허용된 태그',
				allowedAttrs: '허용된 속성',
			},
		},
		focus: {
			description: '포커스 디렉티브, 요소를 자동으로 포커스합니다',
			params: {
				value: '포커스 여부',
				preventScroll: '스크롤 방지 여부',
			},
		},
		visible: {
			description: '가시성 디렉티브, 요소 표시를 제어합니다',
			params: {
				value: '표시 여부',
			},
		},
		blur: {
			description: '흐림 디렉티브, 요소 콘텐츠를 흐리게 합니다',
			params: {
				value: '흐림 정도',
				transition: '전환 효과',
			},
		},
		hover: {
			description: '호버 디렉티브, 마우스 호버를 감지합니다',
			params: {
				onEnter: '진입 콜백',
				onLeave: '이탈 콜백',
			},
		},
		fade: {
			description: '페이드 디렉티브, 페이드 인/아웃 효과입니다',
			params: {
				duration: '애니메이션 시간',
				delay: '지연 시간',
			},
		},
		clickWave: {
			description: '클릭 파동 디렉티브, 클릭 파동 효과입니다',
			params: {
				color: '파동 색상',
				duration: '애니메이션 시간',
			},
		},
		clickDelay: {
			description: '클릭 지연 디렉티브, 빠른 클릭을 방지합니다',
			params: {
				delay: '지연 시간',
			},
			errors: {
				invalid_delay: 'delay는 양수여야 합니다',
			},
		},
		scroll: {
			description: '스크롤 디렉티브, 스크롤 동작을 제어합니다',
			params: {
				behavior: '스크롤 동작',
				smooth: '부드러운 스크롤 여부',
			},
		},
		sticky: {
			description: '스티키 디렉티브, 스티키 포지셔닝 효과입니다',
			params: {
				offsetTop: '상단 오프셋',
				offsetBottom: '하단 오프셋',
			},
		},
		print: {
			description: '인쇄 디렉티브, 요소 콘텐츠를 인쇄합니다',
			params: {
				title: '인쇄 제목',
				onBefore: '인쇄 전 콜백',
				onAfter: '인쇄 후 콜백',
			},
		},
		export_: {
			description: '내보내기 디렉티브, 요소 콘텐츠를 내보냅니다',
			params: {
				type: '내보내기 유형: image, pdf',
				filename: '파일명',
				quality: '품질',
			},
			errors: {
				unsupported_type: '지원하지 않는 내보내기 유형입니다',
			},
		},
		pullRefresh: {
			description: '당겨서 새로고침 디렉티브, 당겨서 새로고침 기능입니다',
			params: {
				onRefresh: '새로고침 콜백',
				distance: '트리거 거리',
			},
			errors: {
				invalid_handler: 'onRefresh는 함수여야 합니다',
			},
		},
		resize: {
			description: '크기 조절 디렉티브, 요소 크기 변화를 감시합니다',
			params: {
				handler: '크기 변화 콜백',
				debounce: '디바운스 시간',
			},
			errors: {
				observer_failed: 'ResizeObserver 생성 실패',
			},
		},
		mutation: {
			description: '변화 관찰 디렉티브, DOM 변화를 감시합니다',
			params: {
				handler: '변화 콜백',
				options: '관찰 옵션',
			},
			errors: {
				observer_failed: 'MutationObserver 생성 실패',
			},
		},
		ripple: {
			description: '리플 디렉티브, Material Design 리플 효과입니다',
			params: {
				color: '리플 색상',
				duration: '애니메이션 시간',
			},
		},
		uppercase: {
			description: '대문자 디렉티브, 대문자로 변환합니다',
		},
		lowercase: {
			description: '소문자 디렉티브, 소문자로 변환합니다',
		},
		capitalcase: {
			description: '첫 글자 대문자 디렉티브, 첫 글자를 대문자로 변환합니다',
		},
		trim: {
			description: '공백 제거 디렉티브, 앞뒤 공백을 제거합니다',
		},
	},
	errors: {
		invalid_param: '매개변수 {param}이(가) 유효하지 않습니다',
		missing_required: '필수 매개변수 {param}이(가) 누락되었습니다',
		type_error: '매개변수 {param}의 타입이 잘못되었습니다. 예상: {expected}, 실제: {actual}',
		value_out_of_range: '매개변수 {param}의 값이 범위를 벗어났습니다. {min}에서 {max} 사이여야 합니다',
		not_supported: '{feature}은(는) 현재 환경에서 지원되지 않습니다',
		ssr_not_supported: '디렉티브 {directive}은(는) SSR을 지원하지 않습니다',
	},
	warnings: {
		deprecated: '{feature}은(는) 더 이상 사용되지 않습니다. {alternative}을(를) 사용하세요',
		experimental: '{feature}은(는) 실험적 기능으로, 향후 버전에서 변경될 수 있습니다',
		performance: '{feature}은(는) 성능에 영향을 줄 수 있으니 주의하여 사용하세요',
		fallback: '{feature} 실패, {alternative}(으)로 대체합니다',
	},
	help: {
		installation: 'npm install directix로 설치하세요',
		usage: 'Vue 애플리케이션에 Directix 플러그인을 등록하세요',
		contribution: '기여 방법은 CONTRIBUTING.md를 참조하세요',
	},
}

import type { I18nMessages } from '../types'

export const ruRU: I18nMessages = {
	directives: {
		debounce: {
			description: 'Директива debounce, откладывает выполнение обработчика события',
			params: {
				wait: 'Время задержки (миллисекунды)',
				leading: 'Вызывать ли в начале задержки',
				trailing: 'Вызывать ли в конце задержки',
			},
			errors: {
				invalid_wait: 'Параметр wait недействителен, должен быть положительным числом',
				invalid_handler: 'handler должен быть функцией',
			},
		},
		throttle: {
			description: 'Директива throttle, ограничивает частоту срабатывания событий',
			params: {
				interval: 'Интервал выполнения (миллисекунды)',
				leading: 'Вызывать ли в начале интервала',
				trailing: 'Вызывать ли в конце интервала',
			},
			errors: {
				invalid_interval: 'Параметр interval недействителен, должен быть положительным числом',
				invalid_handler: 'handler должен быть функцией',
			},
		},
		copy: {
			description: 'Директива copy, копирует текст в буфер обмена по клику',
			params: {
				value: 'Текст для копирования',
				onSuccess: 'Callback при успешном копировании',
				onError: 'Callback при ошибке копирования',
			},
			errors: {
				empty_value: 'Нет текста для копирования',
				clipboard_failed: 'Ошибка Clipboard API, откат к execCommand',
			},
		},
		lazy: {
			description: 'Директива lazy, отложенная загрузка изображений или компонентов',
			params: {
				src: 'URL источника изображения',
				threshold: 'Порог срабатывания',
				rootMargin: 'Отступ корневого элемента',
			},
			errors: {
				invalid_src: 'Параметр src недействителен',
				observer_failed: 'Не удалось создать IntersectionObserver',
			},
		},
		permission: {
			description: 'Директива permission, управляет отображением элементов на основе разрешений',
			params: {
				value: 'Значение разрешения или массив разрешений',
				mode: 'Режим разрешений: any или all',
			},
			errors: {
				empty_permission: 'Значение разрешения не может быть пустым',
				invalid_mode: 'mode должен быть any или all',
			},
		},
		mask: {
			description: 'Директива маски ввода, форматирует содержимое ввода',
			params: {
				pattern: 'Шаблон маски',
				placeholder: 'Заполнитель',
				allowIncomplete: 'Разрешить ли неполный ввод',
			},
			errors: {
				invalid_pattern: 'Параметр pattern недействителен',
			},
		},
		hotkey: {
			description: 'Директива hotkey, привязывает сочетания клавиш',
			params: {
				key: 'Комбинация клавиш',
				handler: 'Обработчик',
				prevent: 'Предотвращать ли поведение по умолчанию',
			},
			errors: {
				invalid_key: 'Недопустимый формат сочетания клавиш',
				conflict: 'Конфликт сочетаний клавиш: {key}',
			},
		},
		clickoutside: {
			description: 'Директива clickoutside, отслеживает клики вне элемента',
			params: {
				handler: 'Обработчик клика вне элемента',
				exclude: 'Список исключённых элементов',
			},
			errors: {
				invalid_handler: 'handler должен быть функцией',
			},
		},
		longpress: {
			description: 'Директива longpress, отслеживает жест длительного нажатия',
			params: {
				duration: 'Длительность нажатия (миллисекунды)',
				handler: 'Функция, вызываемая при длительном нажатии',
			},
			errors: {
				invalid_duration: 'duration должен быть положительным числом',
			},
		},
		draggable: {
			description: 'Директива draggable, делает элемент перетаскиваемым',
			params: {
				axis: 'Ось перетаскивания: x, y или пусто',
				bounds: 'Границы перетаскивания',
				handle: 'Селектор ручки перетаскивания',
			},
			errors: {
				invalid_bounds: 'Параметр bounds недействителен',
			},
		},
		intersect: {
			description: 'Директива intersect, отслеживает видимость элемента',
			params: {
				threshold: 'Порог видимости',
				rootMargin: 'Отступ корневого элемента',
				once: 'Срабатывать ли только один раз',
			},
			errors: {
				observer_failed: 'Не удалось создать IntersectionObserver',
			},
		},
		loading: {
			description: 'Директива loading, отображает состояние загрузки',
			params: {
				value: 'Загружается ли',
				text: 'Текст состояния загрузки',
				spinner: 'Иконка загрузки',
			},
		},
		skeleton: {
			description: 'Директива skeleton, отображает плейсхолдер контента',
			params: {
				value: 'Отображать ли скелетон',
				variant: 'Вариант скелетона',
				animation: 'Тип анимации',
			},
		},
		virtualList: {
			description: 'Директива virtualList, оптимизирует рендеринг больших данных',
			params: {
				itemSize: 'Высота элемента',
				buffer: 'Размер буфера',
				estimatedSize: 'Ориентировочная высота',
			},
			errors: {
				invalid_itemSize: 'itemSize должен быть положительным числом',
			},
		},
		infiniteScroll: {
			description: 'Директива infiniteScroll, реализует подгрузку при прокрутке',
			params: {
				handler: 'Обработчик подгрузки данных',
				distance: 'Расстояние срабатывания',
				disabled: 'Отключена ли',
			},
			errors: {
				invalid_handler: 'handler должен быть функцией',
			},
		},
		watermark: {
			description: 'Директива watermark, добавляет водяной знак на элемент',
			params: {
				content: 'Содержимое водяного знака',
				fontSize: 'Размер шрифта',
				color: 'Цвет водяного знака',
				opacity: 'Прозрачность',
			},
			errors: {
				empty_content: 'Содержимое водяного знака не может быть пустым',
			},
		},
		contextmenu: {
			description: 'Директива contextmenu, настраивает контекстное меню',
			params: {
				items: 'Список пунктов меню',
				handler: 'Обработчик клика по пункту меню',
			},
			errors: {
				empty_items: 'Список пунктов меню не может быть пустым',
			},
		},
		fullscreen: {
			description: 'Директива fullscreen, отображает элемент в полноэкранном режиме',
			params: {
				value: 'Полноэкранный режим',
				onEnter: 'Callback при входе в полноэкранный режим',
				onExit: 'Callback при выходе из полноэкранного режима',
			},
			errors: {
				not_supported: 'Текущий браузер не поддерживает Fullscreen API',
			},
		},
		imagePreview: {
			description: 'Директива imagePreview, предварительный просмотр изображения по клику',
			params: {
				src: 'URL источника изображения',
				list: 'Список изображений',
				initialIndex: 'Начальный индекс',
			},
			errors: {
				invalid_src: 'Параметр src недействителен',
			},
		},
		tooltip: {
			description: 'Директива tooltip, отображает всплывающую подсказку',
			params: {
				content: 'Содержимое подсказки',
				placement: 'Позиция отображения',
				trigger: 'Способ срабатывания',
			},
			errors: {
				empty_content: 'Содержимое подсказки не может быть пустым',
			},
		},
		lottie: {
			description: 'Директива Lottie, воспроизводит анимации Lottie',
			params: {
				path: 'Путь к файлу анимации',
				animationData: 'Данные анимации',
				loop: 'Зациклить ли',
				autoplay: 'Автовоспроизведение',
			},
			errors: {
				invalid_source: 'Необходимо указать path или animationData',
				load_failed: 'Не удалось загрузить анимацию Lottie',
			},
		},
		swipe: {
			description: 'Директива swipe, отслеживает направление свайпа',
			params: {
				threshold: 'Порог свайпа',
				velocity: 'Порог скорости',
				onSwipe: 'Callback свайпа',
			},
			errors: {
				invalid_threshold: 'threshold должен быть положительным числом',
			},
		},
		touch: {
			description: 'Директива touch, унифицированная обработка сенсорных событий',
			params: {
				onStart: 'Callback начала касания',
				onMove: 'Callback перемещения касания',
				onEnd: 'Callback окончания касания',
			},
		},
		pan: {
			description: 'Директива pan, отслеживает жест панорамирования',
			params: {
				threshold: 'Порог срабатывания',
				direction: 'Направление панорамирования: all, horizontal, vertical',
			},
		},
		pinch: {
			description: 'Директива pinch, отслеживает жест масштабирования',
			params: {
				threshold: 'Порог масштабирования',
				onPinch: 'Callback масштабирования',
			},
		},
		rotateGesture: {
			description: 'Директива rotateGesture, отслеживает жест вращения',
			params: {
				threshold: 'Порог угла вращения',
				onRotate: 'Callback вращения',
			},
		},
		parallax: {
			description: 'Директива parallax, создаёт эффект параллакса',
			params: {
				speed: 'Скорость параллакса',
				direction: 'Направление параллакса',
			},
		},
		typewriter: {
			description: 'Директива typewriter, создаёт эффект печатной машинки',
			params: {
				text: 'Текст для отображения',
				speed: 'Скорость печати',
				delay: 'Задержка перед началом',
			},
			errors: {
				empty_text: 'Текст не может быть пустым',
			},
		},
		countdown: {
			description: 'Директива countdown, отображает обратный отсчёт',
			params: {
				time: 'Время обратного отсчёта (миллисекунды)',
				format: 'Формат времени',
				onFinish: 'Callback завершения',
			},
			errors: {
				invalid_time: 'time должен быть положительным числом',
			},
		},
		counter: {
			description: 'Директива counter, анимация чисел',
			params: {
				from: 'Начальное значение',
				to: 'Конечное значение',
				duration: 'Длительность анимации',
				decimals: 'Количество десятичных знаков',
			},
			errors: {
				invalid_range: 'from и to должны быть числами',
			},
		},
		progress: {
			description: 'Директива progress, отображает прогресс',
			params: {
				value: 'Значение прогресса (0-100)',
				showText: 'Отображать ли текст',
				strokeWidth: 'Толщина линии',
			},
			errors: {
				invalid_value: 'value должен быть в диапазоне 0-100',
			},
		},
		emoji: {
			description: 'Директива emoji, выбор эмодзи',
			params: {
				onSelect: 'Callback выбора',
				exclude: 'Исключённые категории эмодзи',
			},
		},
		money: {
			description: 'Директива money, форматирование суммы',
			params: {
				currency: 'Символ валюты',
				precision: 'Количество десятичных знаков',
				thousands: 'Разделитель тысяч',
			},
		},
		number: {
			description: 'Директива number, ограничивает числовой ввод',
			params: {
				min: 'Минимальное значение',
				max: 'Максимальное значение',
				precision: 'Количество десятичных знаков',
			},
			errors: {
				invalid_range: 'min должен быть меньше max',
			},
		},
		truncate: {
			description: 'Директива truncate, обрезает текст',
			params: {
				length: 'Максимальная длина',
				omission: 'Символ сокращения',
			},
			errors: {
				invalid_length: 'length должен быть положительным целым числом',
			},
		},
		ellipsis: {
			description: 'Директива ellipsis, CSS-многоточие',
			params: {
				lines: 'Максимальное количество строк',
			},
		},
		highlight: {
			description: 'Директива highlight, подсвечивает текст',
			params: {
				keyword: 'Ключевое слово подсветки',
				color: 'Цвет подсветки',
				className: 'Имя CSS-класса',
			},
			errors: {
				empty_keyword: 'Ключевое слово не может быть пустым',
			},
		},
		sanitize: {
			description: 'Директива sanitize, очищает HTML-содержимое',
			params: {
				allowedTags: 'Разрешённые теги',
				allowedAttrs: 'Разрешённые атрибуты',
			},
		},
		focus: {
			description: 'Директива focus, автоматически фокусирует элемент',
			params: {
				value: 'Устанавливать ли фокус',
				preventScroll: 'Предотвращать ли прокрутку',
			},
		},
		visible: {
			description: 'Директива visible, управляет отображением элемента',
			params: {
				value: 'Видимость элемента',
			},
		},
		blur: {
			description: 'Директива blur, размывает содержимое элемента',
			params: {
				value: 'Степень размытия',
				transition: 'Эффект перехода',
			},
		},
		hover: {
			description: 'Директива hover, отслеживает наведение мыши',
			params: {
				onEnter: 'Callback при наведении',
				onLeave: 'Callback при уходе',
			},
		},
		fade: {
			description: 'Директива fade, эффект появления и исчезания',
			params: {
				duration: 'Длительность анимации',
				delay: 'Время задержки',
			},
		},
		clickWave: {
			description: 'Директива clickWave, эффект волны при клике',
			params: {
				color: 'Цвет волны',
				duration: 'Длительность анимации',
			},
		},
		clickDelay: {
			description: 'Директива clickDelay, предотвращает быстрые клики',
			params: {
				delay: 'Время задержки',
			},
			errors: {
				invalid_delay: 'delay должен быть положительным числом',
			},
		},
		scroll: {
			description: 'Директива scroll, управляет поведением прокрутки',
			params: {
				behavior: 'Поведение прокрутки',
				smooth: 'Плавная прокрутка',
			},
		},
		sticky: {
			description: 'Директива sticky, эффект липкого позиционирования',
			params: {
				offsetTop: 'Отступ сверху',
				offsetBottom: 'Отступ снизу',
			},
		},
		print: {
			description: 'Директива print, печатает содержимое элемента',
			params: {
				title: 'Заголовок печати',
				onBefore: 'Callback перед печатью',
				onAfter: 'Callback после печати',
			},
		},
		export_: {
			description: 'Директива export, экспортирует содержимое элемента',
			params: {
				type: 'Тип экспорта: image, pdf',
				filename: 'Имя файла',
				quality: 'Качество',
			},
			errors: {
				unsupported_type: 'Неподдерживаемый тип экспорта',
			},
		},
		pullRefresh: {
			description: 'Директива pullRefresh, функция pull-to-refresh',
			params: {
				onRefresh: 'Callback обновления',
				distance: 'Расстояние срабатывания',
			},
			errors: {
				invalid_handler: 'onRefresh должен быть функцией',
			},
		},
		resize: {
			description: 'Директива resize, отслеживает изменение размера элемента',
			params: {
				handler: 'Callback изменения размера',
				debounce: 'Время debounce',
			},
			errors: {
				observer_failed: 'Не удалось создать ResizeObserver',
			},
		},
		mutation: {
			description: 'Директива mutation, отслеживает изменения DOM',
			params: {
				handler: 'Callback изменений',
				options: 'Параметры наблюдения',
			},
			errors: {
				observer_failed: 'Не удалось создать MutationObserver',
			},
		},
		ripple: {
			description: 'Директива ripple, эффект рячи Material Design',
			params: {
				color: 'Цвет рячи',
				duration: 'Длительность анимации',
			},
		},
		uppercase: {
			description: 'Директива uppercase, преобразует в верхний регистр',
		},
		lowercase: {
			description: 'Директива lowercase, преобразует в нижний регистр',
		},
		capitalcase: {
			description: 'Директива capitalcase, делает первую букву заглавной',
		},
		trim: {
			description: 'Директива trim, удаляет начальные и конечные пробелы',
		},
	},
	errors: {
		invalid_param: 'Параметр {param} недействителен',
		missing_required: 'Отсутствует обязательный параметр {param}',
		type_error: 'Неверный тип параметра {param}, ожидается {expected}, получено {actual}',
		value_out_of_range: 'Значение параметра {param} вне диапазона, должно быть от {min} до {max}',
		not_supported: '{feature} не поддерживается в текущей среде',
		ssr_not_supported: 'Директива {directive} не поддерживает SSR',
	},
	warnings: {
		deprecated: '{feature} устарело, используйте {alternative}',
		experimental: '{feature} — экспериментальная функция, может измениться в будущих версиях',
		performance: '{feature} может повлиять на производительность, используйте с осторожностью',
		fallback: '{feature} не удалось, откат к {alternative}',
	},
	help: {
		installation: 'Установите с помощью npm install directix',
		usage: 'Зарегистрируйте плагин Directix в приложении Vue',
		contribution: 'См. CONTRIBUTING.md для информации о том, как внести вклад',
	},
}

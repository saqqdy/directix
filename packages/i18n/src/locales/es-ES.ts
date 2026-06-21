import type { I18nMessages } from '../types'

export const esES: I18nMessages = {
	directives: {
		debounce: {
			description: 'Directiva de antirrebote, retrasa la ejecución de la función controladora de eventos',
			params: {
				wait: 'Tiempo de espera (milisegundos)',
				leading: 'Si se invoca al inicio del retraso',
				trailing: 'Si se invoca al final del retraso',
			},
			errors: {
				invalid_wait: 'El parámetro wait es inválido, debe ser un número positivo',
				invalid_handler: 'handler debe ser una función',
			},
		},
		throttle: {
			description: 'Directiva de limitación, restringe la frecuencia de activación de eventos',
			params: {
				interval: 'Intervalo de ejecución (milisegundos)',
				leading: 'Si se invoca al inicio del intervalo',
				trailing: 'Si se invoca al final del intervalo',
			},
			errors: {
				invalid_interval: 'El parámetro interval es inválido, debe ser un número positivo',
				invalid_handler: 'handler debe ser una función',
			},
		},
		copy: {
			description: 'Directiva de copia, copia texto al portapapeles al hacer clic',
			params: {
				value: 'Texto a copiar',
				onSuccess: 'Callback de copia exitosa',
				onError: 'Callback de error al copiar',
			},
			errors: {
				empty_value: 'No hay texto para copiar',
				clipboard_failed: 'API del portapapeles fallida, retrocediendo a execCommand',
			},
		},
		lazy: {
			description: 'Directiva de carga diferida, retrasa la carga de imágenes o componentes',
			params: {
				src: 'URL de origen de la imagen',
				threshold: 'Umbral de activación',
				rootMargin: 'Margen del elemento raíz',
			},
			errors: {
				invalid_src: 'El parámetro src es inválido',
				observer_failed: 'Error al crear IntersectionObserver',
			},
		},
		permission: {
			description: 'Directiva de permisos, controla la visibilidad del elemento según los permisos',
			params: {
				value: 'Valor de permiso o arreglo de permisos',
				mode: 'Modo de permiso: any o all',
			},
			errors: {
				empty_permission: 'El valor de permiso no puede estar vacío',
				invalid_mode: 'mode debe ser any o all',
			},
		},
		mask: {
			description: 'Directiva de máscara de entrada, formatea el contenido de entrada',
			params: {
				pattern: 'Patrón de máscara',
				placeholder: 'Marcador de posición',
				allowIncomplete: 'Si se permite entrada incompleta',
			},
			errors: {
				invalid_pattern: 'El parámetro pattern es inválido',
			},
		},
		hotkey: {
			description: 'Directiva de atajo de teclado, vincula combinaciones de teclas',
			params: {
				key: 'Combinación de atajo de teclado',
				handler: 'Función controladora',
				prevent: 'Si se previene el comportamiento por defecto',
			},
			errors: {
				invalid_key: 'Formato de atajo de teclado inválido',
				conflict: 'Conflicto de atajo de teclado: {key}',
			},
		},
		clickoutside: {
			description: 'Directiva de clic externo, detecta clics fuera del elemento',
			params: {
				handler: 'Función controladora al hacer clic fuera',
				exclude: 'Lista de elementos excluidos',
			},
			errors: {
				invalid_handler: 'handler debe ser una función',
			},
		},
		longpress: {
			description: 'Directiva de pulsación larga, detecta gesto de pulsación larga',
			params: {
				duration: 'Duración de pulsación larga (milisegundos)',
				handler: 'Función activada al mantener pulsado',
			},
			errors: {
				invalid_duration: 'duration debe ser un número positivo',
			},
		},
		draggable: {
			description: 'Directiva de arrastre, hace que un elemento sea arrastrable',
			params: {
				axis: 'Eje de arrastre: x, y o vacío',
				bounds: 'Límites de arrastre',
				handle: 'Selector del controlador de arrastre',
			},
			errors: {
				invalid_bounds: 'El parámetro bounds es inválido',
			},
		},
		intersect: {
			description: 'Directiva de observación de intersección, detecta la visibilidad del elemento',
			params: {
				threshold: 'Umbral de visibilidad',
				rootMargin: 'Margen del elemento raíz',
				once: 'Si se activa solo una vez',
			},
			errors: {
				observer_failed: 'Error al crear IntersectionObserver',
			},
		},
		loading: {
			description: 'Directiva de carga, muestra el estado de carga',
			params: {
				value: 'Si está cargando',
				text: 'Texto de indicación de carga',
				spinner: 'Icono de carga',
			},
		},
		skeleton: {
			description: 'Directiva de esqueleto, muestra marcadores de posición de contenido',
			params: {
				value: 'Si se muestra el esqueleto',
				variant: 'Variante del esqueleto',
				animation: 'Tipo de animación',
			},
		},
		virtualList: {
			description: 'Directiva de lista virtual, optimiza el renderizado de grandes volúmenes de datos',
			params: {
				itemSize: 'Altura del elemento',
				buffer: 'Tamaño del búfer',
				estimatedSize: 'Altura estimada',
			},
			errors: {
				invalid_itemSize: 'itemSize debe ser un número positivo',
			},
		},
		infiniteScroll: {
			description: 'Directiva de desplazamiento infinito, implementa carga al desplazar',
			params: {
				handler: 'Función controladora para cargar más',
				distance: 'Distancia de activación',
				disabled: 'Si está deshabilitado',
			},
			errors: {
				invalid_handler: 'handler debe ser una función',
			},
		},
		watermark: {
			description: 'Directiva de marca de agua, añade marca de agua al elemento',
			params: {
				content: 'Contenido de la marca de agua',
				fontSize: 'Tamaño de fuente',
				color: 'Color de la marca de agua',
				opacity: 'Opacidad',
			},
			errors: {
				empty_content: 'El contenido de la marca de agua no puede estar vacío',
			},
		},
		contextmenu: {
			description: 'Directiva de menú contextual, personaliza el menú del botón derecho',
			params: {
				items: 'Lista de elementos del menú',
				handler: 'Controlador de clic en elemento del menú',
			},
			errors: {
				empty_items: 'La lista de elementos del menú no puede estar vacía',
			},
		},
		fullscreen: {
			description: 'Directiva de pantalla completa, muestra el elemento en pantalla completa',
			params: {
				value: 'Si se muestra en pantalla completa',
				onEnter: 'Callback al entrar en pantalla completa',
				onExit: 'Callback al salir de pantalla completa',
			},
			errors: {
				not_supported: 'El navegador actual no soporta la API de pantalla completa',
			},
		},
		imagePreview: {
			description: 'Directiva de vista previa de imagen, previsualiza imagen al hacer clic',
			params: {
				src: 'URL de origen de la imagen',
				list: 'Lista de imágenes',
				initialIndex: 'Índice inicial',
			},
			errors: {
				invalid_src: 'El parámetro src es inválido',
			},
		},
		tooltip: {
			description: 'Directiva de sugerencia, muestra sugerencia al pasar el cursor',
			params: {
				content: 'Contenido de la sugerencia',
				placement: 'Posición de muestra',
				trigger: 'Modo de activación',
			},
			errors: {
				empty_content: 'El contenido de la sugerencia no puede estar vacío',
			},
		},
		lottie: {
			description: 'Directiva de animación Lottie, reproduce animaciones Lottie',
			params: {
				path: 'Ruta del archivo de animación',
				animationData: 'Datos de animación',
				loop: 'Si se repite en bucle',
				autoplay: 'Si se reproduce automáticamente',
			},
			errors: {
				invalid_source: 'Debe proporcionar path o animationData',
				load_failed: 'Error al cargar la animación Lottie',
			},
		},
		swipe: {
			description: 'Directiva de gesto de deslizamiento, detecta la dirección del deslizamiento',
			params: {
				threshold: 'Umbral de deslizamiento',
				velocity: 'Umbral de velocidad',
				onSwipe: 'Callback de deslizamiento',
			},
			errors: {
				invalid_threshold: 'threshold debe ser un número positivo',
			},
		},
		touch: {
			description: 'Directiva de gesto táctil, maneja eventos táctiles de forma unificada',
			params: {
				onStart: 'Callback de inicio táctil',
				onMove: 'Callback de movimiento táctil',
				onEnd: 'Callback de fin táctil',
			},
		},
		pan: {
			description: 'Directiva de gesto de desplazamiento, detecta operaciones de desplazamiento',
			params: {
				threshold: 'Umbral de activación',
				direction: 'Dirección de desplazamiento: all, horizontal, vertical',
			},
		},
		pinch: {
			description: 'Directiva de gesto de pinza, detecta operaciones de zoom',
			params: {
				threshold: 'Umbral de zoom',
				onPinch: 'Callback de zoom',
			},
		},
		rotateGesture: {
			description: 'Directiva de gesto de rotación, detecta operaciones de rotación',
			params: {
				threshold: 'Umbral de ángulo de rotación',
				onRotate: 'Callback de rotación',
			},
		},
		parallax: {
			description: 'Directiva de desplazamiento parallax, crea efecto parallax',
			params: {
				speed: 'Velocidad parallax',
				direction: 'Dirección parallax',
			},
		},
		typewriter: {
			description: 'Directiva de máquina de escribir, implementa efecto de máquina de escribir',
			params: {
				text: 'Texto a mostrar',
				speed: 'Velocidad de escritura',
				delay: 'Retraso de inicio',
			},
			errors: {
				empty_text: 'El contenido de texto no puede estar vacío',
			},
		},
		countdown: {
			description: 'Directiva de cuenta regresiva, muestra cuenta regresiva',
			params: {
				time: 'Tiempo de cuenta regresiva (milisegundos)',
				format: 'Formato de tiempo',
				onFinish: 'Callback de finalización',
			},
			errors: {
				invalid_time: 'time debe ser un número positivo',
			},
		},
		counter: {
			description: 'Directiva de contador, animación numérica',
			params: {
				from: 'Valor inicial',
				to: 'Valor final',
				duration: 'Duración de la animación',
				decimals: 'Decimales',
			},
			errors: {
				invalid_range: 'from y to deben ser números',
			},
		},
		progress: {
			description: 'Directiva de barra de progreso, muestra el progreso',
			params: {
				value: 'Valor de progreso (0-100)',
				showText: 'Si se muestra texto',
				strokeWidth: 'Ancho de línea',
			},
			errors: {
				invalid_value: 'value debe estar entre 0 y 100',
			},
		},
		emoji: {
			description: 'Directiva de selección de emoji, selector de emojis',
			params: {
				onSelect: 'Callback de selección',
				exclude: 'Categorías de emojis excluidas',
			},
		},
		money: {
			description: 'Directiva de entrada monetaria, formatea montos',
			params: {
				currency: 'Símbolo de moneda',
				precision: 'Decimales',
				thousands: 'Separador de miles',
			},
		},
		number: {
			description: 'Directiva de entrada numérica, restringe la entrada de números',
			params: {
				min: 'Valor mínimo',
				max: 'Valor máximo',
				precision: 'Decimales',
			},
			errors: {
				invalid_range: 'min debe ser menor que max',
			},
		},
		truncate: {
			description: 'Directiva de truncamiento, trunca texto',
			params: {
				length: 'Longitud máxima',
				omission: 'Símbolo de omisión',
			},
			errors: {
				invalid_length: 'length debe ser un entero positivo',
			},
		},
		ellipsis: {
			description: 'Directiva de elipsis, muestra elipsis con CSS',
			params: {
				lines: 'Número máximo de líneas',
			},
		},
		highlight: {
			description: 'Directiva de resaltado, resalta el contenido del texto',
			params: {
				keyword: 'Palabra clave a resaltar',
				color: 'Color de resaltado',
				className: 'Nombre de clase CSS',
			},
			errors: {
				empty_keyword: 'La palabra clave no puede estar vacía',
			},
		},
		sanitize: {
			description: 'Directiva de saneamiento, sanea contenido HTML',
			params: {
				allowedTags: 'Etiquetas permitidas',
				allowedAttrs: 'Atributos permitidos',
			},
		},
		focus: {
			description: 'Directiva de enfoque, enfoca automáticamente el elemento',
			params: {
				value: 'Si se enfoca',
				preventScroll: 'Si se previene el desplazamiento',
			},
		},
		visible: {
			description: 'Directiva de visibilidad, controla la visualización del elemento',
			params: {
				value: 'Si es visible',
			},
		},
		blur: {
			description: 'Directiva de desenfoque, desenfoca el contenido del elemento',
			params: {
				value: 'Nivel de desenfoque',
				transition: 'Efecto de transición',
			},
		},
		hover: {
			description: 'Directiva de flotación, detecta el cursor sobre el elemento',
			params: {
				onEnter: 'Callback de entrada',
				onLeave: 'Callback de salida',
			},
		},
		fade: {
			description: 'Directiva de fundido, efecto de fundido de entrada y salida',
			params: {
				duration: 'Duración de la animación',
				delay: 'Tiempo de retraso',
			},
		},
		clickWave: {
			description: 'Directiva de onda de clic, efecto de onda al hacer clic',
			params: {
				color: 'Color de la onda',
				duration: 'Duración de la animación',
			},
		},
		clickDelay: {
			description: 'Directiva de retraso de clic, previene clics rápidos',
			params: {
				delay: 'Tiempo de retraso',
			},
			errors: {
				invalid_delay: 'delay debe ser un número positivo',
			},
		},
		scroll: {
			description: 'Directiva de desplazamiento, control del comportamiento de desplazamiento',
			params: {
				behavior: 'Comportamiento de desplazamiento',
				smooth: 'Si se usa desplazamiento suave',
			},
		},
		sticky: {
			description: 'Directiva de posicionamiento pegajoso, efecto de posicionamiento pegajoso',
			params: {
				offsetTop: 'Desplazamiento superior',
				offsetBottom: 'Desplazamiento inferior',
			},
		},
		print: {
			description: 'Directiva de impresión, imprime el contenido del elemento',
			params: {
				title: 'Título de impresión',
				onBefore: 'Callback antes de imprimir',
				onAfter: 'Callback después de imprimir',
			},
		},
		export_: {
			description: 'Directiva de exportación, exporta el contenido del elemento',
			params: {
				type: 'Tipo de exportación: image, pdf',
				filename: 'Nombre del archivo',
				quality: 'Calidad',
			},
			errors: {
				unsupported_type: 'Tipo de exportación no soportado',
			},
		},
		pullRefresh: {
			description: 'Directiva de actualización al tirar, funcionalidad de deslizar para actualizar',
			params: {
				onRefresh: 'Callback de actualización',
				distance: 'Distancia de activación',
			},
			errors: {
				invalid_handler: 'onRefresh debe ser una función',
			},
		},
		resize: {
			description: 'Directiva de redimensionamiento, escucha cambios de tamaño del elemento',
			params: {
				handler: 'Callback de cambio de tamaño',
				debounce: 'Tiempo de antirrebote',
			},
			errors: {
				observer_failed: 'Error al crear ResizeObserver',
			},
		},
		mutation: {
			description: 'Directiva de observación de mutaciones, escucha cambios en el DOM',
			params: {
				handler: 'Callback de mutación',
				options: 'Opciones de observación',
			},
			errors: {
				observer_failed: 'Error al crear MutationObserver',
			},
		},
		ripple: {
			description: 'Directiva de onda, efecto de onda estilo Material Design',
			params: {
				color: 'Color de la onda',
				duration: 'Duración de la animación',
			},
		},
		uppercase: {
			description: 'Directiva de mayúsculas, convierte a mayúsculas',
		},
		lowercase: {
			description: 'Directiva de minúsculas, convierte a minúsculas',
		},
		capitalcase: {
			description: 'Directiva de capitalización, primera letra en mayúscula',
		},
		trim: {
			description: 'Directiva de recorte, elimina espacios al inicio y al final',
		},
	},
	errors: {
		invalid_param: 'El parámetro {param} es inválido',
		missing_required: 'Falta el parámetro obligatorio {param}',
		type_error: 'Tipo de parámetro {param} incorrecto, se esperaba {expected}, se obtuvo {actual}',
		value_out_of_range: 'El valor del parámetro {param} está fuera de rango, debe estar entre {min} y {max}',
		not_supported: '{feature} no es compatible con el entorno actual',
		ssr_not_supported: 'La directiva {directive} no es compatible con SSR',
	},
	warnings: {
		deprecated: '{feature} está obsoleto, use {alternative}',
		experimental: '{feature} es una característica experimental, puede cambiar en futuras versiones',
		performance: '{feature} puede afectar el rendimiento, se recomienda usar con precaución',
		fallback: '{feature} falló, retrocediendo a {alternative}',
	},
	help: {
		installation: 'Instale con npm install directix',
		usage: 'Registre el plugin Directix en su aplicación Vue',
		contribution: 'Consulte CONTRIBUTING.md para saber cómo contribuir',
	},
}

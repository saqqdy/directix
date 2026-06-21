import type { I18nMessages } from '../types'

export const deDE: I18nMessages = {
	directives: {
		debounce: {
			description: 'Debounce-Direktive, verzögert die Ausführung der Event-Handler-Funktion',
			params: {
				wait: 'Verzögerungszeit (Millisekunden)',
				leading: 'Ob vor Beginn der Verzögerung aufgerufen wird',
				trailing: 'Ob nach Ende der Verzögerung aufgerufen wird',
			},
			errors: {
				invalid_wait: 'Der Parameter wait ist ungültig, muss eine positive Zahl sein',
				invalid_handler: 'handler muss eine Funktion sein',
			},
		},
		throttle: {
			description: 'Throttle-Direktive, begrenzt die Auslösefrequenz von Ereignissen',
			params: {
				interval: 'Ausführungsintervall (Millisekunden)',
				leading: 'Ob zu Beginn des Intervalls aufgerufen wird',
				trailing: 'Ob am Ende des Intervalls aufgerufen wird',
			},
			errors: {
				invalid_interval: 'Der Parameter interval ist ungültig, muss eine positive Zahl sein',
				invalid_handler: 'handler muss eine Funktion sein',
			},
		},
		copy: {
			description: 'Kopier-Direktive, kopiert Text bei Klick in die Zwischenablage',
			params: {
				value: 'Der zu kopierende Text',
				onSuccess: 'Callback bei erfolgreicher Kopie',
				onError: 'Callback bei fehlgeschlagener Kopie',
			},
			errors: {
				empty_value: 'Es ist kein Text zum Kopieren vorhanden',
				clipboard_failed: 'Clipboard-API fehlgeschlagen, Fallback auf execCommand',
			},
		},
		lazy: {
			description: 'Lazy-Load-Direktive, lädt Bilder oder Komponenten verzögert',
			params: {
				src: 'Bildquelladresse',
				threshold: 'Auslöseschwelle',
				rootMargin: 'Rand des Wurzelelements',
			},
			errors: {
				invalid_src: 'Der Parameter src ist ungültig',
				observer_failed: 'IntersectionObserver konnte nicht erstellt werden',
			},
		},
		permission: {
			description: 'Berechtigungs-Direktive, steuert die Sichtbarkeit von Elementen basierend auf Berechtigungen',
			params: {
				value: 'Berechtigungswert oder Berechtigungsarray',
				mode: 'Berechtigungsmodus: any oder all',
			},
			errors: {
				empty_permission: 'Berechtigungswert darf nicht leer sein',
				invalid_mode: 'mode muss any oder all sein',
			},
		},
		mask: {
			description: 'Eingabe-Masken-Direktive, formatiert Eingabeinhalte',
			params: {
				pattern: 'Maskenmuster',
				placeholder: 'Platzhalter',
				allowIncomplete: 'Ob unvollständige Eingabe erlaubt ist',
			},
			errors: {
				invalid_pattern: 'Der Parameter pattern ist ungültig',
			},
		},
		hotkey: {
			description: 'Hotkey-Direktive, bindet Tastenkombinationen',
			params: {
				key: 'Tastenkombination',
				handler: 'Handler-Funktion',
				prevent: 'Ob Standardverhalten verhindert wird',
			},
			errors: {
				invalid_key: 'Ungültiges Tastenkombinationsformat',
				conflict: 'Tastenkombinationskonflikt: {key}',
			},
		},
		clickoutside: {
			description: 'Click-Outside-Direktive, erkennt Klicks außerhalb eines Elements',
			params: {
				handler: 'Handler-Funktion bei Klick außerhalb',
				exclude: 'Liste der ausgeschlossenen Elemente',
			},
			errors: {
				invalid_handler: 'handler muss eine Funktion sein',
			},
		},
		longpress: {
			description: 'Long-Press-Direktive, erkennt langes Drücken',
			params: {
				duration: 'Dauer für langes Drücken (Millisekunden)',
				handler: 'Funktion, die bei langem Drücken ausgelöst wird',
			},
			errors: {
				invalid_duration: 'duration muss eine positive Zahl sein',
			},
		},
		draggable: {
			description: 'Drag-Direktive, macht ein Element ziehbar',
			params: {
				axis: 'Ziehachse: x, y oder leer',
				bounds: 'Ziehgrenzen',
				handle: 'Selektor für Ziehgriff',
			},
			errors: {
				invalid_bounds: 'Der Parameter bounds ist ungültig',
			},
		},
		intersect: {
			description: 'Intersection-Observer-Direktive, erkennt die Sichtbarkeit von Elementen',
			params: {
				threshold: 'Sichtbarkeitsschwelle',
				rootMargin: 'Rand des Wurzelelements',
				once: 'Ob nur einmal ausgelöst wird',
			},
			errors: {
				observer_failed: 'IntersectionObserver konnte nicht erstellt werden',
			},
		},
		loading: {
			description: 'Lade-Direktive, zeigt Ladezustand an',
			params: {
				value: 'Ob gerade geladen wird',
				text: 'Ladehinweistext',
				spinner: 'Ladeicon',
			},
		},
		skeleton: {
			description: 'Skeleton-Direktive, zeigt Inhaltsplatzhalter an',
			params: {
				value: 'Ob Skeleton angezeigt wird',
				variant: 'Skeleton-Variante',
				animation: 'Animationstyp',
			},
		},
		virtualList: {
			description: 'Virtual-List-Direktive, optimiert das Rendern großer Datenmengen',
			params: {
				itemSize: 'Elementhöhe',
				buffer: 'Puffergröße',
				estimatedSize: 'Geschätzte Höhe',
			},
			errors: {
				invalid_itemSize: 'itemSize muss eine positive Zahl sein',
			},
		},
		infiniteScroll: {
			description: 'Infinite-Scroll-Direktive, implementiert Scroll-zum-Laden-weiter',
			params: {
				handler: 'Handler-Funktion zum Laden weiterer Inhalte',
				distance: 'Auslöseabstand',
				disabled: 'Ob deaktiviert',
			},
			errors: {
				invalid_handler: 'handler muss eine Funktion sein',
			},
		},
		watermark: {
			description: 'Wasserzeichen-Direktive, fügt einem Element ein Wasserzeichen hinzu',
			params: {
				content: 'Wasserzeicheninhalt',
				fontSize: 'Schriftgröße',
				color: 'Wasserzeichenfarbe',
				opacity: 'Transparenz',
			},
			errors: {
				empty_content: 'Wasserzeicheninhalt darf nicht leer sein',
			},
		},
		contextmenu: {
			description: 'Kontextmenü-Direktive, benutzerdefiniertes Kontextmenü',
			params: {
				items: 'Liste der Menüeinträge',
				handler: 'Handler für Menüeintragsklicks',
			},
			errors: {
				empty_items: 'Liste der Menüeinträge darf nicht leer sein',
			},
		},
		fullscreen: {
			description: 'Vollbild-Direktive, zeigt ein Element im Vollbildmodus an',
			params: {
				value: 'Ob Vollbild',
				onEnter: 'Callback beim Eintritt in den Vollbildmodus',
				onExit: 'Callback beim Verlassen des Vollbildmodus',
			},
			errors: {
				not_supported: 'Der aktuelle Browser unterstützt die Fullscreen-API nicht',
			},
		},
		imagePreview: {
			description: 'Bildvorschau-Direktive, Vorschau großer Bilder bei Klick',
			params: {
				src: 'Bildquelladresse',
				list: 'Bilderliste',
				initialIndex: 'Anfangsindex',
			},
			errors: {
				invalid_src: 'Der Parameter src ist ungültig',
			},
		},
		tooltip: {
			description: 'Tooltip-Direktive, zeigt Tooltip beim Hover an',
			params: {
				content: 'Tooltip-Inhalt',
				placement: 'Anzeigeposition',
				trigger: 'Auslöseart',
			},
			errors: {
				empty_content: 'Tooltip-Inhalt darf nicht leer sein',
			},
		},
		lottie: {
			description: 'Lottie-Animations-Direktive, spielt Lottie-Animationen ab',
			params: {
				path: 'Pfad zur Animationsdatei',
				animationData: 'Animationsdaten',
				loop: 'Ob in Schleife wiedergegeben wird',
				autoplay: 'Ob automatisch abgespielt wird',
			},
			errors: {
				invalid_source: 'path oder animationData muss angegeben werden',
				load_failed: 'Lottie-Animation konnte nicht geladen werden',
			},
		},
		swipe: {
			description: 'Swipe-Gesten-Direktive, erkennt Wischrichtung',
			params: {
				threshold: 'Wischschwelle',
				velocity: 'Geschwindigkeitsschwelle',
				onSwipe: 'Wisch-Callback',
			},
			errors: {
				invalid_threshold: 'threshold muss eine positive Zahl sein',
			},
		},
		touch: {
			description: 'Touch-Gesten-Direktive, einheitliche Verarbeitung von Touch-Ereignissen',
			params: {
				onStart: 'Callback bei Berührungsbeginn',
				onMove: 'Callback bei Berührungsbewegung',
				onEnd: 'Callback bei Berührungsende',
			},
		},
		pan: {
			description: 'Pan-Gesten-Direktive, erkennt Schwenkoperationen',
			params: {
				threshold: 'Auslöseschwelle',
				direction: 'Schwenkrichtung: all, horizontal, vertical',
			},
		},
		pinch: {
			description: 'Pinch-Gesten-Direktive, erkennt Skalierungsoperationen',
			params: {
				threshold: 'Skalierungsschwelle',
				onPinch: 'Skalierungs-Callback',
			},
		},
		rotateGesture: {
			description: 'Rotations-Gesten-Direktive, erkennt Drehoperationen',
			params: {
				threshold: 'Schwellenwert für Rotationswinkel',
				onRotate: 'Rotations-Callback',
			},
		},
		parallax: {
			description: 'Parallax-Scroll-Direktive, erzeugt einen Parallax-Effekt',
			params: {
				speed: 'Parallax-Geschwindigkeit',
				direction: 'Parallax-Richtung',
			},
		},
		typewriter: {
			description: 'Schreibmaschinen-Direktive, erzeugt einen Schreibmaschineneffekt',
			params: {
				text: 'Der anzuzeigende Text',
				speed: 'Schreibgeschwindigkeit',
				delay: 'Verzögerter Start',
			},
			errors: {
				empty_text: 'Textinhalt darf nicht leer sein',
			},
		},
		countdown: {
			description: 'Countdown-Direktive, zeigt einen Countdown an',
			params: {
				time: 'Countdown-Zeit (Millisekunden)',
				format: 'Zeitformat',
				onFinish: 'Callback bei Fertigstellung',
			},
			errors: {
				invalid_time: 'time muss eine positive Zahl sein',
			},
		},
		counter: {
			description: 'Zähler-Direktive, Zahlenanimation',
			params: {
				from: 'Startwert',
				to: 'Endwert',
				duration: 'Animationsdauer',
				decimals: 'Anzahl der Dezimalstellen',
			},
			errors: {
				invalid_range: 'from und to müssen Zahlen sein',
			},
		},
		progress: {
			description: 'Fortschrittsbalken-Direktive, zeigt Fortschritt an',
			params: {
				value: 'Fortschrittswert (0-100)',
				showText: 'Ob Text angezeigt wird',
				strokeWidth: 'Strichbreite',
			},
			errors: {
				invalid_value: 'value muss zwischen 0 und 100 liegen',
			},
		},
		emoji: {
			description: 'Emoji-Auswahl-Direktive, Emoji-Auswahl',
			params: {
				onSelect: 'Auswahl-Callback',
				exclude: 'Ausgeschlossene Emoji-Kategorien',
			},
		},
		money: {
			description: 'Geldbetrags-Eingabe-Direktive, formatiert Geldbeträge',
			params: {
				currency: 'Währungssymbol',
				precision: 'Anzahl der Dezimalstellen',
				thousands: 'Tausendertrennzeichen',
			},
		},
		number: {
			description: 'Zahlen-Eingabe-Direktive, schränkt Zahleneingaben ein',
			params: {
				min: 'Mindestwert',
				max: 'Höchstwert',
				precision: 'Anzahl der Dezimalstellen',
			},
			errors: {
				invalid_range: 'min muss kleiner als max sein',
			},
		},
		truncate: {
			description: 'Truncate-Direktive, schneidet Text ab',
			params: {
				length: 'Maximale Länge',
				omission: 'Auslassungszeichen',
			},
			errors: {
				invalid_length: 'length muss eine positive ganze Zahl sein',
			},
		},
		ellipsis: {
			description: 'Ellipsis-Direktive, CSS-Auslassungsanzeige',
			params: {
				lines: 'Maximale Zeilenanzahl',
			},
		},
		highlight: {
			description: 'Hervorhebungs-Direktive, hebt Textinhalte hervor',
			params: {
				keyword: 'Hervorzuhebendes Schlüsselwort',
				color: 'Hervorhebungsfarbe',
				className: 'CSS-Klassenname',
			},
			errors: {
				empty_keyword: 'Schlüsselwort darf nicht leer sein',
			},
		},
		sanitize: {
			description: 'Sanitize-Direktive, bereinigt HTML-Inhalte',
			params: {
				allowedTags: 'Erlaubte Tags',
				allowedAttrs: 'Erlaubte Attribute',
			},
		},
		focus: {
			description: 'Fokus-Direktive, fokussiert ein Element automatisch',
			params: {
				value: 'Ob fokussiert wird',
				preventScroll: 'Ob Scrollen verhindert wird',
			},
		},
		visible: {
			description: 'Sichtbarkeits-Direktive, steuert die Anzeige von Elementen',
			params: {
				value: 'Ob sichtbar',
			},
		},
		blur: {
			description: 'Unscharf-Direktive, macht Elementinhalte unscharf',
			params: {
				value: 'Unschärfegrad',
				transition: 'Übergangseffekt',
			},
		},
		hover: {
			description: 'Hover-Direktive, erkennt Maus-Hover',
			params: {
				onEnter: 'Callback beim Eintritt',
				onLeave: 'Callback beim Verlassen',
			},
		},
		fade: {
			description: 'Fade-Direktive, Ein- und Ausblendeeffekt',
			params: {
				duration: 'Animationsdauer',
				delay: 'Verzögerungszeit',
			},
		},
		clickWave: {
			description: 'Klick-Wellen-Direktive, Klick-Welleneffekt',
			params: {
				color: 'Wellenfarbe',
				duration: 'Animationsdauer',
			},
		},
		clickDelay: {
			description: 'Klick-Verzögerungs-Direktive, verhindert schnelles Klicken',
			params: {
				delay: 'Verzögerungszeit',
			},
			errors: {
				invalid_delay: 'delay muss eine positive Zahl sein',
			},
		},
		scroll: {
			description: 'Scroll-Direktive, steuert Scrollverhalten',
			params: {
				behavior: 'Scrollverhalten',
				smooth: 'Ob sanft gescrollt wird',
			},
		},
		sticky: {
			description: 'Sticky-Direktive, Sticky-Positionierungseffekt',
			params: {
				offsetTop: 'Oberer Versatz',
				offsetBottom: 'Unterer Versatz',
			},
		},
		print: {
			description: 'Druck-Direktive, druckt Elementinhalte',
			params: {
				title: 'Drucktitel',
				onBefore: 'Callback vor dem Drucken',
				onAfter: 'Callback nach dem Drucken',
			},
		},
		export_: {
			description: 'Export-Direktive, exportiert Elementinhalte',
			params: {
				type: 'Exporttyp: image, pdf',
				filename: 'Dateiname',
				quality: 'Qualität',
			},
			errors: {
				unsupported_type: 'Nicht unterstützter Exporttyp',
			},
		},
		pullRefresh: {
			description: 'Pull-to-Refresh-Direktive, Pull-to-Refresh-Funktion',
			params: {
				onRefresh: 'Aktualisierungs-Callback',
				distance: 'Auslöseabstand',
			},
			errors: {
				invalid_handler: 'onRefresh muss eine Funktion sein',
			},
		},
		resize: {
			description: 'Resize-Direktive, überwacht Größenänderungen von Elementen',
			params: {
				handler: 'Callback bei Größenänderung',
				debounce: 'Debounce-Zeit',
			},
			errors: {
				observer_failed: 'ResizeObserver konnte nicht erstellt werden',
			},
		},
		mutation: {
			description: 'Mutation-Observer-Direktive, überwacht DOM-Änderungen',
			params: {
				handler: 'Änderungs-Callback',
				options: 'Beobachtungsoptionen',
			},
			errors: {
				observer_failed: 'MutationObserver konnte nicht erstellt werden',
			},
		},
		ripple: {
			description: 'Ripple-Direktive, Material-Design-Ripple-Effekt',
			params: {
				color: 'Ripple-Farbe',
				duration: 'Animationsdauer',
			},
		},
		uppercase: {
			description: 'Großbuchstaben-Direktive, konvertiert zu Großbuchstaben',
		},
		lowercase: {
			description: 'Kleinbuchstaben-Direktive, konvertiert zu Kleinbuchstaben',
		},
		capitalcase: {
			description: 'Anfangsgroßbuchstaben-Direktive, schreibt den ersten Buchstaben groß',
		},
		trim: {
			description: 'Trim-Direktive, entfernt führende und nachfolgende Leerzeichen',
		},
	},
	errors: {
		invalid_param: 'Der Parameter {param} ist ungültig',
		missing_required: 'Erforderlicher Parameter {param} fehlt',
		type_error: 'Typfehler bei Parameter {param}, erwartet {expected}, tatsächlich {actual}',
		value_out_of_range: 'Wert des Parameters {param} außerhalb des Bereichs, sollte zwischen {min} und {max} liegen',
		not_supported: '{feature} wird in der aktuellen Umgebung nicht unterstützt',
		ssr_not_supported: 'Die Direktive {directive} unterstützt kein SSR',
	},
	warnings: {
		deprecated: '{feature} ist veraltet, bitte verwenden Sie {alternative}',
		experimental: '{feature} ist eine experimentelle Funktion und kann sich in zukünftigen Versionen ändern',
		performance: '{feature} kann die Leistung beeinträchtigen, Verwendung mit Vorsicht empfohlen',
		fallback: '{feature} fehlgeschlagen, Fallback auf {alternative}',
	},
	help: {
		installation: 'Installieren Sie mit npm install directix',
		usage: 'Registrieren Sie das Directix-Plugin in der Vue-Anwendung',
		contribution: 'Siehe CONTRIBUTING.md für Informationen zur Mitwirkung',
	},
}

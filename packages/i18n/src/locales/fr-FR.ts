import type { I18nMessages } from '../types'

export const frFR: I18nMessages = {
	directives: {
		debounce: {
			description: 'Directive d\'anti-rebond, retarde l\'exécution du gestionnaire d\'événement',
			params: {
				wait: 'Délai d\'attente (millisecondes)',
				leading: 'Appeler avant le début du délai',
				trailing: 'Appeler après la fin du délai',
			},
			errors: {
				invalid_wait: 'Le paramètre wait est invalide, doit être un nombre positif',
				invalid_handler: 'Le handler doit être une fonction',
			},
		},
		throttle: {
			description: 'Directive de limitation, limite la fréquence de déclenchement des événements',
			params: {
				interval: 'Intervalle d\'exécution (millisecondes)',
				leading: 'Appeler au début de l\'intervalle',
				trailing: 'Appeler à la fin de l\'intervalle',
			},
			errors: {
				invalid_interval: 'Le paramètre interval est invalide, doit être un nombre positif',
				invalid_handler: 'Le handler doit être une fonction',
			},
		},
		copy: {
			description: 'Directive de copie, copie le texte dans le presse-papiers au clic',
			params: {
				value: 'Texte à copier',
				onSuccess: 'Callback de succès de la copie',
				onError: 'Callback d\'erreur de la copie',
			},
			errors: {
				empty_value: 'Aucun texte à copier',
				clipboard_failed: 'L\'API du presse-papiers a échoué, retour à execCommand',
			},
		},
		lazy: {
			description: 'Directive de chargement différé, charge les images ou composants de manière différée',
			params: {
				src: 'URL source de l\'image',
				threshold: 'Seuil de déclenchement',
				rootMargin: 'Marge de l\'élément racine',
			},
			errors: {
				invalid_src: 'Le paramètre src est invalide',
				observer_failed: 'Échec de la création de l\'IntersectionObserver',
			},
		},
		permission: {
			description: 'Directive de permission, contrôle la visibilité des éléments selon les permissions',
			params: {
				value: 'Valeur de permission ou tableau de permissions',
				mode: 'Mode de permission : any ou all',
			},
			errors: {
				empty_permission: 'La valeur de permission ne peut pas être vide',
				invalid_mode: 'Le mode doit être any ou all',
			},
		},
		mask: {
			description: 'Directive de masque de saisie, formate le contenu de l\'entrée',
			params: {
				pattern: 'Motif du masque',
				placeholder: 'Caractère de substitution',
				allowIncomplete: 'Autoriser la saisie incomplète',
			},
			errors: {
				invalid_pattern: 'Le paramètre pattern est invalide',
			},
		},
		hotkey: {
			description: 'Directive de raccourci clavier, lie des raccourcis clavier',
			params: {
				key: 'Combinaison de raccourci clavier',
				handler: 'Fonction de traitement',
				prevent: 'Empêcher le comportement par défaut',
			},
			errors: {
				invalid_key: 'Format de raccourci clavier invalide',
				conflict: 'Conflit de raccourci clavier : {key}',
			},
		},
		clickoutside: {
			description: 'Directive de clic extérieur, détecte les clics en dehors de l\'élément',
			params: {
				handler: 'Fonction de traitement lors d\'un clic extérieur',
				exclude: 'Liste des éléments exclus',
			},
			errors: {
				invalid_handler: 'Le handler doit être une fonction',
			},
		},
		longpress: {
			description: 'Directive d\'appui long, détecte le geste d\'appui long',
			params: {
				duration: 'Durée d\'appui long (millisecondes)',
				handler: 'Fonction déclenchée par l\'appui long',
			},
			errors: {
				invalid_duration: 'La duration doit être un nombre positif',
			},
		},
		draggable: {
			description: 'Directive de glissement, rend un élément glissable',
			params: {
				axis: 'Axe de glissement : x, y ou vide',
				bounds: 'Limites de glissement',
				handle: 'Sélecteur de poignée de glissement',
			},
			errors: {
				invalid_bounds: 'Le paramètre bounds est invalide',
			},
		},
		intersect: {
			description: 'Directive d\'observation d\'intersection, détecte la visibilité d\'un élément',
			params: {
				threshold: 'Seuil de visibilité',
				rootMargin: 'Marge de l\'élément racine',
				once: 'Ne se déclencher qu\'une seule fois',
			},
			errors: {
				observer_failed: 'Échec de la création de l\'IntersectionObserver',
			},
		},
		loading: {
			description: 'Directive de chargement, affiche l\'état de chargement',
			params: {
				value: 'En cours de chargement',
				text: 'Texte d\'indication de chargement',
				spinner: 'Icône de chargement',
			},
		},
		skeleton: {
			description: 'Directive squelette, affiche des espaces réservés pour le contenu',
			params: {
				value: 'Afficher le squelette',
				variant: 'Variante du squelette',
				animation: 'Type d\'animation',
			},
		},
		virtualList: {
			description: 'Directive de liste virtuelle, optimise le rendu des grandes quantités de données',
			params: {
				itemSize: 'Hauteur de l\'élément',
				buffer: 'Taille du tampon',
				estimatedSize: 'Hauteur estimée',
			},
			errors: {
				invalid_itemSize: 'L\'itemSize doit être un nombre positif',
			},
		},
		infiniteScroll: {
			description: 'Directive de défilement infini, implémente le chargement de données au défilement',
			params: {
				handler: 'Fonction de traitement du chargement de données',
				distance: 'Distance de déclenchement',
				disabled: 'Désactivé',
			},
			errors: {
				invalid_handler: 'Le handler doit être une fonction',
			},
		},
		watermark: {
			description: 'Directive de filigrane, ajoute un filigrane à l\'élément',
			params: {
				content: 'Contenu du filigrane',
				fontSize: 'Taille de police',
				color: 'Couleur du filigrane',
				opacity: 'Opacité',
			},
			errors: {
				empty_content: 'Le contenu du filigrane ne peut pas être vide',
			},
		},
		contextmenu: {
			description: 'Directive de menu contextuel, personnalise le menu du clic droit',
			params: {
				items: 'Liste des éléments du menu',
				handler: 'Gestionnaire de clic sur un élément du menu',
			},
			errors: {
				empty_items: 'La liste des éléments du menu ne peut pas être vide',
			},
		},
		fullscreen: {
			description: 'Directive plein écran, affiche un élément en plein écran',
			params: {
				value: 'Plein écran',
				onEnter: 'Callback d\'entrée en plein écran',
				onExit: 'Callback de sortie du plein écran',
			},
			errors: {
				not_supported: 'L\'API plein écran n\'est pas prise en charge par le navigateur actuel',
			},
		},
		imagePreview: {
			description: 'Directive d\'aperçu d\'image, affiche un aperçu agrandi au clic',
			params: {
				src: 'URL source de l\'image',
				list: 'Liste d\'images',
				initialIndex: 'Index initial',
			},
			errors: {
				invalid_src: 'Le paramètre src est invalide',
			},
		},
		tooltip: {
			description: 'Directive d\'info-bulle, affiche une info-bulle au survol',
			params: {
				content: 'Contenu de l\'info-bulle',
				placement: 'Position d\'affichage',
				trigger: 'Mode de déclenchement',
			},
			errors: {
				empty_content: 'Le contenu de l\'info-bulle ne peut pas être vide',
			},
		},
		lottie: {
			description: 'Directive d\'animation Lottie, lit des animations Lottie',
			params: {
				path: 'Chemin du fichier d\'animation',
				animationData: 'Données d\'animation',
				loop: 'Lecture en boucle',
				autoplay: 'Lecture automatique',
			},
			errors: {
				invalid_source: 'Vous devez fournir path ou animationData',
				load_failed: 'Échec du chargement de l\'animation Lottie',
			},
		},
		swipe: {
			description: 'Directive de geste de balayage, détecte la direction du balayage',
			params: {
				threshold: 'Seuil de balayage',
				velocity: 'Seuil de vitesse',
				onSwipe: 'Callback de balayage',
			},
			errors: {
				invalid_threshold: 'Le threshold doit être un nombre positif',
			},
		},
		touch: {
			description: 'Directive de geste tactile, gère de manière unifiée les événements tactiles',
			params: {
				onStart: 'Callback de début tactile',
				onMove: 'Callback de mouvement tactile',
				onEnd: 'Callback de fin tactile',
			},
		},
		pan: {
			description: 'Directive de geste de panoramique, détecte les opérations de panoramique',
			params: {
				threshold: 'Seuil de déclenchement',
				direction: 'Direction du panoramique : all, horizontal, vertical',
			},
		},
		pinch: {
			description: 'Directive de geste de pincement, détecte les opérations de zoom',
			params: {
				threshold: 'Seuil de zoom',
				onPinch: 'Callback de zoom',
			},
		},
		rotateGesture: {
			description: 'Directive de geste de rotation, détecte les opérations de rotation',
			params: {
				threshold: 'Seuil d\'angle de rotation',
				onRotate: 'Callback de rotation',
			},
		},
		parallax: {
			description: 'Directive de défilement parallaxe, crée un effet de parallaxe',
			params: {
				speed: 'Vitesse de parallaxe',
				direction: 'Direction de parallaxe',
			},
		},
		typewriter: {
			description: 'Directive d\'effet machine à écrire, crée un effet de machine à écrire',
			params: {
				text: 'Texte à afficher',
				speed: 'Vitesse de frappe',
				delay: 'Délai avant le début',
			},
			errors: {
				empty_text: 'Le contenu textuel ne peut pas être vide',
			},
		},
		countdown: {
			description: 'Directive de compte à rebours, affiche un compte à rebours',
			params: {
				time: 'Durée du compte à rebours (millisecondes)',
				format: 'Format de l\'heure',
				onFinish: 'Callback de fin',
			},
			errors: {
				invalid_time: 'Le time doit être un nombre positif',
			},
		},
		counter: {
			description: 'Directive de compteur, animation de nombres',
			params: {
				from: 'Valeur de départ',
				to: 'Valeur d\'arrivée',
				duration: 'Durée de l\'animation',
				decimals: 'Nombre de décimales',
			},
			errors: {
				invalid_range: 'from et to doivent être des nombres',
			},
		},
		progress: {
			description: 'Directive de barre de progression, affiche la progression',
			params: {
				value: 'Valeur de progression (0-100)',
				showText: 'Afficher le texte',
				strokeWidth: 'Largeur du trait',
			},
			errors: {
				invalid_value: 'La value doit être comprise entre 0 et 100',
			},
		},
		emoji: {
			description: 'Directive de sélection d\'émoticônes, sélecteur d\'émoticônes',
			params: {
				onSelect: 'Callback de sélection',
				exclude: 'Catégories d\'émoticônes exclues',
			},
		},
		money: {
			description: 'Directive de saisie monétaire, formate les montants',
			params: {
				currency: 'Symbole monétaire',
				precision: 'Nombre de décimales',
				thousands: 'Séparateur de milliers',
			},
		},
		number: {
			description: 'Directive de saisie numérique, limite la saisie numérique',
			params: {
				min: 'Valeur minimale',
				max: 'Valeur maximale',
				precision: 'Nombre de décimales',
			},
			errors: {
				invalid_range: 'min doit être inférieur à max',
			},
		},
		truncate: {
			description: 'Directive de troncature, tronque le texte',
			params: {
				length: 'Longueur maximale',
				omission: 'Symbole d\'omission',
			},
			errors: {
				invalid_length: 'Le length doit être un entier positif',
			},
		},
		ellipsis: {
			description: 'Directive de points de suspension, affichage avec points de suspension CSS',
			params: {
				lines: 'Nombre maximal de lignes',
			},
		},
		highlight: {
			description: 'Directive de surlignage, met en évidence le contenu textuel',
			params: {
				keyword: 'Mot-clé de surlignage',
				color: 'Couleur de surlignage',
				className: 'Nom de classe CSS',
			},
			errors: {
				empty_keyword: 'Le mot-clé ne peut pas être vide',
			},
		},
		sanitize: {
			description: 'Directive de nettoyage, nettoie le contenu HTML',
			params: {
				allowedTags: 'Balises autorisées',
				allowedAttrs: 'Attributs autorisés',
			},
		},
		focus: {
			description: 'Directive de focus, focalise automatiquement l\'élément',
			params: {
				value: 'Focaliser',
				preventScroll: 'Empêcher le défilement',
			},
		},
		visible: {
			description: 'Directive de visibilité, contrôle l\'affichage de l\'élément',
			params: {
				value: 'Visible',
			},
		},
		blur: {
			description: 'Directive de flou, rend flou le contenu de l\'élément',
			params: {
				value: 'Niveau de flou',
				transition: 'Effet de transition',
			},
		},
		hover: {
			description: 'Directive de survol, détecte le survol de la souris',
			params: {
				onEnter: 'Callback d\'entrée',
				onLeave: 'Callback de sortie',
			},
		},
		fade: {
			description: 'Directive de fondu, effet de fondu entrant/sortant',
			params: {
				duration: 'Durée de l\'animation',
				delay: 'Délai d\'attente',
			},
		},
		clickWave: {
			description: 'Directive d\'onde de clic, effet d\'onde au clic',
			params: {
				color: 'Couleur de l\'onde',
				duration: 'Durée de l\'animation',
			},
		},
		clickDelay: {
			description: 'Directive de délai de clic, empêche les clics rapides',
			params: {
				delay: 'Délai d\'attente',
			},
			errors: {
				invalid_delay: 'Le delay doit être un nombre positif',
			},
		},
		scroll: {
			description: 'Directive de défilement, contrôle le comportement de défilement',
			params: {
				behavior: 'Comportement de défilement',
				smooth: 'Défilement fluide',
			},
		},
		sticky: {
			description: 'Directive de positionnement adhésif, effet de positionnement adhésif',
			params: {
				offsetTop: 'Décalage supérieur',
				offsetBottom: 'Décalage inférieur',
			},
		},
		print: {
			description: 'Directive d\'impression, imprime le contenu de l\'élément',
			params: {
				title: 'Titre d\'impression',
				onBefore: 'Callback avant impression',
				onAfter: 'Callback après impression',
			},
		},
		export_: {
			description: 'Directive d\'exportation, exporte le contenu de l\'élément',
			params: {
				type: 'Type d\'exportation : image, pdf',
				filename: 'Nom du fichier',
				quality: 'Qualité',
			},
			errors: {
				unsupported_type: 'Type d\'exportation non pris en charge',
			},
		},
		pullRefresh: {
			description: 'Directive d\'actualisation par tirage, fonctionnalité d\'actualisation par tirage vers le bas',
			params: {
				onRefresh: 'Callback d\'actualisation',
				distance: 'Distance de déclenchement',
			},
			errors: {
				invalid_handler: 'onRefresh doit être une fonction',
			},
		},
		resize: {
			description: 'Directive de redimensionnement, surveille les changements de taille de l\'élément',
			params: {
				handler: 'Callback de changement de taille',
				debounce: 'Temps d\'anti-rebond',
			},
			errors: {
				observer_failed: 'Échec de la création du ResizeObserver',
			},
		},
		mutation: {
			description: 'Directive d\'observation des mutations, surveille les changements du DOM',
			params: {
				handler: 'Callback de mutation',
				options: 'Options d\'observation',
			},
			errors: {
				observer_failed: 'Échec de la création du MutationObserver',
			},
		},
		ripple: {
			description: 'Directive d\'effet ondulation, effet d\'ondulation Material Design',
			params: {
				color: 'Couleur de l\'ondulation',
				duration: 'Durée de l\'animation',
			},
		},
		uppercase: {
			description: 'Directive de majuscules, convertit en majuscules',
		},
		lowercase: {
			description: 'Directive de minuscules, convertit en minuscules',
		},
		capitalcase: {
			description: 'Directive de capitale, met la première lettre en majuscule',
		},
		trim: {
			description: 'Directive de suppression des espaces, supprime les espaces en début et fin',
		},
	},
	errors: {
		invalid_param: 'Le paramètre {param} est invalide',
		missing_required: 'Le paramètre requis {param} est manquant',
		type_error: 'Erreur de type pour le paramètre {param}, attendu {expected}, obtenu {actual}',
		value_out_of_range: 'La valeur du paramètre {param} est hors limites, doit être entre {min} et {max}',
		not_supported: '{feature} n\'est pas pris en charge dans l\'environnement actuel',
		ssr_not_supported: 'La directive {directive} ne prend pas en charge le SSR',
	},
	warnings: {
		deprecated: '{feature} est obsolète, veuillez utiliser {alternative}',
		experimental: '{feature} est une fonctionnalité expérimentale, susceptible de changer dans les futures versions',
		performance: '{feature} peut affecter les performances, utilisation recommandée avec précaution',
		fallback: '{feature} a échoué, retour à {alternative}',
	},
	help: {
		installation: 'Installer avec npm install directix',
		usage: 'Enregistrer le plugin Directix dans l\'application Vue',
		contribution: 'Consultez CONTRIBUTING.md pour savoir comment contribuer',
	},
}

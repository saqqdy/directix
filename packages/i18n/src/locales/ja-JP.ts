import type { I18nMessages } from '../types'

export const jaJP: I18nMessages = {
	directives: {
		debounce: {
			description: 'デバウンスディレクティブ - イベントハンドラの実行を遅延',
			params: {
				wait: '遅延時間（ミリ秒）',
				leading: '遅延開始前に呼び出すかどうか',
				trailing: '遅延終了後に呼び出すかどうか',
			},
			errors: {
				invalid_wait: '"wait"パラメータが無効です。正の数値を指定してください',
				invalid_handler: 'ハンドラは関数である必要があります',
			},
		},
		throttle: {
			description: 'スロットルディレクティブ - イベントトリガー頻度を制限',
			params: {
				interval: '実行間隔（ミリ秒）',
				leading: '間隔開始時に呼び出すかどうか',
				trailing: '間隔終了時に呼び出すかどうか',
			},
			errors: {
				invalid_interval: '"interval"パラメータが無効です。正の数値を指定してください',
				invalid_handler: 'ハンドラは関数である必要があります',
			},
		},
		copy: {
			description: 'コピーディレクティブ - クリックでテキストをクリップボードにコピー',
			params: {
				value: 'コピーするテキスト',
				onSuccess: 'コピー成功時のコールバック',
				onError: 'コピー失敗時のコールバック',
			},
			errors: {
				empty_value: 'コピーするテキストがありません',
				clipboard_failed: 'クリップボードAPIが失敗しました。execCommandにフォールバックします',
			},
		},
		lazy: {
			description: '遅延ロードディレクティブ - 画像またはコンポーネントの読み込みを延期',
			params: {
				src: '画像ソースURL',
				threshold: 'インターセクションしきい値',
				rootMargin: 'ルートマージン',
			},
			errors: {
				invalid_src: '"src"パラメータが無効です',
				observer_failed: 'IntersectionObserverの作成に失敗しました',
			},
		},
		permission: {
			description: '権限ディレクティブ - 権限による要素表示制御',
			params: {
				value: '権限値または配列',
				mode: '権限モード: any または all',
			},
			errors: {
				empty_permission: '権限値を空にすることはできません',
				invalid_mode: 'モードは"any"または"all"である必要があります',
			},
		},
		mask: {
			description: '入力マスクディレクティブ - 入力内容をフォーマット',
			params: {
				pattern: 'マスクパターン',
				placeholder: 'プレースホルダー文字',
				allowIncomplete: '不完全な入力を許可',
			},
			errors: {
				invalid_pattern: '"pattern"パラメータが無効です',
			},
		},
		hotkey: {
			description: 'ホットキーディレクティブ - キーボードショートカットをバインド',
			params: {
				key: 'キーボードショートカットの組み合わせ',
				handler: 'ハンドラ関数',
				prevent: 'デフォルトの動作を防止するかどうか',
			},
			errors: {
				invalid_key: 'ホットキーの形式が無効です',
				conflict: 'ホットキーが競合しています: {key}',
			},
		},
		clickoutside: {
			description: 'クリック外部ディレクティブ - 要素外のクリックを検出',
			params: {
				handler: '外部クリック時のハンドラ関数',
				exclude: '除外する要素',
			},
			errors: {
				invalid_handler: 'ハンドラは関数である必要があります',
			},
		},
		longpress: {
			description: '長押しディレクティブ - 長押しジェスチャーを検出',
			params: {
				duration: '押下時間（ミリ秒）',
				handler: '長押しハンドラ関数',
			},
			errors: {
				invalid_duration: '時間は正の数値である必要があります',
			},
		},
		draggable: {
			description: 'ドラッグ可能ディレクティブ - 要素をドラッグ可能にする',
			params: {
				axis: 'ドラッグ軸: x、y、または空',
				bounds: 'ドラッグ境界',
				handle: 'ドラッグハンドルセレクタ',
			},
			errors: {
				invalid_bounds: '"bounds"パラメータが無効です',
			},
		},
		intersect: {
			description: 'インターセクトディレクティブ - 要素の可視性を観察',
			params: {
				threshold: '可視性しきい値',
				rootMargin: 'ルートマージン',
				once: '1回だけトリガーするかどうか',
			},
			errors: {
				observer_failed: 'IntersectionObserverの作成に失敗しました',
			},
		},
		loading: {
			description: 'ローディングディレクティブ - ロード状態を表示',
			params: {
				value: 'ロード中かどうか',
				text: 'ロードテキスト',
				spinner: 'ロードスピナー',
			},
		},
		skeleton: {
			description: 'スケルトンディレクティブ - コンテンツプレースホルダーを表示',
			params: {
				value: 'スケルトンを表示するかどうか',
				variant: 'スケルトンバリアント',
				animation: 'アニメーションタイプ',
			},
		},
		virtualList: {
			description: '仮想リストディレクティブ - 大量データのレンダリングを最適化',
			params: {
				itemSize: 'アイテムの高さ',
				buffer: 'バッファサイズ',
				estimatedSize: '推定サイズ',
			},
			errors: {
				invalid_itemSize: 'itemSizeは正の数値である必要があります',
			},
		},
		infiniteScroll: {
			description: '無限スクロールディレクティブ - スクロールで更に読み込み',
			params: {
				handler: '更に読み込むハンドラ関数',
				distance: 'トリガー距離',
				disabled: '無効かどうか',
			},
			errors: {
				invalid_handler: 'ハンドラは関数である必要があります',
			},
		},
		watermark: {
			description: '透かしディレクティブ - 透かしオーバーレイを追加',
			params: {
				content: '透かしコンテンツ',
				fontSize: 'フォントサイズ',
				color: '透かしの色',
				opacity: '不透明度',
			},
			errors: {
				empty_content: '透かしコンテンツを空にすることはできません',
			},
		},
		contextmenu: {
			description: 'コンテキストメニューディレクティブ - カスタム右クリックメニュー',
			params: {
				items: 'メニューアイテムリスト',
				handler: 'メニューアイテムクリックハンドラ',
			},
			errors: {
				empty_items: 'メニューアイテムリストを空にすることはできません',
			},
		},
		fullscreen: {
			description: 'フルスクリーンディレクティブ - 要素をフルスクリーンに切り替え',
			params: {
				value: 'フルスクリーンかどうか',
				onEnter: 'フルスクリーン进入コールバック',
				onExit: 'フルスクリーン終了コールバック',
			},
			errors: {
				not_supported: 'このブラウザではフルスクリーンAPIがサポートされていません',
			},
		},
		imagePreview: {
			description: '画像プレビューディレクティブ - クリックで画像をプレビュー',
			params: {
				src: '画像ソースURL',
				list: '画像リスト',
				initialIndex: '初期インデックス',
			},
			errors: {
				invalid_src: '"src"パラメータが無効です',
			},
		},
		tooltip: {
			description: 'ツールチップディレクティブ - ホバーツールチップを表示',
			params: {
				content: 'ツールチップコンテンツ',
				placement: '表示位置',
				trigger: 'トリガー方法',
			},
			errors: {
				empty_content: 'ツールチップコンテンツを空にすることはできません',
			},
		},
		lottie: {
			description: 'Lottieアニメーションディレクティブ - Lottieアニメーションを再生',
			params: {
				path: 'アニメーションファイルパス',
				animationData: 'アニメーションデータ',
				loop: 'ループするかどうか',
				autoplay: '自動再生するかどうか',
			},
			errors: {
				invalid_source: 'pathまたはanimationDataを指定してください',
				load_failed: 'Lottieアニメーションの読み込みに失敗しました',
			},
		},
		swipe: {
			description: 'スワイプジェスチャーディレクティブ - スワイプ方向を検出',
			params: {
				threshold: 'スワイプしきい値',
				velocity: '速度しきい値',
				onSwipe: 'スワイプコールバック',
			},
			errors: {
				invalid_threshold: 'しきい値は正の数値である必要があります',
			},
		},
		touch: {
			description: 'タッチジェスチャーディレクティブ - 統一タッチイベント処理',
			params: {
				onStart: 'タッチ開始コールバック',
				onMove: 'タッチ移動コールバック',
				onEnd: 'タッチ終了コールバック',
			},
		},
		pan: {
			description: 'パンジェスチャーディレクティブ - パン操作を検出',
			params: {
				threshold: 'トリガーしきい値',
				direction: 'パン方向: all、horizontal、vertical',
			},
		},
		pinch: {
			description: 'ピンチジェスチャーディレクティブ - ズーム操作を検出',
			params: {
				threshold: 'ズームしきい値',
				onPinch: 'ズームコールバック',
			},
		},
		rotateGesture: {
			description: '回転ジェスチャーディレクティブ - 回転操作を検出',
			params: {
				threshold: '回転角度しきい値',
				onRotate: '回転コールバック',
			},
		},
		parallax: {
			description: 'パララックスディレクティブ - パララックススクロール効果を作成',
			params: {
				speed: 'パララックス速度',
				direction: 'パララックス方向',
			},
		},
		typewriter: {
			description: 'タイプライターディレクティブ - タイプライターテキストアニメーション',
			params: {
				text: '表示するテキスト',
				speed: 'タイピング速度',
				delay: '開始遅延',
			},
			errors: {
				empty_text: 'テキストコンテンツを空にすることはできません',
			},
		},
		countdown: {
			description: 'カウントダウンディレクティブ - カウントダウンタイマーを表示',
			params: {
				time: 'カウントダウン時間（ミリ秒）',
				format: '時間形式',
				onFinish: '終了コールバック',
			},
			errors: {
				invalid_time: '時間は正の数値である必要があります',
			},
		},
		counter: {
			description: 'カウンターディレクティブ - 数字アニメーション',
			params: {
				from: '開始値',
				to: '終了値',
				duration: 'アニメーション時間',
				decimals: '小数点以下の桁数',
			},
			errors: {
				invalid_range: 'fromとtoは数値である必要があります',
			},
		},
		progress: {
			description: 'プログレスディレクティブ - プログレスバーを表示',
			params: {
				value: 'プログレス値（0-100）',
				showText: 'テキストを表示するかどうか',
				strokeWidth: 'ストローク幅',
			},
			errors: {
				invalid_value: '値は0から100の間である必要があります',
			},
		},
		emoji: {
			description: '絵文字ピッカーディレクティブ - 絵文字セレクター',
			params: {
				onSelect: '選択コールバック',
				exclude: '除外する絵文字カテゴリ',
			},
		},
		money: {
			description: '金額入力ディレクティブ - 通貨金額をフォーマット',
			params: {
				currency: '通貨記号',
				precision: '小数点以下の桁数',
				thousands: '千単位の区切り文字',
			},
		},
		number: {
			description: '数値入力ディレクティブ - 数値入力を制限',
			params: {
				min: '最小値',
				max: '最大値',
				precision: '小数点以下の桁数',
			},
			errors: {
				invalid_range: 'minはmaxより小さい必要があります',
			},
		},
		truncate: {
			description: 'トランケートディレクティブ - テキストを切り捨て',
			params: {
				length: '最大長',
				omission: '省略文字列',
			},
			errors: {
				invalid_length: '長さは正の整数である必要があります',
			},
		},
		ellipsis: {
			description: 'エリプシスディレクティブ - CSSテキストオーバーフローの省略',
			params: {
				lines: '最大行数',
			},
		},
		highlight: {
			description: 'ハイライトディレクティブ - テキストコンテンツをハイライト',
			params: {
				keyword: 'ハイライトキーワード',
				color: 'ハイライト色',
				className: 'CSSクラス名',
			},
			errors: {
				empty_keyword: 'キーワードを空にすることはできません',
			},
		},
		sanitize: {
			description: 'サニタイズディレクティブ - HTMLコンテンツをサニタイズ',
			params: {
				allowedTags: '許可するタグ',
				allowedAttrs: '許可する属性',
			},
		},
		focus: {
			description: 'フォーカスディレクティブ - 要素を自動フォーカス',
			params: {
				value: 'フォーカスするかどうか',
				preventScroll: 'スクロールを防止するかどうか',
			},
		},
		visible: {
			description: '可視性ディレクティブ - 要素の表示を制御',
			params: {
				value: '可視かどうか',
			},
		},
		blur: {
			description: 'ブラーディレクティブ - 要素コンテンツをぼかす',
			params: {
				value: 'ぼかし量',
				transition: 'トランジション効果',
			},
		},
		hover: {
			description: 'ホバーディレクティブ - マウスホバーを検出',
			params: {
				onEnter: '进入コールバック',
				onLeave: '離脱コールバック',
			},
		},
		fade: {
			description: 'フェードディレクティブ - フェードイン/アウト効果',
			params: {
				duration: 'アニメーション時間',
				delay: '遅延時間',
			},
		},
		clickWave: {
			description: 'クリック波紋ディレクティブ - クリック波紋効果',
			params: {
				color: '波紋の色',
				duration: 'アニメーション時間',
			},
		},
		clickDelay: {
			description: 'クリック遅延ディレクティブ - 連続クリックを防止',
			params: {
				delay: '遅延時間',
			},
			errors: {
				invalid_delay: '遅延は正の数値である必要があります',
			},
		},
		scroll: {
			description: 'スクロールディレクティブ - スクロール動作を制御',
			params: {
				behavior: 'スクロール動作',
				smooth: 'スムーズスクロールかどうか',
			},
		},
		sticky: {
			description: 'スティッキーディレクティブ - スティッキー配置',
			params: {
				offsetTop: '上オフセット',
				offsetBottom: '下オフセット',
			},
		},
		print: {
			description: '印刷ディレクティブ - 要素コンテンツを印刷',
			params: {
				title: '印刷タイトル',
				onBefore: '印刷前コールバック',
				onAfter: '印刷後コールバック',
			},
		},
		export_: {
			description: 'エクスポートディレクティブ - 要素コンテンツをエクスポート',
			params: {
				type: 'エクスポートタイプ: image、pdf',
				filename: 'ファイル名',
				quality: '品質',
			},
			errors: {
				unsupported_type: 'サポートされていないエクスポートタイプ',
			},
		},
		pullRefresh: {
			description: 'プル更新ディレクティブ - プルツーリフレッシュ機能',
			params: {
				onRefresh: '更新コールバック',
				distance: 'トリガー距離',
			},
			errors: {
				invalid_handler: 'onRefreshは関数である必要があります',
			},
		},
		resize: {
			description: 'リサイズディレクティブ - 要素サイズの変化を観察',
			params: {
				handler: 'サイズ変更コールバック',
				debounce: 'デバウンス時間',
			},
			errors: {
				observer_failed: 'ResizeObserverの作成に失敗しました',
			},
		},
		mutation: {
			description: 'ミューテーションディレクティブ - DOMの変化を観察',
			params: {
				handler: 'ミューテーションコールバック',
				options: 'オブザーバーオプション',
			},
			errors: {
				observer_failed: 'MutationObserverの作成に失敗しました',
			},
		},
		ripple: {
			description: 'リップルディレクティブ - Material Designリップル効果',
			params: {
				color: 'リップルの色',
				duration: 'アニメーション時間',
			},
		},
		uppercase: {
			description: '大文字ディレクティブ - 大文字に変換',
		},
		lowercase: {
			description: '小文字ディレクティブ - 小文字に変換',
		},
		capitalcase: {
			description: '先頭大文字ディレクティブ - 先頭を大文字に',
		},
		trim: {
			description: 'トリムディレクティブ - 空白をトリム',
		},
	},
	errors: {
		invalid_param: 'パラメータ"{param}"が無効です',
		missing_required: '必須パラメータ"{param}"が不足しています',
		type_error: 'パラメータ"{param}"の型エラー: {expected}を期待しましたが、{actual}です',
		value_out_of_range: 'パラメータ"{param}"が範囲外です。{min}から{max}の間である必要があります',
		not_supported: '{feature}は現在の環境でサポートされていません',
		ssr_not_supported: 'ディレクティブ{directive}はSSRをサポートしていません',
	},
	warnings: {
		deprecated: '{feature}は非推奨です。{alternative}を使用してください',
		experimental: '{feature}は実験的機能で、将来のバージョンで変更される可能性があります',
		performance: '{feature}はパフォーマンスに影響する可能性があります。慎重に使用してください',
		fallback: '{feature}が失敗しました。{alternative}にフォールバックします',
	},
	help: {
		installation: 'npm install directix でインストール',
		usage: 'VueアプリにDirectixプラグインを登録してください',
		contribution: '貢献方法はCONTRIBUTING.mdを参照してください',
	},
}

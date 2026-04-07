/**
 * Directive options for configuration
 */
export interface DirectiveOptions {
	/**
	 * Whether to enable the directive
	 */
	enabled?: boolean

	/**
	 * Custom configuration for the directive
	 */
	config?: Record<string, any>
}

/**
 * Directive install options
 */
export interface DirectiveInstallOptions {
	/**
	 * List of directive names to install
	 */
	directives?: string[]

	/**
	 * Install all directives
	 * @default false
	 */
	all?: boolean
}

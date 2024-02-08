import {App, Plugin, Editor, PluginSettingTab, Setting, Menu, Notice, MarkdownView} from "obsidian"


interface QuickLinkSettings {
	delimiter_char: string;
}

const DEFAULT_SETTINGS: Partial<QuickLinkSettings> = {
	delimiter_char: "_"
};

export default class QuickLinkPlugin extends Plugin{
	settings : QuickLinkSettings
	async onload() {
		await this.loadSettings()
		
		this.addSettingTab(new QuickLinkSettingTab(this.app, this));

		let settings = this.settings


		this.addRibbonIcon("link", "QuickLink", (event) => {
			const menu = new Menu();
	  
			menu.addItem((item) =>
			  item
				.setTitle("Create hyperlink")
				.setIcon("documents")
				.onClick(() => {
						const view = this.app.workspace.getActiveViewOfType(MarkdownView);
						if(view) {
							let delimiter = settings.delimiter_char
							const link_string = view.editor.getSelection();
							if(link_string.contains(delimiter)) {
								const link_array = link_string.split(delimiter)
							view.editor.replaceSelection("[[" + link_array[0] + "|" + link_array[1] + "]]");
							}
							else {
								view.editor.replaceSelection("[[" + link_string + "]]")
							}
						}
						
						
					})
			);
	  
			menu.showAtMouseEvent(event);
		  });

		this.addCommand({
			id: "add-quick-link",
			name: "Add quick link",
			editorCallback(editor: Editor) {
				let delimiter = settings.delimiter_char
				const link_string = editor.getSelection();

				if(link_string.contains(delimiter)) {
					const link_array = link_string.split(delimiter)
				editor.replaceSelection("[[" + link_array[0] + "|" + link_array[1] + "]]");
				}
				else {
					editor.replaceSelection("[[" + link_string + "]]")
				}

				
			}
		});
		
	}
	


	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async unload() {
	}
};

export class QuickLinkSettingTab extends PluginSettingTab{
	plugin: QuickLinkPlugin;

	constructor(app: App, plugin: QuickLinkPlugin) {
		super(app, plugin);
		this.plugin = plugin
	}


	display() {
		let {containerEl} = this;
		
		containerEl.empty();

		new Setting(containerEl)
		.setName("String delimiter")
		.setDesc("Default delimiter")
		.addText((text) =>
			text
			.setValue(this.plugin.settings.delimiter_char)
			.onChange(async (value) => {
				this.plugin.settings.delimiter_char = value;
				await this.plugin.saveSettings();
			})
		)}

};
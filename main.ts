import {App, Plugin, Editor, PluginSettingTab, Setting} from "obsidian"
import { delimiter } from "path";
import { text } from "stream/consumers";

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

		this.addCommand({
			id: "add-quick-link",
			name: "Add quick link",
			editorCallback(editor: Editor) {
				let delimiter = settings.delimiter_char
				const link = editor.getSelection();
				const link_array = link.split(delimiter)
				editor.replaceSelection("[[" + link_array[0] + "|" + link_array[1] + "]]");
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
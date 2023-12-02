import {Plugin, Editor} from "obsidian"

export default class QuickLinkPlugin extends Plugin{
	onload(): void{
		this.addCommand({
			id: "add-quick-link",
			name: "Add quick link",
			editorCallback(editor: Editor) {
				const link = editor.getSelection();
				const link_array = link.split("_")
				editor.replaceSelection("[[" + link_array[0] + "|" + link_array[1] + "]]");
			}
		});
	};

	unload(): void {
		
	};
};
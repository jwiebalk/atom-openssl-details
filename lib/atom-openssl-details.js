'use babel';

import AtomOpensslDetailsView from './atom-openssl-details-view';
import { CompositeDisposable } from 'atom';

export default {

  atomOpensslDetailsView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.atomOpensslDetailsView = new AtomOpensslDetailsView(state.atomOpensslDetailsViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.atomOpensslDetailsView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-openssl-details:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.atomOpensslDetailsView.destroy();
  },

  serialize() {
    return {
      atomOpensslDetailsViewState: this.atomOpensslDetailsView.serialize()
    };
  },

  // toggle() {
  //   console.log('AtomOpensslDetails was toggled!');
  //   return (
  //     this.modalPanel.isVisible() ?
  //     this.modalPanel.hide() :
  //     this.modalPanel.show()
  //   );
  // }

  //   toggle() {
  //   let editor
  //   if (editor = atom.workspace.getActiveTextEditor()) {
  //     let selection = editor.getSelectedText()
  //     let reversed = selection.split('').reverse().join('')
  //     editor.insertText(reversed)
  //   }
  // }


  toggle() {

    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {

      const {spawn} = require('child_process')
      const openssl_cmd = atom.config.get('atom-openssl-details.openssl') || "openssl";
      if (file = editor.buffer.file) {
        const filePath = file.path

        const open_ssl = spawn(openssl_cmd, ['x509', '-in', filePath, '-trustout', '-text']);

        open_ssl.stdout.on('data', (data) => {
          editor.insertText(`${data}`)
        });

        open_ssl.stderr.on('data', (data) => {
          console.log(`stderr: ${data}`);
        });

        open_ssl.on('close', (code) => {
          console.log(`child process exited with code ${code}`);
        });

      }
      else {

        let selection = editor.getSelectedText()
        const open_ssl = spawn(openssl_cmd, ['x509', '-trustout', '-text']);

        open_ssl.stdin.write(selection);

        open_ssl.stdout.on('data', function (data) {
          editor.insertText(`${data}`)
        });
        open_ssl.stdin.end();

      }
    }
  }
};

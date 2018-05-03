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

    // Register command that decodes this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-openssl-details:decode': () => this.decode(),
      'atom-openssl-details:cfssl_bundle': () => this.cfssl_bundle()
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

  decode() {

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
  },

  cfssl_bundle() {

    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {

      const {spawn} = require('child_process')
      const cfssl_cmd = atom.config.get('atom-openssl-details.cfssl') || "cfssl";
      //const cfssljson_cmd = atom.config.get('atom-openssl-details.cfssljson') || "cfssljson";

      if (file = editor.buffer.file) {
        const filePath = file.path

        const cfsssl = spawn(cfssl_cmd, ['bundle', '-cert', filePath]);

        cfsssl.stdout.on('data', (data) => {
          editor.insertText(`${data}`)
        });

        cfsssl.stderr.on('data', (data) => {
          console.log(`stderr: ${data}`);
        });

        cfsssl.on('close', (code) => {
          console.log(`child process exited with code ${code}`);
        });
        //cfssljson -bare -stdout

        const jq_cmd = atom.config.get('atom-openssl-details.jq') || "jq";
        let alltext = editor.getText()
        const jq = spawn(jq_cmd, ['.bundle']);

        jq.stdin.write(alltext);

        jq.stdout.on('data', function (data) {
          editor.insertText(`${data}`)
        });
        jq.stdin.end();

        // let alltext = editor.getText()
        // const cfssljson = spawn(cfssljson_cmd, ['-bare', '-stdout']);
        //
        // cfssljson.stdin.write(alltext);
        //
        // cfssljson.stdout.on('data', function (data) {
        //   editor.insertText(`${data}`)
        // });
        // cfssljson.stdin.end();
      }

    }
  }
};

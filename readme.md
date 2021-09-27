<h1>JSftp-simplify</h1>

This class will help you do more complex things with [jsftp](https://github.com/sergi/jsftp).

<h2>What can you do? </h2>

You can:
* Create a folder with subfolders 
* Remove a folder and its' subfolders/files
* Remove a single file
* Get the list-information of a folder using `ls`
* Renaming a folder or a file
* Cut a file to a directory 

<br/>

---
<h2>How to install?</h2>
1. Install <em>jsftp</em>: <code>npm i jsftp</code><br>
2. Download the file <em>jsftp_simplify.js</em><br>
3. Change <code>this.config</code> in the <code>constructor()</code> function so it point to your server <br>
4. Require <em>jsftp_simplify</em>: <code>const jsftp_simplify = require('path/to/jsftp_simplify');</code>

---
<h2> How to use</h2>
Creating a new folder:<br>
<code>jsftp_simplify.makeDir('folderName')</code>
<br/>
<br/>
Creating a new folder or an existing folder with subfolders:<br>
<code>jsftp_simplify.makeDir('folderName/subfolderName/subfolderName')</code>

---
<br/>

Removing a folder and its' subfolders/files:<br>
<code>jsftp_simplify.removeDir('path/to/folderName')</code>

---
<br>

Removing a single file:<br>
<code>jsftp_simplify.removeFile('path/to/fileName')</code>

---

<br>
Get the list-information of a folder:<br>
<code>jsftp_simplify.ls('path/to/folderName')</code>
<br/>
Returns an array of objects containing <code>{name: string, size: Number, isFolder: boolean}</code>

---
<br/>
Renaming a folder or a file:<br>
<code>jsftp_simplify.rename({ path: 'path/to/folderOrFilename', name: 'newName' })</code>

---
<br/>
Cut a file to a directory: <br>
<code>jsftp_simplify.xcopy({ from: 'path/to/fileName', to: 'new/path' })</code>

---
<br/>

<h1>Importrtant</h1>
Some functions are not implemented (e.g. upload, download). Feel free to implement new functions. I'll not add new feature, however, if any issue occur I'll try to fix them.
If you have any questions about <em>JSftp-simplify</em>, just pm me!

<br>
<br/>
<h1>License</h1>
See License
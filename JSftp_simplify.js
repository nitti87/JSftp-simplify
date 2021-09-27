const ftp = require("jsftp");

class jsftp_simplify {
  constructor() {
    this.config = {
      host: "127.0.0.1",
      user: "admin",
      pass: "",
      port: 21,
    };

    this.nextPath = [];
    this.currentDir = [];
  }

  async makeDir(paths) {
    const path = paths.split("/");

    const addDir = async (dir) => {
      return await new Promise((resolve, reject) => {
        const ftpConnection = new ftp(this.config);
        const currentDir = `${this.currentDir.join("/")}/`;

        path.shift();

        new ftp(this.config).raw("mkd", currentDir, (err, result) => {
          if (err) reject(err);
          path.length ? loop() : undefined;
        });

        ftpConnection.destroy();
        resolve(dir);
      });
    };

    const loop = () => {
      this.currentDir.push(path[0]);
      addDir(path[0]);
    };

    loop();
  }

  async removeDir(path, isRepeating = false) {
    const remove = async (dir) => {
      return await new Promise((resolve, reject) => {
        const ftpConnection = new ftp(this.config);

        this.nextPath.pop();
        ftpConnection.raw("rmd", `${dir}`, (err, _data) => {
          this.nextPath.length
            ? checkIfEmptyFolder(this.nextPath.join("/"))
            : console.log("done");

          if (err) {
            reject(err);
          }

          ftpConnection.destroy();
          return resolve();
        });
      });
    };

    const checkIfEmptyFolder = (dir) => {
      this.ls(dir).then(async (fileOrDirectory) => {
        if (fileOrDirectory.length) {
          // check if directory is not empty
          for (const el of fileOrDirectory) {
            if (el.isFolder) {
              this.nextPath.push(el.name);
              checkIfEmptyFolder(this.nextPath.join("/"));
              break;
            } else {
              this.removeFile(`${this.nextPath.join("/")}/${el.name}`, true);
              break;
            }
          }
        } else {
          return remove(this.nextPath.join("/"));
        }
      });
    };

    if (!isRepeating) this.nextPath.push(path);

    return checkIfEmptyFolder(path);
  }

  async removeFile(path, checkIfEmptyFolderAgain = false) {
    return new Promise((resolve, reject) => {
      const ftpConnection = new ftp(this.config);

      ftpConnection.raw("dele", path, (err) => {
        ftpConnection.destroy();

        if (checkIfEmptyFolderAgain && this.nextPath.length)
          return this.removeDir(this.nextPath.join("/"), true);

        if (err) reject(err);

        return resolve();
      });
    });
  }

  async ls(path) {
    let files = [];

    return new Promise((resolve, reject) => {
      const ftpConnection = new ftp(this.config);

      ftpConnection.ls(path || ".", (err, res) => {
        if (err) return reject(err);

        res.forEach((file) => {
          files.push({
            name: file.name,
            isFolder: file.type === 1,
            size: parseInt(file.size),
          });
        });

        ftpConnection.destroy();
        return resolve(files);
      });
    });
  }

  async rename({ path, name }, isMoving = false) {
    return new Promise((resolve, reject) => {
      const ftpConnection = new ftp(this.config);

      let newName = /[\/]/g.test(path)
        ? path.split("/").length > 1
          ? path.substring(0, path.lastIndexOf("/") + 1).trim() + name.trim()
          : name
        : path + "/";

      if (isMoving)
        newName =
          name +
          "/" +
          path.substring(path.lastIndexOf("/") + 1, path.length).trim();

      ftpConnection.raw("rnfr", path, (err) => {
        if (err) reject(err);

        ftpConnection.raw("rnto", newName.trim(), (error) => {
          if (error) reject(error);
        });

        ftpConnection.destroy();
        return resolve(name);
      });
    });
  }

  async xcopy({ from, to }) {
    return new Promise(async (resolve) => {
      await this.rename({ path: from, name: to }, true).then((msg) => {
        return resolve(msg);
      });
    });
  }
}

module.exports = new jsftp_simplify
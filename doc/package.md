# パッケージ

- 「作成者/パッケージ名/バージョン」で管理する。
- パッケージ管理用のレジストリが存在する。
  - `https://raw.githubusercontent.com/NextMicon/Package/main/${owner}/${package}/${version}/package.nm.yaml` が `~/NexMiconIDE/Package/${owner}/${package}/${version}/package.nm.yaml` に対応する。
- IDE起動時
  - `~/NextMiconIDE/Package/` 以下にあり、`package.nm.yaml` が存在するディレクトリは全てパッケージとみなし、全てロードする。
- ダウンロード
  - パッケージのリポジトリを `~/NextMiconIDE/Package` にクローンすれば、全てのパッケージをダウンロードできる。
  - 部分的にダウンロードすることもできる。
  - `https://github.com/NextMicon/Package/${owner}/${package}/${version}/package.nm.yaml` → `~/NexMiconIDE/Package/${owner}/${package}/${version}/package.nm.yaml`
  - `https://github.com/NextMicon/Package/${owner}/${package}/${version}/[Files]` → `~/NexMiconIDE/Package/${owner}/${package}/${version}/[Files]`
- 自作パッケージ
  - `~/NextMiconIDE/Package/${owner}/${package}/${version}` ディレクトリを作成し、編集する。
  - 設定画面から変更監視オプションをONにすると、自作パッケージの開発が楽になる。
  - 完成したら、レジストリのリポジトリにプルリクを送る。
  - github actions が走り、要件が満たされていたら、レジストリに自動的にマージされる。
- パッケージの検索
  - レジストリリポジトリには、全ライブラリのインデックス `registory.nm.yaml` がある。
  - これは新しくパッケージが追加されるごとに更新される。
  - IDE は起動時にこのファイルを見に行き、ローカルにコピーする。
  - → `~/NextMiconIDE/Package/registory.nm.yaml`
  - これを使ってパッケージを検索し、ダウンロードできる。

```yaml:
# registory.nm.yaml
- owner: NextMicon
  package: Digital
  version: ["0.0.0","0.0.1"]
  description: "Signal Input & Output"
  keywords: ["IO", "GPIO"]
- owner: NextMicon
  package: Analog
  version: ["0.0.0"]
  description: "Signal Input & Output"
  keywords: ["IO", "PWM"]
```

## パッケージの作成

### 1. ディレクトリの作成

`[user]/NextMiconIDE/Library/` 以下にライブラリがあります。

`[user]/NextMiconIDE/Library/[your_name]/[package_name]/0.0.0` というディレクトリを作ってください。`[your_name]`と`[package_name]`は自身で決めてください。

### 2. `package.nm.yaml` の作成

パッケージのファイルを作ります。
VSCodeを使用している場合、`yaml` 拡張機能を使用すればスキーマが適用されます。

### 3. Verilogのコーディング

`package.nm.yaml` からverilogのテンプレートを作成します。

```
$ next-micon-helper init-pack-verilog
```

```v:
module PACKAGE_NAME(
    input  wire        clk,
    input  wire [31:0] addr,
    input  wire [31:0] wdata,
    output wire [31:0] rdata,
    input  wire [3:0]  wstrb,
    output wire        ready,
    input  wire        in1,
    input  wire        in2,
    output wire        out
);

endmodule
```

IO ポートとレジスタが定義されたverilogファイルが生成されるので、中身を書いていってください。

### 4. C++のコーディング

`PackName.cpp`

### 5. レジストリへの登録

レジストリへの登録はプルリクを出すだけです。
GitHubへのアクセストークンがあれば、IDEのアップロードボタン一発で終わります。

#define AppName "ZeroToHand电子版"
[Setup]
AppId={{CFF45F03-4D61-4AF0-93F5-5C21174D7510}
AppName={#AppName}
AppPublisher=Zeruik
AppPublisherURL=mailto:zeruik@qq.com
AppVersion=10.0.0
VersionInfoVersion=10.0.0.0
DefaultDirName={code:DefaultInstallFolder}
DefaultGroupName=ZeroToHand
PrivilegesRequired=lowest
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
OutputDir=dist
OutputBaseFilename=Install-ZeroToHand-v10
Compression=lzma2/fast
SolidCompression=yes
WizardStyle=modern
MinVersion=10.0
DisableDirPage=no
DisableProgramGroupPage=yes
DisableWelcomePage=no
UninstallDisplayIcon={app}\ZeroToHand.exe
SetupIconFile=ZeroToHand-Academy.ico
WizardImageFile=setup-wizard.bmp
WizardSmallImageFile=setup-small.bmp
CloseApplications=no
RestartApplications=no
UsePreviousAppDir=yes
; Never terminate the learner's app or roll PATH back to a stale snapshot.
; This installer does not modify HKCU/HKLM environment variables.
[Languages]
Name: "chinesesimp"; MessagesFile: "compiler:Languages\ChineseSimplified.isl"
Name: "english"; MessagesFile: "compiler:Default.isl"
[Messages]
chinesesimp.WelcomeLabel1=欢迎来到工程学院 10.0
chinesesimp.WelcomeLabel2=从认识电路到理解机器人：106 课内容、29 个 3D 教学操作台，以及终端与 C 语句练习，均可离线使用。%n%n安装包已内置桌面运行环境，无需另装浏览器、下载依赖或配置环境变量。适用于 Windows 10/11 64 位电脑。%n%n接下来请确认许可与隐私说明，选择安装位置、存档位置和快捷方式。
english.WelcomeLabel1=Welcome to ZeroToHand Engineering Academy 10.0
english.WelcomeLabel2=Explore circuits, control and robotics with 106 lessons, 29 interactive 3D teaching workbenches, and terminal and C statement practice.%n%nThe desktop runtime is included. No separate browser, dependency download or environment-variable changes are needed. For Windows 10/11 64-bit computers.%n%nContinue to review the license and privacy information, then choose application and archive folders and shortcuts.
[CustomMessages]
chinesesimp.RuntimePageTitle=运行环境
chinesesimp.RuntimePageDescription=必要的桌面运行环境已包含在安装包中。
chinesesimp.RuntimeWindows=检测到的 Windows 版本：
chinesesimp.RuntimeArchitecture=安装包架构：x64（安装向导会检查系统兼容性）
chinesesimp.RuntimeBundled=桌面运行环境：已内置，无需另装浏览器或 Node.js
chinesesimp.RuntimeDownloads=安装期间：无需下载额外依赖
chinesesimp.RuntimeEnvironment=环境变量：应用无需配置，不会修改系统 PATH
chinesesimp.RuntimeGraphics=3D 显示：应用启动后检查 WebGL 2；不可用时显示兼容模型和提示。安装向导不测试显卡性能。
chinesesimp.StartMenuShortcut=创建开始菜单快捷方式
chinesesimp.LaunchAcademy=打开 ZeroToHand 工程学院
english.RuntimePageTitle=Runtime information
english.RuntimePageDescription=The required desktop runtime is included in this installer.
english.RuntimeWindows=Detected Windows version: 
english.RuntimeArchitecture=Installer architecture: x64 (system compatibility is checked by Setup)
english.RuntimeBundled=Desktop runtime: included; no separate browser or Node.js installation
english.RuntimeDownloads=During installation: no additional dependency downloads
english.RuntimeEnvironment=Environment variables: no configuration needed; system PATH is unchanged
english.RuntimeGraphics=3D display: the app checks WebGL 2 at launch and offers compatible models when unavailable. Setup does not benchmark the graphics hardware.
english.StartMenuShortcut=Create a Start menu shortcut
english.LaunchAcademy=Open ZeroToHand Engineering Academy
[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"
Name: "startmenu"; Description: "{cm:StartMenuShortcut}"
[Files]
Source: "LICENSE-ZH.txt"; DestDir: "{app}"; Flags: ignoreversion
Source: "PRIVACY-ZH.txt"; DestDir: "{app}"; Flags: ignoreversion
Source: "README.txt"; DestDir: "{app}"; Flags: ignoreversion
Source: "THIRD-PARTY-LICENSES.txt"; DestDir: "{app}"; Flags: ignoreversion
Source: "dist\desktop\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs
[Icons]
Name: "{group}\ZeroToHand电子版"; Filename: "{app}\ZeroToHand.exe"; IconFilename: "{app}\resources\app\icon.ico"; AppUserModelID: "ZeroToHand.Desktop"; Tasks: startmenu
Name: "{autodesktop}\ZeroToHand电子版"; Filename: "{app}\ZeroToHand.exe"; IconFilename: "{app}\resources\app\icon.ico"; AppUserModelID: "ZeroToHand.Desktop"; Tasks: desktopicon
[Run]
Filename: "{app}\ZeroToHand.exe"; Description: "{cm:LaunchAcademy}"; Flags: postinstall nowait skipifsilent
[Code]
var
  AgreementPage: TWizardPage;
  AgreementCheck: TNewCheckBox;
  PolicyMemo: TNewMemo;
  ArchivePage: TInputDirWizardPage;
  MigrateArchiveCheck: TNewCheckBox;
  ArchiveSourceInfo: TNewStaticText;
  PreviousArchive, RegisteredInstall, ArchiveConfigError, SelectionInstall: String;
  BackupFolder, BackupSource, MigratedSource, MigratedTarget: String;

const
  InstallerVersion = '10.0.0';
  AppExecutable = 'ZeroToHand.exe';
  UninstallKey = 'Software\Microsoft\Windows\CurrentVersion\Uninstall\{CFF45F03-4D61-4AF0-93F5-5C21174D7510}_is1';

function Tr(const ZH, EN: String): String;
begin
  if ActiveLanguage = 'english' then Result := EN else Result := ZH;
end;

function LocalPath(const Value: String): Boolean;
var I: Integer;
begin
  Result := False;
  if Length(Value) <= 3 then Exit;
  Result := (Pos(':\', Value) = 2) and
    (((Value[1] >= 'A') and (Value[1] <= 'Z')) or ((Value[1] >= 'a') and (Value[1] <= 'z')));
  for I := 1 to Length(Value) do
    if (Ord(Value[I]) < 32) or (Pos(Value[I], '"<>|?*') > 0) or ((Value[I] = ':') and (I <> 2)) then Result := False;
end;

function EnglishPath(const Value: String): Boolean;
var I: Integer;
begin
  Result := LocalPath(Value);
  for I := 1 to Length(Value) do
    if Ord(Value[I]) > 126 then Result := False;
end;

function SamePath(const A, B: String): Boolean;
begin
  Result := (A <> '') and (B <> '') and
    (CompareText(RemoveBackslashUnlessRoot(ExpandFileName(A)), RemoveBackslashUnlessRoot(ExpandFileName(B))) = 0);
end;

procedure SkipJSONSpace(const S: String; var P: Integer);
begin
  while (P <= Length(S)) and (Ord(S[P]) <= 32) do P := P + 1;
end;

function ReadJSONString(const S: String; var P: Integer; var Value: String): Boolean;
var C: Char; I, N, H: Integer;
begin
  Result := False; Value := '';
  SkipJSONSpace(S, P);
  if (P > Length(S)) or (S[P] <> '"') then Exit;
  P := P + 1;
  while P <= Length(S) do begin
    C := S[P]; P := P + 1;
    if C = '"' then begin Result := True; Exit; end;
    if Ord(C) < 32 then Exit;
    if C = '\' then begin
      if P > Length(S) then Exit;
      C := S[P]; P := P + 1;
      case C of
        '"', '\', '/': Value := Value + C;
        'u': begin
          if P + 3 > Length(S) then Exit;
          N := 0;
          for I := 0 to 3 do begin
            H := Pos(Uppercase(Copy(S, P + I, 1)), '0123456789ABCDEF') - 1;
            if H < 0 then Exit;
            N := N * 16 + H;
          end;
          Value := Value + Chr(N); P := P + 4;
        end;
      else Exit;
      end;
    end else Value := Value + C;
  end;
end;

function ReadArchiveConfig(const Folder: String; var Archive: String): Boolean;
var Raw: AnsiString; S, Key: String; P: Integer;
begin
  Result := False; Archive := '';
  if not LoadStringFromFile(AddBackslash(Folder) + 'storage-location.json', Raw) then Exit;
  if Length(Raw) > 65536 then Exit;
  S := UTF8Decode(Raw);
  if (Length(S) > 0) and (Ord(S[1]) = $FEFF) then Delete(S, 1, 1);
  P := 1; SkipJSONSpace(S, P);
  if (P > Length(S)) or (S[P] <> '{') then Exit;
  P := P + 1;
  if not ReadJSONString(S, P, Key) or (Key <> 'archivePath') then Exit;
  SkipJSONSpace(S, P);
  if (P > Length(S)) or (S[P] <> ':') then Exit;
  P := P + 1;
  if not ReadJSONString(S, P, Archive) then Exit;
  SkipJSONSpace(S, P);
  if (P > Length(S)) or (S[P] <> '}') then Exit;
  P := P + 1; SkipJSONSpace(S, P);
  Result := (P > Length(S)) and LocalPath(Archive);
end;

function ArchiveFileName(Index: Integer): String;
begin
  Result := 'learning-store.zthdb';
  if Index = 1 then Result := Result + '.previous';
  if Index = 2 then Result := Result + '.pending';
end;

function HasArchive(const Folder: String): Boolean;
var I: Integer;
begin
  Result := False;
  if Folder = '' then Exit;
  for I := 0 to 2 do
    if FileExists(AddBackslash(Folder) + ArchiveFileName(I)) then Result := True;
end;

function VersionIsNewer(const Version: String): Boolean;
var OldVersion, NewVersion: Int64;
begin
  Result := StrToVersion(Version, OldVersion) and StrToVersion(InstallerVersion, NewVersion);
  if Result then Result := ComparePackedVersion(OldVersion, NewVersion) > 0;
end;

function RegisteredNewer(var Version: String): Boolean;
begin
  Result := (RegQueryStringValue(HKCU64, UninstallKey, 'DisplayVersion', Version) and VersionIsNewer(Version)) or
    (RegQueryStringValue(HKCU32, UninstallKey, 'DisplayVersion', Version) and VersionIsNewer(Version)) or
    (RegQueryStringValue(HKLM64, UninstallKey, 'DisplayVersion', Version) and VersionIsNewer(Version)) or
    (RegQueryStringValue(HKLM32, UninstallKey, 'DisplayVersion', Version) and VersionIsNewer(Version));
end;

function RunningApplicationError: String;
var Locator, Services, Processes: Variant;
begin
  Result := '';
  try
    Locator := CreateOleObject('WbemScripting.SWbemLocator');
    Services := Locator.ConnectServer('.', 'root\CIMV2');
    Processes := Services.ExecQuery('SELECT ProcessId FROM Win32_Process WHERE Name="' + AppExecutable + '"');
    if Processes.Count > 0 then Result := Tr('请先在应用中保存并正常退出 ZeroToHand，再重试。安装或卸载不会强行结束应用。', 'Save your work and exit ZeroToHand normally, then retry. Setup and Uninstall will not force the application to close.');
  except
    Result := Tr('无法检查应用是否已退出。请确认 Windows 管理服务可用后重试；尚未覆盖程序文件。', 'Cannot check whether the application has exited. Check that Windows management services are available, then retry. Application files have not been replaced.');
  end;
  if Result <> '' then Log('APP_RUNNING_OR_CHECK_UNAVAILABLE');
end;

function InitializeSetup: Boolean;
var Version: String;
begin
  Result := not RegisteredNewer(Version);
  if not Result then begin
    Log('DOWNGRADE_BLOCKED: registered version ' + Version);
    SuppressibleMsgBox(Tr('已安装更高版本 ', 'A newer version is installed: ') + Version + Tr('。请使用相同或更新版本的安装包。', '. Use an installer of the same or a newer version.'), mbError, MB_OK, IDOK);
  end;
end;

procedure SelectExistingArchive(const InstallFolder: String);
var ConfigFolder, Candidate, Parameter: String;
begin
  if SamePath(InstallFolder, SelectionInstall) then Exit;
  SelectionInstall := InstallFolder; PreviousArchive := ''; ArchiveConfigError := '';
  RegisteredInstall := '';
  if not RegQueryStringValue(HKCU64, UninstallKey, 'InstallLocation', RegisteredInstall) then
    RegQueryStringValue(HKCU32, UninstallKey, 'InstallLocation', RegisteredInstall);
  ConfigFolder := InstallFolder;
  if not FileExists(AddBackslash(ConfigFolder) + 'storage-location.json') and (RegisteredInstall <> '') then ConfigFolder := RegisteredInstall;
  if FileExists(AddBackslash(ConfigFolder) + 'storage-location.json') then begin
    if not ReadArchiveConfig(ConfigFolder, PreviousArchive) then
      ArchiveConfigError := Tr('现有存档位置文件无法读取。为避免切换到空白存档，安装已停止；请先修复 storage-location.json 或联系支持。', 'The existing archive-location file cannot be read. Setup stopped to avoid switching to an empty archive. Repair storage-location.json or contact support.');
  end else begin
    Candidate := GetPreviousData('ArchivePath', '');
    if LocalPath(Candidate) then PreviousArchive := Candidate
    else if HasArchive(AddBackslash(InstallFolder) + 'Archives') then PreviousArchive := AddBackslash(InstallFolder) + 'Archives'
    else if HasArchive(ExpandConstant('{userappdata}\ZeroToHand Academy')) then PreviousArchive := ExpandConstant('{userappdata}\ZeroToHand Academy');
  end;
  if PreviousArchive <> '' then ArchivePage.Values[0] := PreviousArchive
  else ArchivePage.Values[0] := AddBackslash(InstallFolder) + 'Archives';
  Parameter := ExpandConstant('{param:ARCHIVEDIR|}');
  if Parameter <> '' then ArchivePage.Values[0] := Parameter;
  MigrateArchiveCheck.Checked := False;
  if PreviousArchive <> '' then ArchiveSourceInfo.Caption := Tr('现有存档（升级默认保留）：', 'Existing archive (retained by default): ') + PreviousArchive
  else ArchiveSourceInfo.Caption := Tr('首次安装：选择存档位置。卸载始终保留学习数据。', 'First installation: choose an archive folder. Uninstall always retains learning data.');
end;

function MigrationAllowed: Boolean;
begin
  if WizardSilent then Result := ExpandConstant('{param:MIGRATEARCHIVE|0}') = '1'
  else Result := MigrateArchiveCheck.Checked;
end;

function BackupArchive(const Source: String): Boolean;
var Folder, FileName: String; I, Number: Integer;
begin
  Result := True;
  if not HasArchive(Source) then Exit;
  if SamePath(Source, BackupSource) and (BackupFolder <> '') then Exit;
  Number := 0;
  repeat
    Folder := AddBackslash(Source) + 'UpgradeBackups\before-' + InstallerVersion + '-' + GetDateTimeString('yyyymmdd-hhnnss', '-', '-') + '-' + IntToStr(Number);
    Number := Number + 1;
  until not DirExists(Folder) and not FileExists(Folder);
  Result := ForceDirectories(Folder);
  if not Result then Exit;
  for I := 0 to 2 do begin
    FileName := ArchiveFileName(I);
    if FileExists(AddBackslash(Source) + FileName) then begin
      if not CopyFile(AddBackslash(Source) + FileName, AddBackslash(Folder) + FileName, True) then begin Result := False; Exit; end;
      if GetSHA256OfFile(AddBackslash(Source) + FileName) <> GetSHA256OfFile(AddBackslash(Folder) + FileName) then begin Result := False; Exit; end;
    end;
  end;
  BackupFolder := Folder; BackupSource := Source;
  Log('ARCHIVE_BACKUP_CREATED');
end;

function CopyArchive(const Source, Target: String): Boolean;
var I: Integer; FileName: String;
begin
  Result := True;
  if not HasArchive(Source) then Exit;
  if SamePath(Source, MigratedSource) and SamePath(Target, MigratedTarget) then Exit;
  if HasArchive(Target) then begin Result := False; Exit; end;
  for I := 0 to 2 do begin
    FileName := ArchiveFileName(I);
    if FileExists(AddBackslash(Source) + FileName) then begin
      if not CopyFile(AddBackslash(Source) + FileName, AddBackslash(Target) + FileName, True) then begin Result := False; Exit; end;
      if GetSHA256OfFile(AddBackslash(Source) + FileName) <> GetSHA256OfFile(AddBackslash(Target) + FileName) then begin Result := False; Exit; end;
    end;
  end;
  MigratedSource := Source; MigratedTarget := Target;
  Log('ARCHIVE_COPY_COMPLETED_ORIGINAL_RETAINED');
end;

function DefaultInstallFolder(Param: String): String;
begin
  Result := ExpandConstant('{localappdata}\Programs\ZeroToHand');
  if not EnglishPath(Result) then Result := ExpandConstant('{sd}\ZeroToHand');
end;

procedure AgreementClick(Sender: TObject);
begin
  WizardForm.NextButton.Enabled := AgreementCheck.Checked;
end;

procedure PolicyClick(Sender: TObject);
var Name: String; Text: AnsiString;
begin
  if TNewButton(Sender).Tag = 0 then Name := 'LICENSE-ZH.txt' else Name := 'PRIVACY-ZH.txt';
  ExtractTemporaryFile(Name);
  if LoadStringFromFile(ExpandConstant('{tmp}\') + Name, Text) then begin
    PolicyMemo.Text := Utf8Decode(Text);
    PolicyMemo.Visible := True;
  end;
end;

procedure InitializeWizard;
var Info: TNewStaticText; LicenseButton, PrivacyButton: TNewButton;
begin
  WizardForm.SelectDirLabel.Caption := Tr('请选择可写的全英文安装路径，例如 D:\ZeroToHand。路径中不要使用中文或其他非英文字符；程序创建的子文件夹也统一使用英文。', 'Choose a writable English-only path, for example D:\ZeroToHand. Avoid Chinese or other non-ASCII characters anywhere in the path. All application subfolders use English names.');
  AgreementPage := CreateCustomPage(wpWelcome, Tr('使用许可与隐私', 'License and privacy'), Tr('请确认以下使用条件。', 'Confirm the conditions below.'));
  Info := TNewStaticText.Create(AgreementPage);
  Info.Parent := AgreementPage.Surface;
  Info.SetBounds(0, 0, AgreementPage.SurfaceWidth, ScaleY(63));
  Info.AutoSize := False;
  Info.WordWrap := True;
  Info.Caption := Tr('版权所有 © 2026 Zeruik。原创部分仅限非商用；商业使用及应用修改、逆向需书面授权（法定例外与第三方许可除外）。联系：zeruik@qq.com。学习档案保存在本机；天气需主动启用。', 'Copyright © 2026 Zeruik. Original content is licensed for non-commercial use. Commercial use, application modification and reverse engineering require written permission, subject to legal exceptions and third-party licenses. Contact: zeruik@qq.com. Learning archives are local; weather is opt-in.');
  LicenseButton := TNewButton.Create(AgreementPage);
  LicenseButton.Parent := AgreementPage.Surface;
  LicenseButton.SetBounds(0, ScaleY(69), ScaleX(190), ScaleY(28));
  LicenseButton.Caption := Tr('查看完整使用许可', 'Read full license');
  LicenseButton.Tag := 0;
  LicenseButton.OnClick := @PolicyClick;
  PrivacyButton := TNewButton.Create(AgreementPage);
  PrivacyButton.Parent := AgreementPage.Surface;
  PrivacyButton.SetBounds(ScaleX(201), ScaleY(69), ScaleX(190), ScaleY(28));
  PrivacyButton.Caption := Tr('查看隐私说明', 'Read privacy information');
  PrivacyButton.Tag := 1;
  PrivacyButton.OnClick := @PolicyClick;
  PolicyMemo := TNewMemo.Create(AgreementPage);
  PolicyMemo.Parent := AgreementPage.Surface;
  PolicyMemo.SetBounds(0, ScaleY(106), AgreementPage.SurfaceWidth, AgreementPage.SurfaceHeight - ScaleY(153));
  PolicyMemo.ReadOnly := True;
  PolicyMemo.ScrollBars := ssVertical;
  PolicyMemo.Visible := False;
  AgreementCheck := TNewCheckBox.Create(AgreementPage);
  AgreementCheck.Parent := AgreementPage.Surface;
  AgreementCheck.SetBounds(0, AgreementPage.SurfaceHeight - ScaleY(36), AgreementPage.SurfaceWidth, ScaleY(32));
  AgreementCheck.Caption := Tr('我同意使用许可，并已了解隐私说明。', 'I accept the license and acknowledge the privacy information.');
  AgreementCheck.OnClick := @AgreementClick;
  AgreementCheck.Checked := False;
  ArchivePage := CreateInputDirPage(wpSelectDir, Tr('学习存档位置', 'Learning archive folder'), Tr('升级保留原位置；新目录请使用全英文路径。', 'Upgrades retain the existing folder; use ASCII for a new folder.'), Tr('首次安装默认使用 Archives。更换位置需勾选下方复制选项；原存档和升级备份均保留。跨电脑请导出 .zth。', 'First installation defaults to Archives. Changing folders requires the copy option below; originals and upgrade backups remain. Export .zth for another computer.'), False, 'Archives');
  ArchivePage.Add('');
  ArchiveSourceInfo := TNewStaticText.Create(ArchivePage);
  ArchiveSourceInfo.Parent := ArchivePage.Surface;
  ArchiveSourceInfo.SetBounds(0, ArchivePage.SurfaceHeight - ScaleY(116), ArchivePage.SurfaceWidth, ScaleY(54));
  ArchiveSourceInfo.AutoSize := False; ArchiveSourceInfo.WordWrap := True;
  MigrateArchiveCheck := TNewCheckBox.Create(ArchivePage);
  MigrateArchiveCheck.Parent := ArchivePage.Surface;
  MigrateArchiveCheck.SetBounds(0, ArchivePage.SurfaceHeight - ScaleY(53), ArchivePage.SurfaceWidth, ScaleY(45));
  MigrateArchiveCheck.Caption := Tr('更换位置时：复制现有学习存档到新目录，并保留原件。', 'When changing folders: copy the existing learning archive and retain the originals.');
  MigrateArchiveCheck.Checked := False;
  SelectExistingArchive(WizardDirValue);
end;

procedure CurPageChanged(CurPageID: Integer);
begin
  if CurPageID = AgreementPage.ID then WizardForm.NextButton.Enabled := AgreementCheck.Checked;
  if CurPageID = ArchivePage.ID then SelectExistingArchive(WizardDirValue);
end;

function NextButtonClick(CurPageID: Integer): Boolean;
begin
  Result := True;
  if CurPageID = AgreementPage.ID then begin
    if WizardSilent then Result := ExpandConstant('{param:ACCEPTLICENSE|0}') = '1'
    else Result := AgreementCheck.Checked;
  end;
  if CurPageID = wpSelectDir then begin
    Result := EnglishPath(WizardDirValue);
    if not Result then Log('ASCII_PATH_REQUIRED: installation directory');
    if not Result and not WizardSilent then MsgBox(Tr('请改用全英文安装路径，例如 D:\ZeroToHand。不要包含中文。', 'Use an English-only installation path, such as D:\ZeroToHand. No non-ASCII characters.'), mbError, MB_OK);
    if Result then SelectExistingArchive(WizardDirValue);
  end;
  if CurPageID = ArchivePage.ID then begin
    Result := EnglishPath(ArchivePage.Values[0]) or SamePath(ArchivePage.Values[0], PreviousArchive);
    if not Result then Log('ASCII_PATH_REQUIRED: archive directory');
    if not Result and not WizardSilent then MsgBox(Tr('请选择本机上的全英文完整路径，例如 D:\ZeroToHand\Archives。', 'Choose an English-only absolute local path, such as D:\ZeroToHand\Archives.'), mbError, MB_OK);
    if Result and (PreviousArchive <> '') and not SamePath(ArchivePage.Values[0], PreviousArchive) and not MigrationAllowed then begin
      Result := False; Log('ARCHIVE_MIGRATION_CONSENT_REQUIRED');
      if not WizardSilent then MsgBox(Tr('更换存档位置前，请勾选复制现有存档。否则请保留上方显示的原位置，避免出现空白学习记录。', 'To change archive folders, select the copy option. Otherwise retain the existing folder shown above to avoid empty learning records.'), mbInformation, MB_OK);
    end;
  end;
end;

function ShouldSkipPage(PageID: Integer): Boolean;
begin
  Result := WizardSilent and ((PageID = AgreementPage.ID) or (PageID = ArchivePage.ID));
end;

function PrepareToInstall(var NeedsRestart: Boolean): String;
var Folder, Probe, Version: String; ProbeNumber: Integer;
begin
  Result := '';
  SelectExistingArchive(WizardDirValue);
  if ArchiveConfigError <> '' then begin Result := ArchiveConfigError; Log('ARCHIVE_CONFIG_INVALID'); Exit; end;
  if RegisteredNewer(Version) or (GetVersionNumbersString(ExpandConstant('{app}\') + AppExecutable, Version) and VersionIsNewer(Version)) then begin
    Result := Tr('目标位置已有更高版本，已拒绝降级覆盖：', 'A newer version exists; downgrade overwrite was blocked: ') + Version;
    Log('DOWNGRADE_BLOCKED'); Exit;
  end;
  Result := RunningApplicationError;
  if Result <> '' then Exit;
  if WizardSilent then begin
    if ExpandConstant('{param:ACCEPTLICENSE|0}') <> '1' then begin Result := 'License acceptance required: /ACCEPTLICENSE=1'; Exit; end;
  end;
  Folder := ArchivePage.Values[0];
  if Folder = '' then Folder := ExpandConstant('{app}\Archives');
  ArchivePage.Values[0] := Folder;
  if not EnglishPath(ExpandConstant('{app}')) or not (EnglishPath(Folder) or SamePath(Folder, PreviousArchive)) then begin Log('ASCII_PATH_REQUIRED: installation or archive directory'); Result := Tr('安装路径与新存档路径必须全部使用英文字符。已有存档可保留原路径。', 'Installation and new archive paths must use ASCII. An existing archive may retain its original path.'); Exit; end;
  if (PreviousArchive <> '') and not SamePath(Folder, PreviousArchive) then begin
    if not MigrationAllowed then begin Result := 'ARCHIVE_MIGRATION_CONSENT_REQUIRED: /MIGRATEARCHIVE=1'; Log(Result); Exit; end;
    if HasArchive(Folder) and not (SamePath(PreviousArchive, MigratedSource) and SamePath(Folder, MigratedTarget)) then begin Result := Tr('新目录已经有学习存档，不能覆盖。请选择空目录或保留原位置；需要合并时请使用应用的 .zth 导入。', 'The destination already contains a learning archive and will not be overwritten. Select an empty folder or retain the current location; use .zth import to merge records.'); Log('ARCHIVE_TARGET_OCCUPIED'); Exit; end;
  end;
  if not ForceDirectories(Folder) then begin Result := Tr('无法创建存档文件夹。', 'Cannot create archive folder.'); Exit; end;
  ProbeNumber := 0;
  repeat
    Probe := AddBackslash(Folder) + '.zerotohand-setup-write-check-' + IntToStr(ProbeNumber);
    ProbeNumber := ProbeNumber + 1;
  until not FileExists(Probe) and not DirExists(Probe);
  if not SaveStringToFile(Probe, '', False) then Result := Tr('存档文件夹不可写，请返回选择其他位置。', 'Archive folder is not writable; choose another location.') else DeleteFile(Probe);
  if Result <> '' then Exit;
  try
    if not BackupArchive(PreviousArchive) then begin Result := Tr('未能完整备份现有存档，升级已停止。原文件保留，请检查磁盘空间与权限。', 'The existing archive could not be fully backed up. Upgrade stopped; originals remain. Check space and permissions.'); Exit; end;
    if (PreviousArchive <> '') and not SamePath(Folder, PreviousArchive) and not CopyArchive(PreviousArchive, Folder) then begin Result := Tr('存档复制未完成，安装已停止，原存档仍在。请检查目标目录，不要删除原件。', 'Archive copying did not finish. Setup stopped and the original remains. Inspect the destination without deleting the original.'); Exit; end;
  except
    Result := Tr('存档备份或校验失败，升级已停止。原文件保留。', 'Archive backup or verification failed. Upgrade stopped; original files remain.');
  end;
end;

procedure RegisterPreviousData(PreviousDataKey: Integer);
begin
  SetPreviousData(PreviousDataKey, 'ArchivePath', ArchivePage.Values[0]);
end;

procedure CurStepChanged(CurStep: TSetupStep);
var Escaped, RunningError: String;
begin
  if CurStep = ssInstall then begin
    RunningError := RunningApplicationError;
    if RunningError <> '' then RaiseException(RunningError);
  end;
  if CurStep = ssPostInstall then begin
    Escaped := ArchivePage.Values[0];
    StringChangeEx(Escaped, '\', '\\', True);
    StringChangeEx(Escaped, '"', '\"', True);
    if not SaveStringToFile(ExpandConstant('{app}\storage-location.json'), Utf8Encode('{"archivePath":"' + Escaped + '"}'), False) then RaiseException('Cannot save archive location');
  end;
end;

function UpdateReadyMemo(Space, NewLine, MemoUserInfoInfo, MemoDirInfo, MemoTypeInfo, MemoComponentsInfo, MemoGroupInfo, MemoTasksInfo: String): String;
begin
  Result := MemoDirInfo + NewLine + NewLine + Tr('学习存档：', 'Learning archive: ') + ArchivePage.Values[0] + NewLine;
  if (PreviousArchive <> '') and not SamePath(ArchivePage.Values[0], PreviousArchive) then
    Result := Result + Tr('将复制已有存档，保留原件。', 'Existing archives will be copied; originals remain.') + NewLine;
  Result := Result + Tr('升级前保留存档备份；卸载不删除学习记录或备份。环境变量与 PATH 均不修改、不回滚。', 'Archives are backed up before upgrade and retained with backups on uninstall. Environment variables and PATH are neither changed nor rolled back.') + NewLine + NewLine + MemoTasksInfo;
end;

function InitializeUninstall: Boolean;
var Error: String;
begin
  Error := RunningApplicationError;
  Result := Error = '';
  if not Result then SuppressibleMsgBox(Error, mbError, MB_OK, IDOK);
end;

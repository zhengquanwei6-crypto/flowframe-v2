import { useMemo, useState } from "react";
import {
  createInitialInputs,
  creditPlans,
  getFieldsForMode,
  sampleTasks,
  templates,
  type Task,
  type Template,
  type TemplateInputField,
  type UserMode
} from "@flowframe/core";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

type TabKey = "home" | "templates" | "tasks" | "me";
type Screen =
  | { type: "tab"; tab: TabKey }
  | { type: "template"; templateId: string }
  | { type: "run"; templateId: string }
  | { type: "task"; taskId: string };

const tabItems: Array<{ key: TabKey; label: string; icon: string }> = [
  { key: "home", label: "首页", icon: "H" },
  { key: "templates", label: "模板", icon: "T" },
  { key: "tasks", label: "任务", icon: "Q" },
  { key: "me", label: "我的", icon: "M" }
];

function StatusPill({ status }: { status: Task["status"] }) {
  const labelMap: Record<Task["status"], string> = {
    draft: "草稿",
    queued: "排队中",
    running: "生成中",
    completed: "已完成",
    failed: "失败",
    canceled: "已取消"
  };

  return (
    <View style={[styles.statusPill, status === "completed" ? styles.statusDone : styles.statusWork]}>
      <Text style={styles.statusText}>{labelMap[status]}</Text>
    </View>
  );
}

function TemplateTile({
  template,
  onPress
}: {
  template: Template;
  onPress: (template: Template) => void;
}) {
  return (
    <TouchableOpacity style={styles.templateTile} onPress={() => onPress(template)} activeOpacity={0.86}>
      <Image source={{ uri: template.coverImage }} style={styles.templateImage} />
      <View style={styles.tileBody}>
        <Text style={styles.tileTitle}>{template.name}</Text>
        <Text style={styles.tileText}>{template.shortDescription}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{template.estimatedSeconds}s</Text>
          <Text style={styles.metaText}>{template.creditCost} 点</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function TaskItem({ task, onPress }: { task: Task; onPress: (task: Task) => void }) {
  return (
    <TouchableOpacity style={styles.taskItem} onPress={() => onPress(task)} activeOpacity={0.86}>
      <View style={styles.taskHeader}>
        <Text style={styles.taskTitle}>{task.title}</Text>
        <StatusPill status={task.status} />
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${task.progress}%` }]} />
      </View>
      <Text style={styles.tileText}>{task.creditCost} 点 · {task.progress}%</Text>
    </TouchableOpacity>
  );
}

function FieldControl({
  field,
  value,
  onChange
}: {
  field: TemplateInputField;
  value: string | number | boolean | string[];
  onChange: (value: string | number | boolean | string[]) => void;
}) {
  if (field.type === "textarea" || field.type === "text") {
    return (
      <TextInput
        style={[styles.input, field.type === "textarea" ? styles.textArea : null]}
        value={String(value ?? "")}
        multiline={field.type === "textarea"}
        placeholder={field.placeholder}
        placeholderTextColor="#8a887f"
        onChangeText={onChange}
      />
    );
  }

  if (field.type === "image") {
    return (
      <View style={styles.uploadBox}>
        <Text style={styles.uploadTitle}>拍照 / 相册上传</Text>
        <Text style={styles.tileText}>MVP 骨架预留移动端图片选择能力</Text>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => onChange(["mobile-demo.jpg"])}>
          <Text style={styles.secondaryButtonText}>选择图片</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (field.type === "select") {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
        {field.options.map((option) => {
          const active = value === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              style={[styles.chip, active ? styles.chipActive : null]}
              onPress={() => onChange(option.value)}
            >
              <Text style={[styles.chipText, active ? styles.chipTextActive : null]}>{option.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  }

  if (field.type === "boolean") {
    return (
      <TouchableOpacity
        style={[styles.chip, value ? styles.chipActive : null]}
        onPress={() => onChange(!value)}
      >
        <Text style={[styles.chipText, value ? styles.chipTextActive : null]}>
          {value ? "已开启" : "未开启"}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TextInput
      style={styles.input}
      value={String(value ?? field.defaultValue ?? "")}
      keyboardType="numeric"
      onChangeText={(text) => onChange(Number(text))}
    />
  );
}

function HomeScreen({ setScreen }: { setScreen: (screen: Screen) => void }) {
  const featured = templates.slice(0, 4);
  const runningTask = sampleTasks.find((task) => task.status !== "completed");

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
      <View style={styles.hero}>
        <Image source={{ uri: featured[0].coverImage }} style={styles.heroImage} />
        <View style={styles.heroOverlay}>
          <Text style={styles.eyebrow}>移动端快速创作</Text>
          <Text style={styles.heroTitle}>选模板，上传素材，等通知。</Text>
          <Text style={styles.heroText}>Android 端优先服务拍照上传、快速提交和任务状态查看。</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setScreen({ type: "tab", tab: "templates" })}
          >
            <Text style={styles.primaryButtonText}>开始创作</Text>
          </TouchableOpacity>
        </View>
      </View>

      {runningTask ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>进行中任务</Text>
          <TaskItem task={runningTask} onPress={(task) => setScreen({ type: "task", taskId: task.id })} />
        </View>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>最近使用模板</Text>
        {featured.map((template) => (
          <TemplateTile
            key={template.id}
            template={template}
            onPress={(item) => setScreen({ type: "template", templateId: item.id })}
          />
        ))}
      </View>
    </ScrollView>
  );
}

function TemplatesScreen({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.eyebrow}>模板中心</Text>
      <Text style={styles.pageTitle}>用场景模板完成 AI 任务。</Text>
      {templates.map((template) => (
        <TemplateTile
          key={template.id}
          template={template}
          onPress={(item) => setScreen({ type: "template", templateId: item.id })}
        />
      ))}
    </ScrollView>
  );
}

function TemplateScreen({
  template,
  setScreen
}: {
  template: Template;
  setScreen: (screen: Screen) => void;
}) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
      <Image source={{ uri: template.coverImage }} style={styles.detailImage} />
      <Text style={styles.eyebrow}>模板详情</Text>
      <Text style={styles.pageTitle}>{template.name}</Text>
      <Text style={styles.bodyText}>{template.longDescription}</Text>
      <View style={styles.infoGrid}>
        <Text style={styles.infoCell}>{template.estimatedSeconds}s</Text>
        <Text style={styles.infoCell}>{template.creditCost} 点</Text>
        <Text style={styles.infoCell}>{template.difficulty === "starter" ? "新手" : "进阶"}</Text>
      </View>
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => setScreen({ type: "run", templateId: template.id })}
      >
        <Text style={styles.primaryButtonText}>使用模板</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function RunScreen({ template, setScreen }: { template: Template; setScreen: (screen: Screen) => void }) {
  const [mode, setMode] = useState<UserMode>("normal");
  const [inputs, setInputs] = useState<Record<string, string | number | boolean | string[]>>(() =>
    createInitialInputs(template, "normal")
  );
  const fields = useMemo(() => getFieldsForMode(template, mode), [mode, template]);

  function switchMode(nextMode: UserMode) {
    setMode(nextMode);
    setInputs((current) => ({ ...createInitialInputs(template, nextMode), ...current }));
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.eyebrow}>执行模板</Text>
      <Text style={styles.pageTitle}>{template.name}</Text>

      <View style={styles.segment}>
        <TouchableOpacity
          style={[styles.segmentItem, mode === "normal" ? styles.segmentActive : null]}
          onPress={() => switchMode("normal")}
        >
          <Text style={[styles.segmentText, mode === "normal" ? styles.segmentTextActive : null]}>普通</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segmentItem, mode === "advanced" ? styles.segmentActive : null]}
          onPress={() => switchMode("advanced")}
        >
          <Text style={[styles.segmentText, mode === "advanced" ? styles.segmentTextActive : null]}>高级</Text>
        </TouchableOpacity>
      </View>

      {fields.map((field) => (
        <View style={styles.formField} key={field.id}>
          <Text style={styles.fieldLabel}>{field.label}{field.required ? " *" : ""}</Text>
          {field.helper ? <Text style={styles.tileText}>{field.helper}</Text> : null}
          <FieldControl
            field={field}
            value={inputs[field.id]}
            onChange={(value) => setInputs((current) => ({ ...current, [field.id]: value }))}
          />
        </View>
      ))}

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => setScreen({ type: "tab", tab: "tasks" })}
      >
        <Text style={styles.primaryButtonText}>提交任务，消耗 {template.creditCost} 点</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function TasksScreen({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.eyebrow}>任务中心</Text>
      <Text style={styles.pageTitle}>查看任务状态和结果。</Text>
      {sampleTasks.map((task) => (
        <TaskItem key={task.id} task={task} onPress={(item) => setScreen({ type: "task", taskId: item.id })} />
      ))}
    </ScrollView>
  );
}

function TaskScreen({ task }: { task: Task }) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.eyebrow}>任务详情</Text>
      <Text style={styles.pageTitle}>{task.title}</Text>
      <StatusPill status={task.status} />
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${task.progress}%` }]} />
      </View>
      <Text style={styles.bodyText}>模式：{task.mode === "normal" ? "普通" : "高级"} · 消耗 {task.creditCost} 点</Text>
      {task.assets.map((asset) => (
        <Image source={{ uri: asset.url }} style={styles.resultImage} key={asset.id} />
      ))}
      {task.assets.length === 0 ? <Text style={styles.bodyText}>结果生成中，完成后可通过通知回到这里。</Text> : null}
    </ScrollView>
  );
}

function MeScreen() {
  const freePlan = creditPlans[0];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.eyebrow}>我的</Text>
      <Text style={styles.pageTitle}>账户、额度和设置。</Text>
      <View style={styles.accountPanel}>
        <Text style={styles.sectionTitle}>{freePlan.name}</Text>
        <Text style={styles.bodyText}>
          {freePlan.monthlyCredits} 点 / 月 · {freePlan.maxResolution} · 历史 {freePlan.historyDays} 天
        </Text>
      </View>
      <View style={styles.accountPanel}>
        <Text style={styles.sectionTitle}>移动端预留</Text>
        <Text style={styles.bodyText}>拍照上传、任务完成通知、系统分享和相册保存会在真实 APK 接入阶段补全。</Text>
      </View>
    </ScrollView>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>({ type: "tab", tab: "home" });
  const activeTab = screen.type === "tab" ? screen.tab : "templates";
  const template =
    screen.type === "template" || screen.type === "run"
      ? templates.find((item) => item.id === screen.templateId)
      : undefined;
  const task = screen.type === "task" ? sampleTasks.find((item) => item.id === screen.taskId) : undefined;

  let content = <HomeScreen setScreen={setScreen} />;

  if (screen.type === "tab" && screen.tab === "templates") {
    content = <TemplatesScreen setScreen={setScreen} />;
  } else if (screen.type === "tab" && screen.tab === "tasks") {
    content = <TasksScreen setScreen={setScreen} />;
  } else if (screen.type === "tab" && screen.tab === "me") {
    content = <MeScreen />;
  } else if (screen.type === "template" && template) {
    content = <TemplateScreen template={template} setScreen={setScreen} />;
  } else if (screen.type === "run" && template) {
    content = <RunScreen template={template} setScreen={setScreen} />;
  } else if (screen.type === "task" && task) {
    content = <TaskScreen task={task} />;
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        {screen.type !== "tab" ? (
          <TouchableOpacity style={styles.backButton} onPress={() => setScreen({ type: "tab", tab: activeTab })}>
            <Text style={styles.backText}>{"<"}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.logoMark}>
            <Text style={styles.logoText}>F</Text>
          </View>
        )}
        <Text style={styles.headerTitle}>FlowFrame V2</Text>
      </View>
      <View style={styles.content}>{content}</View>
      <View style={styles.tabbar}>
        {tabItems.map((item) => {
          const active = activeTab === item.key && screen.type === "tab";
          return (
            <TouchableOpacity
              key={item.key}
              style={styles.tabItem}
              onPress={() => setScreen({ type: "tab", tab: item.key })}
            >
              <Text style={[styles.tabIcon, active ? styles.tabActive : null]}>{item.icon}</Text>
              <Text style={[styles.tabLabel, active ? styles.tabActive : null]}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f6f4ef"
  },
  header: {
    minHeight: 58,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#dedbd1"
  },
  logoMark: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#171717",
    alignItems: "center",
    justifyContent: "center"
  },
  logoText: {
    color: "#fff",
    fontWeight: "900"
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  backText: {
    color: "#171717",
    fontWeight: "900"
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#171717"
  },
  content: {
    flex: 1
  },
  screen: {
    flex: 1
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
    gap: 14
  },
  hero: {
    height: 430,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#171717"
  },
  heroImage: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: "100%",
    height: "100%"
  },
  heroOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 22,
    backgroundColor: "rgba(23,23,23,0.48)"
  },
  eyebrow: {
    color: "#0f766e",
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 8
  },
  heroTitle: {
    color: "#fff",
    fontSize: 38,
    lineHeight: 42,
    fontWeight: "900",
    marginBottom: 10
  },
  heroText: {
    color: "rgba(255,255,255,0.86)",
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 18
  },
  pageTitle: {
    color: "#171717",
    fontSize: 32,
    lineHeight: 36,
    fontWeight: "900",
    marginBottom: 10
  },
  bodyText: {
    color: "#5f635f",
    fontSize: 15,
    lineHeight: 22
  },
  section: {
    gap: 12,
    marginTop: 12
  },
  sectionTitle: {
    color: "#171717",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 10
  },
  templateTile: {
    borderRadius: 8,
    backgroundColor: "#fff",
    overflow: "hidden",
    marginBottom: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#dedbd1"
  },
  templateImage: {
    height: 166,
    width: "100%"
  },
  tileBody: {
    padding: 14
  },
  tileTitle: {
    color: "#171717",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 6
  },
  tileText: {
    color: "#5f635f",
    fontSize: 13,
    lineHeight: 19
  },
  metaRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10
  },
  metaText: {
    color: "#295d8a",
    fontSize: 12,
    fontWeight: "800"
  },
  primaryButton: {
    minHeight: 48,
    borderRadius: 8,
    backgroundColor: "#0f766e",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    marginTop: 12
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 15
  },
  secondaryButton: {
    minHeight: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dedbd1",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    marginTop: 10
  },
  secondaryButtonText: {
    color: "#171717",
    fontWeight: "900"
  },
  taskItem: {
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#dedbd1",
    marginBottom: 12
  },
  taskHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 10
  },
  taskTitle: {
    flex: 1,
    color: "#171717",
    fontSize: 17,
    fontWeight: "900"
  },
  statusPill: {
    minHeight: 28,
    borderRadius: 8,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  statusDone: {
    backgroundColor: "#e3f0dd"
  },
  statusWork: {
    backgroundColor: "#e3eef4"
  },
  statusText: {
    color: "#254f73",
    fontSize: 12,
    fontWeight: "900"
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "#ece8de",
    overflow: "hidden",
    marginBottom: 8
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#295d8a",
    borderRadius: 999
  },
  detailImage: {
    width: "100%",
    height: 240,
    borderRadius: 8,
    marginBottom: 18
  },
  infoGrid: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16
  },
  infoCell: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    color: "#171717",
    textAlign: "center",
    fontWeight: "900"
  },
  segment: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#dedbd1",
    marginBottom: 14
  },
  segmentItem: {
    flex: 1,
    minHeight: 38,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center"
  },
  segmentActive: {
    backgroundColor: "#171717"
  },
  segmentText: {
    color: "#5f635f",
    fontWeight: "900"
  },
  segmentTextActive: {
    color: "#fff"
  },
  formField: {
    gap: 8,
    marginBottom: 16
  },
  fieldLabel: {
    color: "#171717",
    fontSize: 15,
    fontWeight: "900"
  },
  input: {
    minHeight: 46,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dedbd1",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    color: "#171717"
  },
  textArea: {
    minHeight: 118,
    paddingTop: 12,
    textAlignVertical: "top"
  },
  uploadBox: {
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#295d8a",
    backgroundColor: "#f8fbfc",
    padding: 14
  },
  uploadTitle: {
    color: "#171717",
    fontWeight: "900",
    marginBottom: 4
  },
  chipRow: {
    gap: 8,
    paddingRight: 12
  },
  chip: {
    minHeight: 38,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dedbd1",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12
  },
  chipActive: {
    backgroundColor: "#171717",
    borderColor: "#171717"
  },
  chipText: {
    color: "#5f635f",
    fontWeight: "800"
  },
  chipTextActive: {
    color: "#fff"
  },
  resultImage: {
    width: "100%",
    height: 320,
    borderRadius: 8,
    marginTop: 16
  },
  accountPanel: {
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#dedbd1"
  },
  tabbar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 72,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#dedbd1",
    paddingBottom: 8
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4
  },
  tabIcon: {
    color: "#5f635f",
    fontSize: 15,
    fontWeight: "900"
  },
  tabLabel: {
    color: "#5f635f",
    fontSize: 12,
    fontWeight: "800"
  },
  tabActive: {
    color: "#0f766e"
  }
});

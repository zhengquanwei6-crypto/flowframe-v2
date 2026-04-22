import Link from "next/link";
import { creditPlans, sampleTasks, templates } from "@flowframe/core";
import { TaskRow, TemplateCard } from "./_components/shared";

export default function HomePage() {
  const featuredTemplates = templates.slice(0, 4);
  const recentTasks = sampleTasks.slice(0, 3);
  const freePlan = creditPlans[0];

  return (
    <main className="page">
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">AI 工作流，不从节点开始</p>
          <h1>选择场景模板，填写需求，然后拿到结果。</h1>
          <p className="lead">
            FlowFrame V2 把复杂的 ComfyUI 执行能力包装成普通用户能直接使用的创作任务，同时为进阶用户保留高级模式和 provider 扩展。
          </p>
          <div className="hero-actions">
            <Link className="primary-button" href="/templates">
              <span aria-hidden="true">+</span>
              浏览模板
            </Link>
            <Link className="secondary-button" href="/tasks">
              <span aria-hidden="true">{">"}</span>
              查看任务
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <p className="eyebrow">现在可以做什么</p>
            <h2>高频创作模板</h2>
          </div>
          <Link className="secondary-button" href="/templates">
            全部模板
          </Link>
        </div>
        <div className="grid template-grid">
          {featuredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </section>

      <section className="section two-grid grid">
        <div>
          <div className="section-head">
            <div>
              <p className="eyebrow">任务闭环</p>
              <h2>最近任务</h2>
            </div>
          </div>
          <div className="grid">
            {recentTasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>
        </div>

        <div className="panel">
          <p className="eyebrow">免费试用</p>
          <h2>{freePlan.name}</h2>
          <p className="lead">
            每月 {freePlan.monthlyCredits} 点额度，最高 {freePlan.maxResolution}，保留 {freePlan.historyDays} 天历史。
          </p>
          <div className="badge-row">
            {freePlan.features.map((feature) => (
              <span className="badge" key={feature}>
                {feature}
              </span>
            ))}
          </div>
          <div className="row-actions">
            <Link className="primary-button" href="/templates/text-to-image-poster/run">
              <span aria-hidden="true">+</span>
              试跑一个模板
            </Link>
            <Link className="secondary-button" href="/me">
              账户设置
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

import { creditPlans, providers } from "@flowframe/core";

export default function MePage() {
  return (
    <main className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">我的</p>
          <h1>账户、额度、provider 与偏好设置。</h1>
          <p className="lead">
            MVP 先展示商业化和设置结构，后续接入真实登录、订阅、支付和团队协作。
          </p>
        </div>
      </div>

      <section className="grid two-grid">
        <div className="panel">
          <h2>当前账户</h2>
          <div className="settings-list">
            <div>
              <span>登录状态</span>
              <strong>演示用户</strong>
            </div>
            <div>
              <span>本月额度</span>
              <strong>20 点</strong>
            </div>
            <div>
              <span>默认模式</span>
              <strong>普通模式</strong>
            </div>
          </div>
        </div>

        <div className="panel">
          <h2>默认 provider</h2>
          <div className="settings-list">
            {providers.map((provider) => (
              <div key={provider.id}>
                <span>{provider.name}</span>
                <strong>{provider.status === "ready" ? "可用" : "预留"}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <p className="eyebrow">商业化预留</p>
            <h2>免费试用 + 点数 + Pro 订阅</h2>
          </div>
        </div>
        <div className="grid three-grid">
          {creditPlans.map((plan) => (
            <div className="plan-card" key={plan.key}>
              <h3>{plan.name}</h3>
              <p className="lead">{plan.monthlyCredits} 点 / 月</p>
              <div className="settings-list">
                <div>
                  <span>最高分辨率</span>
                  <strong>{plan.maxResolution}</strong>
                </div>
                <div>
                  <span>队列</span>
                  <strong>{plan.queue === "priority" ? "优先" : "标准"}</strong>
                </div>
                <div>
                  <span>历史保存</span>
                  <strong>{plan.historyDays} 天</strong>
                </div>
              </div>
              <div className="badge-row">
                {plan.features.map((feature) => (
                  <span className="badge" key={feature}>
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="page">
      <div className="panel">
        <p className="eyebrow">没有找到</p>
        <h1>这个页面或任务不存在</h1>
        <p className="lead">可以回到模板中心，重新选择一个场景模板开始演示。</p>
        <div className="row-actions">
          <Link className="primary-button" href="/templates">
            去模板中心
          </Link>
          <Link className="secondary-button" href="/">
            回首页
          </Link>
        </div>
      </div>
    </main>
  );
}

"use client";

export default function ErrorPage({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="page">
      <div className="panel">
        <p className="eyebrow">出错了</p>
        <h1>页面暂时无法加载</h1>
        <p className="lead">{error.message || "请稍后重试，或回到模板中心重新开始。"}</p>
        <div className="row-actions">
          <button className="primary-button" type="button" onClick={reset}>
            重试
          </button>
          <a className="secondary-button" href="/templates">
            去模板中心
          </a>
        </div>
      </div>
    </main>
  );
}

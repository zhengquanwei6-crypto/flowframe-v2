import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlowFrame V2",
  description: "面向普通用户和进阶用户的 AI 工作流产品"
};

const navItems = [
  { href: "/", label: "首页" },
  { href: "/templates", label: "模板" },
  { href: "/tasks", label: "任务" },
  { href: "/results", label: "结果" },
  { href: "/advanced", label: "高级" },
  { href: "/me", label: "我的" }
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="app-frame">
          <header className="topbar">
            <Link className="brand" href="/">
              <span className="brand-mark">F</span>
              <span>FlowFrame V2</span>
            </Link>
            <nav className="nav" aria-label="主导航">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <Link className="topbar-action" href="/templates">
              <span aria-hidden="true">+</span>
              <span>开始</span>
            </Link>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}

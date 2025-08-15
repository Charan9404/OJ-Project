import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { FaRegClock, FaSearch } from "react-icons/fa";
import {
  MdOutlineCheckCircle,
  MdOutlineErrorOutline,
  MdHistory,
} from "react-icons/md";
import { IoCodeSlash } from "react-icons/io5";

/**
 * Submissions Page (glassmorphic, dark, indigo‑purple tone)
 * - Fetches user submissions from /api/submissions/mine
 * - Filters: text search (problem/title), language, status
 * - Sort: newest → oldest
 * - Client-side pagination
 * - View drawer for code + verdict details (Monaco read-only)
 * - Graceful empty, loading, and error states
 */

const PAGE_SIZE = 10;

const statusStyles = {
  SUCCESS: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30",
  COMPILE_ERROR: "bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30",
  RUNTIME_ERROR: "bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/30",
  WRONG_ANSWER: "bg-fuchsia-500/15 text-fuchsia-300 ring-1 ring-fuchsia-500/30",
  TLE: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30",
  PENDING: "bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-500/30",
};

function StatusBadge({ value }) {
  const base =
    "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap " +
    (statusStyles[value] || statusStyles.PENDING);
  const Icon =
    value === "SUCCESS"
      ? MdOutlineCheckCircle
      : value === "PENDING"
      ? MdHistory
      : MdOutlineErrorOutline;
  return (
    <span className={base}>
      <Icon className="size-4" />
      {value.replace(/_/g, " ")}
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[...Array(7)].map((_, i) => (
        <td key={i} className="px-3 py-4">
          <div className="h-4 w-full max-w-[180px] rounded bg-white/10" />
        </td>
      ))}
    </tr>
  );
}

export default function Submissions() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const [lang, setLang] = useState("ALL");
  const [page, setPage] = useState(1);

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);

  // Fetch user submissions
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await axios.get("/api/submissions/mine", {
          // if you use cookies/session, ensure withCredentials at axios base level
        });
        if (!mounted) return;
        setData(Array.isArray(data) ? data : data?.submissions || []);
      } catch (e) {
        console.error(e);
        if (!mounted) return;
        setError(
          e?.response?.data?.error ||
            "Couldn't load submissions. Please try again."
        );
        // Optional: Fallback demo data to visualize UI
        setData((prev) => (prev.length ? prev : demoSubmissions));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  // Derived rows via filters + sort
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data
      .filter((s) => (status === "ALL" ? true : s.status === status))
      .filter((s) =>
        lang === "ALL" ? true : s.language?.toLowerCase() === lang.toLowerCase()
      )
      .filter((s) =>
        q
          ? (s.problem?.title || s.problemTitle || "")
              .toLowerCase()
              .includes(q) || String(s._id || s.id).includes(q)
          : true
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [data, query, status, lang]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const rows = filtered.slice(start, start + PAGE_SIZE);

  const languages = useMemo(() => {
    const set = new Set(
      data.map((d) => (d.language || "").toLowerCase()).filter(Boolean)
    );
    return ["ALL", ...Array.from(set)];
  }, [data]);

  function openDrawer(sub) {
    setActive(sub);
    setOpen(true);
  }

  function closeDrawer() {
    setOpen(false);
    setTimeout(() => setActive(null), 200);
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0b0b13] to-[#0a0614] text-slate-200">
      {/* Page container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              My Submissions
            </h1>
            <p className="text-sm text-slate-400">
              Track your attempts, verdicts, and performance.
            </p>
          </div>
          <Link
            to="/problems"
            className="rounded-2xl bg-indigo-500/20 ring-1 ring-indigo-400/30 px-4 py-2 text-sm font-medium text-indigo-200 hover:bg-indigo-500/30 backdrop-blur-md transition"
          >
            Browse Problems
          </Link>
        </div>

        {/* Controls */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="md:col-span-3">
            <div className="relative group">
              <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by title or ID"
                className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-white/5 ring-1 ring-white/10 focus:ring-indigo-400/50 outline-none backdrop-blur-md placeholder:text-slate-400"
              />
            </div>
          </div>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="rounded-2xl bg-white/5 ring-1 ring-white/10 px-3 py-2.5 backdrop-blur-md"
          >
            {[
              "ALL",
              "SUCCESS",
              "WRONG_ANSWER",
              "COMPILE_ERROR",
              "RUNTIME_ERROR",
              "TLE",
              "PENDING",
            ].map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, " ")}
              </option>
            ))}
          </select>
          <select
            value={lang}
            onChange={(e) => {
              setLang(e.target.value);
              setPage(1);
            }}
            className="rounded-2xl bg-white/5 ring-1 ring-white/10 px-3 py-2.5 backdrop-blur-md capitalize"
          >
            {languages.map((l) => (
              <option key={l} value={l} className="capitalize">
                {l}
              </option>
            ))}
          </select>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-indigo-900/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-white/5">
                <tr>
                  {[
                    "Submitted",
                    "Problem",
                    "Language",
                    "Status",
                    "Runtime",
                    "Memory",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-3.5 text-left font-semibold text-slate-300 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {loading ? (
                  [...Array(6)].map((_, i) => <SkeletonRow key={i} />)
                ) : rows.length ? (
                  rows.map((s) => (
                    <tr key={s._id || s.id} className="hover:bg-white/5">
                      <td className="px-3 py-4 whitespace-nowrap align-top">
                        <div className="flex items-center gap-2">
                          <FaRegClock className="opacity-70" />
                          <span>{new Date(s.createdAt).toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-3 py-4 align-top">
                        <div className="flex flex-col">
                          <Link
                            to={`/problems/${s.problem?.id || s.problemId}`}
                            className="text-indigo-300 hover:underline"
                          >
                            {s.problem?.title || s.problemTitle || "—"}
                          </Link>
                          <span className="text-xs text-slate-400">
                            #{s._id || s.id}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap align-top capitalize">
                        {s.language}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap align-top">
                        <StatusBadge value={s.status} />
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap align-top">
                        {s.metrics?.time ? `${s.metrics.time} ms` : "—"}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap align-top">
                        {s.metrics?.memory ? `${s.metrics.memory} MB` : "—"}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap align-top">
                        <button
                          onClick={() => openDrawer(s)}
                          className="rounded-xl px-3 py-1.5 text-xs font-medium bg-indigo-500/20 text-indigo-200 ring-1 ring-indigo-400/30 hover:bg-indigo-500/30 transition"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-3 py-10">
                      <EmptyState />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer: pagination + error */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between p-4">
            <div className="text-sm text-rose-300/80">
              {error && (
                <div className="rounded-xl bg-rose-500/10 ring-1 ring-rose-400/30 px-3 py-2">
                  {error}
                </div>
              )}
            </div>

            {filtered.length > PAGE_SIZE && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-xl ring-1 ring-white/10 disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="text-sm">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 rounded-xl ring-1 ring-white/10 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-[560px] transform transition-transform duration-200 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ zIndex: 60 }}
      >
        <div className="h-full backdrop-blur-xl bg-[#0a0614]/70 ring-1 ring-white/10 border-l border-white/10 shadow-2xl">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div>
              <div className="text-sm text-slate-400">Submission</div>
              <div className="font-semibold">#{active?._id || active?.id}</div>
            </div>
            <button
              onClick={closeDrawer}
              className="rounded-xl px-3 py-1.5 text-sm ring-1 ring-white/10 hover:bg-white/5"
            >
              Close
            </button>
          </div>

          {active ? (
            <div className="h-[calc(100%-64px)] overflow-y-auto p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Info
                  label="Problem"
                  value={active.problem?.title || active.problemTitle}
                  link={`/problems/${active.problem?.id || active.problemId}`}
                />
                <Info label="Language" value={active.language} />
                <Info
                  label="Status"
                  value={<StatusBadge value={active.status} />}
                />
                <Info
                  label="Submitted"
                  value={new Date(active.createdAt).toLocaleString()}
                />
                <Info
                  label="Runtime"
                  value={
                    active.metrics?.time ? `${active.metrics.time} ms` : "—"
                  }
                />
                <Info
                  label="Memory"
                  value={
                    active.metrics?.memory ? `${active.metrics.memory} MB` : "—"
                  }
                />
              </div>

              <section className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <IoCodeSlash /> Code
                </h3>
                <div className="overflow-hidden rounded-2xl ring-1 ring-white/10">
                  <Editor
                    height="360px"
                    theme="vs-dark"
                    defaultLanguage={active.language?.toLowerCase() || "python"}
                    value={active.code || ""}
                    options={{ readOnly: true, minimap: { enabled: false } }}
                  />
                </div>
              </section>

              {(active.stdout || active.stderr || active.compileError) && (
                <section className="grid md:grid-cols-2 gap-3">
                  {active.stdout && <Log title="Output" text={active.stdout} />}
                  {active.stderr && <Log title="Stderr" text={active.stderr} />}
                  {active.compileError && (
                    <Log title="Compile Error" text={active.compileError} />
                  )}
                </section>
              )}
            </div>
          ) : (
            <div className="h-[calc(100%-64px)] p-4 text-slate-400 text-sm">
              Loading…
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Info({ label, value, link }) {
  return (
    <div className="space-y-1">
      <div className="text-xs text-slate-400">{label}</div>
      {link ? (
        <Link to={link} className="text-indigo-300 hover:underline break-all">
          {value || "—"}
        </Link>
      ) : typeof value === "string" ? (
        <div className="text-slate-200 break-all">{value || "—"}</div>
      ) : (
        value || <div className="text-slate-200">—</div>
      )}
    </div>
  );
}

function Log({ title, text }) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-slate-300">{title}</h4>
      <pre className="rounded-2xl bg-black/40 ring-1 ring-white/10 p-3 text-xs whitespace-pre-wrap text-slate-300 overflow-auto max-h-56">
        {text}
      </pre>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10">
      <div className="size-14 rounded-2xl bg-indigo-500/15 ring-1 ring-indigo-400/30 flex items-center justify-center mb-3">
        <IoCodeSlash className="size-6 text-indigo-300" />
      </div>
      <h3 className="font-semibold">No submissions yet</h3>
      <p className="text-slate-400 text-sm max-w-sm">
        Solve a problem and your attempts will appear here with verdicts and
        performance stats.
      </p>
      <Link
        to="/problems"
        className="mt-4 rounded-2xl bg-indigo-500/20 ring-1 ring-indigo-400/30 px-4 py-2 text-sm font-medium text-indigo-200 hover:bg-indigo-500/30 backdrop-blur-md transition"
      >
        Go to Problems
      </Link>
    </div>
  );
}

// ---- Demo data (used only if API fails and there is no data) ----
const demoSubmissions = [
  {
    _id: "demo-001",
    problemId: "two-sum",
    problemTitle: "Two Sum",
    language: "python",
    status: "SUCCESS",
    metrics: { time: 32, memory: 21 },
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    code:
      "" +
      "def twoSum(nums, target):\n" +
      "    mp = {}\n" +
      "    for i, x in enumerate(nums):\n" +
      "        if target - x in mp: return [mp[target-x], i]\n" +
      "        mp[x] = i\n",
    stdout: "[0, 1]",
  },
  {
    _id: "demo-002",
    problemId: "valid-parentheses",
    problemTitle: "Valid Parentheses",
    language: "cpp",
    status: "WRONG_ANSWER",
    metrics: { time: 0, memory: 0 },
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    code: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){cout<<"hi";}\n',
    stderr: "Wrong answer on case 3",
  },
  {
    _id: "demo-003",
    problemId: "reverse-string",
    problemTitle: "Reverse String",
    language: "java",
    status: "COMPILE_ERROR",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    code: 'class Main { public static void main(String[] a){ System.out.println("ok"); }}',
    compileError:
      "Main.java:1: error: class Main is public, should be declared in a file named Main.java",
  },
];

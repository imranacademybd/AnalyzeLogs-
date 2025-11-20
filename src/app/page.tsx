"use client";

import { useRef, useState } from "react";

interface TopUrl {
  pageType: string;
  url: string;
  hits: number;
}

export default function GooglebotAnalyzerLayout() {
  const [summary, setSummary] = useState({
    totalLines: 0,
    uniqueUrls: 0,
    status2xx: 0,
    status3xx: 0,
    status4xx: 0,
    status5xx: 0,
    usefulCrawlPct: '0',
    wastedCrawlPct: '0',
    depth3Pct: 0,
    sitemapCrawled: 0,
    orphanPct: 0,
    paramCrawlPct: 0,
    mobile: 0,
    desktop: 0,
    fromDate: '',
    lastDate: ''
  });
  const [topUrls, setTopUrls] = useState<TopUrl[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractData = (line: string) => {
    const parts = line.split(',');
    if(parts.length < 4) return null;
    return {
      date: parts[0].trim(),
      status: parseInt(parts[1].trim()) || 0,
      url: parts[2].trim(),
      bot: parts[3].trim(),
    };
  };

  const analyzeText = (text: string) => {
    const lines = String(text || '').split('\n');
    // use a fresh summary object (don't reuse stale state directly)
    let newSummary = {
      totalLines: 0,
      uniqueUrls: 0,
      status2xx: 0,
      status3xx: 0,
      status4xx: 0,
      status5xx: 0,
      usefulCrawlPct: '0',
      wastedCrawlPct: '0',
      depth3Pct: 0,
      sitemapCrawled: 0,
      orphanPct: 0,
      paramCrawlPct: 0,
      mobile: 0,
      desktop: 0,
      fromDate: '',
      lastDate: ''
    };

    let urlHits: Record<string, number> = {};

    lines.forEach(line => {
      const data = extractData(line);
      if(!data) return;
      newSummary.totalLines++;

      if(data.status >=200 && data.status<300) newSummary.status2xx++;
      else if(data.status >=300 && data.status<400) newSummary.status3xx++;
      else if(data.status >=400 && data.status<500) newSummary.status4xx++;
      else if(data.status >=500) newSummary.status5xx++;

      if(data.bot && data.bot.toLowerCase().includes('mobile')) newSummary.mobile++;
      else if (data.bot) newSummary.desktop++;

      // date range
      if(data.date){
        if(!newSummary.fromDate || data.date < newSummary.fromDate) newSummary.fromDate = data.date;
        if(!newSummary.lastDate || data.date > newSummary.lastDate) newSummary.lastDate = data.date;
      }

      urlHits[data.url] = (urlHits[data.url] || 0) + 1;
    });

    newSummary.uniqueUrls = Object.keys(urlHits).length;
    if(newSummary.totalLines>0){
      newSummary.usefulCrawlPct = ((newSummary.status2xx / newSummary.totalLines) * 100).toFixed(2);
      newSummary.wastedCrawlPct = (((newSummary.status4xx + newSummary.status5xx + newSummary.status3xx)/newSummary.totalLines)*100).toFixed(2);
    }

    const topUrlsArr = Object.entries(urlHits).map(([url,hits]) => ({ pageType: 'Page', url, hits }));
    topUrlsArr.sort((a,b)=>b.hits-a.hits);

    setSummary(newSummary);
    setTopUrls(topUrlsArr);
  };

  const handleFiles = (files: FileList | null) => {
    if(!files || files.length===0) return;
    for(let i=0;i<files.length;i++){
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          analyzeText(e.target.result as string);
        }
      };
      reader.onerror = () => console.error('File read error');
      reader.readAsText(files[i]);
    }
  };

  const downloadCSV = () => {
    if (!topUrls || topUrls.length === 0) return;
    const header = ['Page Type','Total URLs in Sitemap','URLs Crawled','Total Crawl Hits','Average Hits per Page','URL','Crawl Hits','Waste Pattern'].join(',') + '\n';
    const rows = topUrls.map(u => `${u.pageType},${summary.uniqueUrls},${topUrls.length},${u.hits},${(u.hits/topUrls.length).toFixed(2)},"${u.url}",${u.hits},${summary.wastedCrawlPct}%`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'crawl_report.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-6 shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          <h1 className="text-xl sm:text-2xl font-bold text-center sm:text-left">Googlebot Analyzer</h1>
          <nav className="flex flex-wrap justify-center gap-2 sm:gap-4">
            <a href="#home" className="hover:underline text-sm sm:text-base px-2 py-1">Home</a>
            <a href="#features" className="hover:underline text-sm sm:text-base px-2 py-1">Features</a>
            <a href="#metrics" className="hover:underline text-sm sm:text-base px-2 py-1">Metrics</a>
            <a href="#content" className="hover:underline text-sm sm:text-base px-2 py-1">Content</a>
            <a href="#contact" className="hover:underline text-sm sm:text-base px-2 py-1">Contact</a>
          </nav>
        </div>
      </header>

      {/* Home/Hero Section */}
      <section id="home" className="bg-gray-50 flex flex-col items-center justify-center text-center p-6 sm:p-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Analyze Your Googlebot Logs Instantly</h2>
        <p className="text-gray-700 mb-6 max-w-xl text-sm sm:text-base px-4">Upload your log files and get detailed crawl metrics, top URLs, CSV export, and more.</p>
        <button onClick={() => fileInputRef.current?.click()} className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition mb-4 text-sm sm:text-base">Upload & Analyze Now</button>
        <input ref={fileInputRef} type="file" multiple className="hidden" onChange={e=>handleFiles(e.target.files)} />
      </section>

      {/* Metrics Section */}
      <section id="metrics" className="p-4 sm:p-6 md:p-12 bg-white flex flex-col gap-6">
        <h3 className="text-2xl sm:text-3xl font-bold text-center mb-6">Crawl Metrics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-green-100 rounded-xl shadow-md text-center">Total Lines<br/><span className="text-2xl font-bold text-green-800">{summary.totalLines}</span></div>
          <div className="p-4 bg-blue-100 rounded-xl shadow-md text-center">Total Unique URLs<br/><span className="text-2xl font-bold text-blue-800">{summary.uniqueUrls}</span></div>
          <div className="p-4 bg-purple-100 rounded-xl shadow-md text-center">2xx Count<br/><span className="text-2xl font-bold text-purple-800">{summary.status2xx}</span></div>
          <div className="p-4 bg-yellow-100 rounded-xl shadow-md text-center">3xx Count<br/><span className="text-2xl font-bold text-yellow-800">{summary.status3xx}</span></div>
          <div className="p-4 bg-red-100 rounded-xl shadow-md text-center">4xx Count<br/><span className="text-2xl font-bold text-red-800">{summary.status4xx}</span></div>
          <div className="p-4 bg-gray-200 rounded-xl shadow-md text-center">5xx Count<br/><span className="text-2xl font-bold text-gray-800">{summary.status5xx}</span></div>
          <div className="p-4 bg-teal-100 rounded-xl shadow-md text-center">% Useful Crawl<br/><span className="text-2xl font-bold text-teal-800">{summary.usefulCrawlPct}%</span></div>
          <div className="p-4 bg-orange-100 rounded-xl shadow-md text-center">% Wasted Crawl<br/><span className="text-2xl font-bold text-orange-800">{summary.wastedCrawlPct}%</span></div>
          <div className="p-4 bg-indigo-100 rounded-xl shadow-md text-center">% URLs ≤ Depth 3<br/><span className="text-2xl font-bold text-indigo-800">{summary.depth3Pct}%</span></div>
          <div className="p-4 bg-cyan-100 rounded-xl shadow-md text-center">Sitemap URLs Crawled<br/><span className="text-2xl font-bold text-cyan-800">{summary.sitemapCrawled}</span></div>
          <div className="p-4 bg-lime-100 rounded-xl shadow-md text-center">Orphan URLs %<br/><span className="text-2xl font-bold text-lime-800">{summary.orphanPct}%</span></div>
          <div className="p-4 bg-pink-100 rounded-xl shadow-md text-center">Param Crawl %<br/><span className="text-2xl font-bold text-pink-800">{summary.paramCrawlPct}%</span></div>
          <div className="p-4 bg-indigo-50 rounded-xl shadow-md text-center">Mobile Visits<br/><span className="text-2xl font-bold text-indigo-800">{summary.mobile}</span></div>
          <div className="p-4 bg-indigo-50 rounded-xl shadow-md text-center">Desktop Visits<br/><span className="text-2xl font-bold text-indigo-800">{summary.desktop}</span></div>
        </div>
        <div className="mt-6 flex justify-center">
          <button onClick={downloadCSV} className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition text-sm sm:text-base">Download CSV / Export Excel</button>
        </div>
      </section>

      {/* Additional Content & Documentation Section */}
      <section className="additional-content py-16 px-6 md:px-12 bg-gradient-to-b from-gray-50 to-white border-t border-gray-200" id="content">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-6 tracking-tight">
            📘 Content & Documentation
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12 text-lg">
            All essential resources, explanations, and technical documentation for understanding your Log Analyzer Tool.
          </p>

          {/* Documentation Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Block 1 */}
            <div className="p-6 bg-white shadow-md rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">📄 Tool Overview</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                A complete breakdown of how the log analyzer collects, processes, and visualizes crawl data with high accuracy.
              </p>
            </div>

            {/* Block 2 */}
            <div className="p-6 bg-white shadow-md rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">⚙️ How Metrics Work</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Explanation of all metrics including Page Type, Sitemap URLs, Crawl Hits, Avg Hits, Orphan Pages, Waste Patterns.
              </p>
            </div>

            {/* Block 3 */}
            <div className="p-6 bg-white shadow-md rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">📊 Using Charts & Filters</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Learn how to use date-range filters, bot comparison charts, and export tools for deep technical insights.
              </p>
            </div>

            {/* Block 4 */}
            <div className="p-6 bg-white shadow-md rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">🔍 Troubleshooting Guide</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Fix common issues: missing logs, invalid formats, bot detection errors, incorrect timestamps, and more.
              </p>
            </div>

            {/* Block 5 */}
            <div className="p-6 bg-white shadow-md rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">📥 Data Import Rules</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Supported formats, file-size limits, merge rules, and uploading best practices for accurate reports.
              </p>
            </div>

            {/* Block 6 */}
            <div className="p-6 bg-white shadow-md rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">🧩 API & Developer Notes</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Coming soon: API endpoints, webhooks, and integration guides for advanced users and SEOs.
              </p>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-12 text-gray-500 text-sm">
            💡 More detailed documentation sections can be added anytime.
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 sm:p-6 mt-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          <p className="text-center sm:text-left text-sm sm:text-base">
            © 2025&nbsp;
            <a 
              href="https://imranseo.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:underline"
            >
              imranseo
            </a>
            . All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            <a href="#home" className="hover:underline text-sm sm:text-base px-2 py-1">Home</a>
            <a href="#features" className="hover:underline text-sm sm:text-base px-2 py-1">Features</a>
            <a href="#metrics" className="hover:underline text-sm sm:text-base px-2 py-1">Metrics</a>
            <a href="#content" className="hover:underline text-sm sm:text-base px-2 py-1">Content</a>
            <a href="#contact" className="hover:underline text-sm sm:text-base px-2 py-1">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

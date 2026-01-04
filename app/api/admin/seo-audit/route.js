import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';

// SEO Audit API - Technical SEO, Content Coverage, Core Web Vitals
// Admin only - part of System Reports & Audits Center

const SEVERITY_WEIGHTS = {
  critical: 3,
  warning: 2,
  info: 1,
};

// Helper: Calculate SEO score from issues
function calculateSeoScore(issues) {
  if (!issues || issues.length === 0) return 100;
  
  const totalWeight = issues.reduce((sum, issue) => {
    return sum + (SEVERITY_WEIGHTS[issue.severity] || 1);
  }, 0);
  
  // Max deduction is 100 points
  const deduction = Math.min(totalWeight * 5, 100);
  return Math.max(0, 100 - deduction);
}

// ============================================
// REPORT 1: Technical SEO Audit
// ============================================
async function runTechnicalSeoAudit(db) {
  const issues = [];
  const pages = [];
  
  // Get all products (as pages)
  const products = await db.collection('products').find({ active: true }).toArray();
  
  // Get site settings for meta defaults
  const settings = await db.collection('settings').findOne({});
  
  for (const product of products) {
    const pageUrl = `/products/${product._id}`;
    const pageIssues = [];
    
    // Check Title Tag
    if (!product.name || product.name.length < 10) {
      pageIssues.push({
        page_url: pageUrl,
        error_type: 'missing',
        issue: 'Title tag too short or missing',
        severity: 'critical',
        field: 'title',
        current_value: product.name || '',
        recommended_fix: 'Add descriptive title with 50-60 characters including primary keyword',
      });
    } else if (product.name.length > 60) {
      pageIssues.push({
        page_url: pageUrl,
        error_type: 'invalid',
        issue: 'Title tag too long (>60 chars)',
        severity: 'warning',
        field: 'title',
        current_value: product.name,
        recommended_fix: 'Shorten title to 50-60 characters while keeping primary keyword',
      });
    }
    
    // Check Meta Description
    if (!product.description || product.description.length < 50) {
      pageIssues.push({
        page_url: pageUrl,
        error_type: 'missing',
        issue: 'Meta description missing or too short',
        severity: 'critical',
        field: 'meta_description',
        current_value: product.description?.substring(0, 100) || '',
        recommended_fix: 'Add compelling meta description with 150-160 characters including call-to-action',
      });
    } else if (product.description.length > 160) {
      pageIssues.push({
        page_url: pageUrl,
        error_type: 'invalid',
        issue: 'Meta description too long (>160 chars)',
        severity: 'warning',
        field: 'meta_description',
        current_value: product.description.substring(0, 200) + '...',
        recommended_fix: 'Shorten description to 150-160 characters',
      });
    }
    
    // Check Images Alt Tags
    if (product.images && product.images.length > 0) {
      const imagesWithoutAlt = product.images.filter(img => !img.alt && typeof img === 'string');
      if (imagesWithoutAlt.length > 0) {
        pageIssues.push({
          page_url: pageUrl,
          error_type: 'missing',
          issue: `${imagesWithoutAlt.length} images missing alt text`,
          severity: 'warning',
          field: 'image_alt',
          current_value: `${imagesWithoutAlt.length} images`,
          recommended_fix: 'Add descriptive alt text to all images for accessibility and SEO',
        });
      }
    }
    
    // Check URL Structure
    if (product.slug) {
      if (product.slug.length > 75) {
        pageIssues.push({
          page_url: pageUrl,
          error_type: 'invalid',
          issue: 'URL slug too long',
          severity: 'warning',
          field: 'url_structure',
          current_value: product.slug,
          recommended_fix: 'Shorten URL slug to 3-5 words, use hyphens, remove stop words',
        });
      }
      if (/[A-Z]/.test(product.slug)) {
        pageIssues.push({
          page_url: pageUrl,
          error_type: 'invalid',
          issue: 'URL contains uppercase letters',
          severity: 'warning',
          field: 'url_structure',
          current_value: product.slug,
          recommended_fix: 'Use lowercase letters only in URLs',
        });
      }
    }
    
    // Check for Canonical
    if (!product.canonicalUrl && !product.slug) {
      pageIssues.push({
        page_url: pageUrl,
        error_type: 'missing',
        issue: 'No canonical URL defined',
        severity: 'warning',
        field: 'canonical',
        current_value: '',
        recommended_fix: 'Set canonical URL to prevent duplicate content issues',
      });
    }
    
    // Check Price (structured data)
    if (!product.price || product.price <= 0) {
      pageIssues.push({
        page_url: pageUrl,
        error_type: 'missing',
        issue: 'Product price missing (affects rich snippets)',
        severity: 'warning',
        field: 'structured_data',
        current_value: product.price || 'N/A',
        recommended_fix: 'Add valid price for Product structured data markup',
      });
    }
    
    issues.push(...pageIssues);
    pages.push({
      url: pageUrl,
      title: product.name,
      issues_count: pageIssues.length,
      critical_count: pageIssues.filter(i => i.severity === 'critical').length,
      warning_count: pageIssues.filter(i => i.severity === 'warning').length,
    });
  }
  
  // Check site-wide issues
  
  // Robots.txt check
  const robotsIssues = [];
  if (!settings?.seo?.robotsTxt) {
    robotsIssues.push({
      page_url: '/robots.txt',
      error_type: 'missing',
      issue: 'robots.txt not configured',
      severity: 'critical',
      field: 'robots_txt',
      current_value: 'Not found',
      recommended_fix: 'Create robots.txt with proper directives for search engines',
    });
  }
  
  // Sitemap check
  if (!settings?.seo?.sitemapEnabled) {
    robotsIssues.push({
      page_url: '/sitemap.xml',
      error_type: 'missing',
      issue: 'XML Sitemap not configured',
      severity: 'critical',
      field: 'sitemap',
      current_value: 'Not found',
      recommended_fix: 'Generate and submit XML sitemap to search engines',
    });
  }
  
  issues.push(...robotsIssues);
  
  // Calculate statistics
  const criticalCount = issues.filter(i => i.severity === 'critical').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;
  const score = calculateSeoScore(issues);
  
  return {
    reportType: 'technical_seo',
    title: 'Technical SEO Audit Report',
    timestamp: new Date(),
    score,
    status: score >= 80 ? 'PASS' : score >= 50 ? 'WARN' : 'FAIL',
    summary: {
      total_pages_scanned: products.length,
      total_issues: issues.length,
      critical_issues: criticalCount,
      warning_issues: warningCount,
      pages_with_issues: pages.filter(p => p.issues_count > 0).length,
    },
    issues,
    pages,
    recommendations: [
      criticalCount > 0 ? 'Fix all critical issues immediately - they block organic ranking' : null,
      warningCount > 5 ? 'Address warning issues to improve search visibility' : null,
      !settings?.seo?.robotsTxt ? 'Create robots.txt file' : null,
      !settings?.seo?.sitemapEnabled ? 'Enable XML sitemap generation' : null,
    ].filter(Boolean),
  };
}

// ============================================
// REPORT 2: SEO Content & Coverage
// ============================================
async function runContentCoverageAudit(db) {
  const issues = [];
  const pages = [];
  
  const products = await db.collection('products').find({ active: true }).toArray();
  const categories = await db.collection('categories').find({}).toArray();
  
  // Build internal links map
  const internalLinks = {};
  products.forEach(p => {
    internalLinks[`/products/${p._id}`] = {
      inbound: 0,
      outbound: 0,
    };
  });
  
  // Count internal links (simplified - checking category references)
  products.forEach(p => {
    if (p.category) {
      const categoryProducts = products.filter(prod => prod.category === p.category && prod._id !== p._id);
      internalLinks[`/products/${p._id}`].outbound = categoryProducts.length;
      categoryProducts.forEach(cp => {
        if (internalLinks[`/products/${cp._id}`]) {
          internalLinks[`/products/${cp._id}`].inbound++;
        }
      });
    }
  });
  
  for (const product of products) {
    const pageUrl = `/products/${product._id}`;
    const pageIssues = [];
    const wordCount = (product.description || '').split(/\s+/).filter(w => w.length > 0).length;
    const links = internalLinks[pageUrl] || { inbound: 0, outbound: 0 };
    
    // Thin Content Check
    if (wordCount < 100) {
      pageIssues.push({
        page_url: pageUrl,
        issue_type: 'thin',
        issue: 'Thin content - insufficient word count',
        word_count: wordCount,
        internal_links_count: links.inbound,
        severity: 'critical',
        recommended_action: 'Expand content to at least 300 words with relevant information, features, benefits',
      });
    } else if (wordCount < 300) {
      pageIssues.push({
        page_url: pageUrl,
        issue_type: 'thin',
        issue: 'Content below recommended length',
        word_count: wordCount,
        internal_links_count: links.inbound,
        severity: 'warning',
        recommended_action: 'Consider expanding content to 500+ words for better ranking potential',
      });
    }
    
    // Orphan Page Check (no internal links pointing to it)
    if (links.inbound === 0) {
      pageIssues.push({
        page_url: pageUrl,
        issue_type: 'orphan',
        issue: 'Orphan page - no internal links pointing to this page',
        word_count: wordCount,
        internal_links_count: 0,
        severity: 'warning',
        recommended_action: 'Add internal links from related pages, category pages, or blog posts',
      });
    }
    
    // No Keywords Check (simplified - checking if description lacks product name)
    if (product.description && product.name) {
      const nameWords = product.name.toLowerCase().split(/\s+/);
      const descLower = product.description.toLowerCase();
      const keywordPresent = nameWords.some(word => word.length > 3 && descLower.includes(word));
      
      if (!keywordPresent) {
        pageIssues.push({
          page_url: pageUrl,
          issue_type: 'mismatch',
          issue: 'Primary keyword not found in content',
          word_count: wordCount,
          internal_links_count: links.inbound,
          severity: 'warning',
          recommended_action: 'Include primary keyword naturally in description, features, and headings',
        });
      }
    }
    
    // Check for duplicate content (same description)
    const duplicates = products.filter(p => 
      p._id.toString() !== product._id.toString() && 
      p.description && 
      product.description &&
      p.description.substring(0, 100) === product.description.substring(0, 100)
    );
    
    if (duplicates.length > 0) {
      pageIssues.push({
        page_url: pageUrl,
        issue_type: 'duplicate',
        issue: `Duplicate content found with ${duplicates.length} other page(s)`,
        word_count: wordCount,
        internal_links_count: links.inbound,
        severity: 'critical',
        recommended_action: 'Rewrite content to be unique, or use canonical tags if intentional',
        duplicate_pages: duplicates.map(d => `/products/${d._id}`),
      });
    }
    
    issues.push(...pageIssues);
    pages.push({
      url: pageUrl,
      title: product.name,
      word_count: wordCount,
      internal_links: links,
      issues_count: pageIssues.length,
      issue_types: [...new Set(pageIssues.map(i => i.issue_type))],
    });
  }
  
  // Category coverage check
  const uncoveredCategories = categories.filter(cat => {
    const categoryProducts = products.filter(p => p.category === cat.name || p.category === cat._id?.toString());
    return categoryProducts.length === 0;
  });
  
  uncoveredCategories.forEach(cat => {
    issues.push({
      page_url: `/category/${cat.slug || cat._id}`,
      issue_type: 'orphan',
      issue: 'Category with no products',
      word_count: 0,
      internal_links_count: 0,
      severity: 'warning',
      recommended_action: 'Add products to category or remove empty category',
    });
  });
  
  const criticalCount = issues.filter(i => i.severity === 'critical').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;
  const score = calculateSeoScore(issues);
  
  return {
    reportType: 'content_coverage',
    title: 'SEO Content & Coverage Report',
    timestamp: new Date(),
    score,
    status: score >= 80 ? 'PASS' : score >= 50 ? 'WARN' : 'FAIL',
    summary: {
      total_pages_scanned: products.length,
      total_issues: issues.length,
      critical_issues: criticalCount,
      warning_issues: warningCount,
      thin_content_pages: issues.filter(i => i.issue_type === 'thin').length,
      orphan_pages: issues.filter(i => i.issue_type === 'orphan').length,
      duplicate_content_pages: issues.filter(i => i.issue_type === 'duplicate').length,
      avg_word_count: Math.round(pages.reduce((sum, p) => sum + p.word_count, 0) / pages.length) || 0,
    },
    issues,
    pages,
    recommendations: [
      criticalCount > 0 ? 'Address duplicate content issues immediately' : null,
      issues.filter(i => i.issue_type === 'thin').length > 0 ? 'Expand thin content pages to at least 300 words' : null,
      issues.filter(i => i.issue_type === 'orphan').length > 0 ? 'Build internal links to orphan pages' : null,
    ].filter(Boolean),
  };
}

// ============================================
// REPORT 3: Core Web Vitals & Crawlability
// ============================================
async function runWebVitalsAudit(db) {
  const issues = [];
  const pages = [];
  
  const products = await db.collection('products').find({ active: true }).toArray();
  
  // Google thresholds
  const THRESHOLDS = {
    LCP: { good: 2500, poor: 4000 }, // ms
    CLS: { good: 0.1, poor: 0.25 },
    INP: { good: 200, poor: 500 }, // ms
  };
  
  for (const product of products) {
    const pageUrl = `/products/${product._id}`;
    const pageIssues = [];
    
    // Simulate metrics based on page content (in real implementation, use Lighthouse or CrUX API)
    const hasLargeImages = product.images && product.images.length > 3;
    const hasVideo = !!product.videoUrl;
    const descriptionLength = (product.description || '').length;
    
    // Estimated LCP based on content
    const estimatedLCP = 1500 + (hasLargeImages ? 1500 : 0) + (hasVideo ? 2000 : 0);
    const lcpStatus = estimatedLCP <= THRESHOLDS.LCP.good ? 'pass' : estimatedLCP <= THRESHOLDS.LCP.poor ? 'warn' : 'fail';
    
    if (lcpStatus !== 'pass') {
      pageIssues.push({
        page_url: pageUrl,
        metric_name: 'LCP',
        measured_value: estimatedLCP,
        google_threshold: `Good: <${THRESHOLDS.LCP.good}ms`,
        status: lcpStatus,
        severity: lcpStatus === 'fail' ? 'critical' : 'warning',
        technical_fix_hint: hasVideo 
          ? 'Lazy-load video content, use video poster image'
          : hasLargeImages 
            ? 'Optimize images: use WebP format, implement lazy loading, add width/height attributes'
            : 'Optimize server response time, use CDN for static assets',
      });
    }
    
    // Estimated CLS based on images without dimensions
    const imagesWithoutDimensions = (product.images || []).filter(img => typeof img === 'string').length;
    const estimatedCLS = imagesWithoutDimensions * 0.05;
    const clsStatus = estimatedCLS <= THRESHOLDS.CLS.good ? 'pass' : estimatedCLS <= THRESHOLDS.CLS.poor ? 'warn' : 'fail';
    
    if (clsStatus !== 'pass') {
      pageIssues.push({
        page_url: pageUrl,
        metric_name: 'CLS',
        measured_value: estimatedCLS.toFixed(3),
        google_threshold: `Good: <${THRESHOLDS.CLS.good}`,
        status: clsStatus,
        severity: clsStatus === 'fail' ? 'critical' : 'warning',
        technical_fix_hint: 'Add explicit width and height to images and embeds, reserve space for dynamic content',
      });
    }
    
    // Crawl depth estimation (simplified - all products are at depth 2: home > category > product)
    const crawlDepth = 2;
    if (crawlDepth > 3) {
      pageIssues.push({
        page_url: pageUrl,
        metric_name: 'crawl_depth',
        measured_value: crawlDepth,
        google_threshold: 'Recommended: ≤3 clicks from homepage',
        status: 'fail',
        severity: 'warning',
        technical_fix_hint: 'Improve site architecture, add links from higher-level pages',
      });
    }
    
    // Check for broken links (image URLs)
    const brokenImages = (product.images || []).filter(img => {
      const url = typeof img === 'string' ? img : img?.url;
      return url && (url.includes('placeholder') || url.includes('undefined'));
    });
    
    if (brokenImages.length > 0) {
      pageIssues.push({
        page_url: pageUrl,
        metric_name: 'broken_resources',
        measured_value: `${brokenImages.length} broken images`,
        google_threshold: '0 broken resources',
        status: 'fail',
        severity: 'warning',
        technical_fix_hint: 'Replace broken image URLs with valid images or remove them',
      });
    }
    
    issues.push(...pageIssues);
    pages.push({
      url: pageUrl,
      title: product.name,
      metrics: {
        lcp: { value: estimatedLCP, status: lcpStatus },
        cls: { value: estimatedCLS, status: clsStatus },
        crawl_depth: crawlDepth,
      },
      issues_count: pageIssues.length,
    });
  }
  
  // Mobile usability check (site-wide)
  const settings = await db.collection('settings').findOne({});
  if (!settings?.mobile?.responsive) {
    issues.push({
      page_url: '/',
      metric_name: 'mobile_usability',
      measured_value: 'Not configured',
      google_threshold: 'Mobile-friendly required',
      status: 'fail',
      severity: 'critical',
      technical_fix_hint: 'Ensure responsive design, viewport meta tag, and touch-friendly elements',
    });
  }
  
  const criticalCount = issues.filter(i => i.severity === 'critical').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;
  const score = calculateSeoScore(issues);
  
  // Calculate pass rates for each metric
  const lcpPassRate = Math.round((pages.filter(p => p.metrics.lcp.status === 'pass').length / pages.length) * 100) || 0;
  const clsPassRate = Math.round((pages.filter(p => p.metrics.cls.status === 'pass').length / pages.length) * 100) || 0;
  
  return {
    reportType: 'web_vitals',
    title: 'Core Web Vitals & Crawlability Report',
    timestamp: new Date(),
    score,
    status: score >= 80 ? 'PASS' : score >= 50 ? 'WARN' : 'FAIL',
    summary: {
      total_pages_scanned: products.length,
      total_issues: issues.length,
      critical_issues: criticalCount,
      warning_issues: warningCount,
      lcp_pass_rate: lcpPassRate,
      cls_pass_rate: clsPassRate,
      pages_need_attention: pages.filter(p => p.issues_count > 0).length,
    },
    issues,
    pages,
    thresholds: THRESHOLDS,
    recommendations: [
      lcpPassRate < 75 ? 'Optimize LCP: compress images, use CDN, improve server response' : null,
      clsPassRate < 75 ? 'Fix CLS: add image dimensions, avoid injecting content above existing content' : null,
      criticalCount > 0 ? 'Address critical performance issues blocking search ranking' : null,
    ].filter(Boolean),
  };
}

// ============================================
// API Handlers
// ============================================

export async function GET(request) {
  try {
    const db = await getDb();
    
    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit')) || 10;
    
    // Fetch stored reports
    const query = reportType ? { reportType } : {};
    const reports = await db.collection('seo_reports')
      .find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();
    
    return NextResponse.json({
      ok: true,
      reports,
      count: reports.length,
    });
  } catch (error) {
    console.error('SEO_AUDIT_GET_ERROR:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const db = await getDb();
    
    const body = await request.json();
    const { action, reportTypes } = body;
    
    if (action === 'scan') {
      const results = {};
      const typesToRun = reportTypes || ['technical_seo', 'content_coverage', 'web_vitals'];
      
      // Run requested audits
      if (typesToRun.includes('technical_seo')) {
        results.technical_seo = await runTechnicalSeoAudit(db);
      }
      if (typesToRun.includes('content_coverage')) {
        results.content_coverage = await runContentCoverageAudit(db);
      }
      if (typesToRun.includes('web_vitals')) {
        results.web_vitals = await runWebVitalsAudit(db);
      }
      
      // Store results
      const reportsToStore = Object.values(results).map(report => ({
        ...report,
        createdAt: new Date(),
      }));
      
      if (reportsToStore.length > 0) {
        await db.collection('seo_reports').insertMany(reportsToStore);
      }
      
      // Calculate overall score
      const scores = Object.values(results).map(r => r.score);
      const overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      const overallStatus = overallScore >= 80 ? 'PASS' : overallScore >= 50 ? 'WARN' : 'FAIL';
      
      // Collect all blocking issues
      const blockingIssues = [];
      Object.values(results).forEach(report => {
        report.issues
          .filter(i => i.severity === 'critical')
          .forEach(issue => {
            blockingIssues.push({
              report: report.title,
              ...issue,
            });
          });
      });
      
      return NextResponse.json({
        ok: true,
        overallScore,
        overallStatus,
        blockingIssues,
        blockingIssuesCount: blockingIssues.length,
        reports: results,
        message: `SEO audit completed. Overall score: ${overallScore}%`,
      });
    }
    
    return NextResponse.json({ ok: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('SEO_AUDIT_POST_ERROR:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const db = await getDb();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const olderThan = searchParams.get('olderThan'); // days
    
    if (id) {
      await db.collection('seo_reports').deleteOne({ _id: new ObjectId(id) });
      return NextResponse.json({ ok: true, message: 'Report deleted' });
    }
    
    if (olderThan) {
      const date = new Date();
      date.setDate(date.getDate() - parseInt(olderThan));
      const result = await db.collection('seo_reports').deleteMany({ timestamp: { $lt: date } });
      return NextResponse.json({ ok: true, deleted: result.deletedCount });
    }
    
    return NextResponse.json({ ok: false, error: 'Specify id or olderThan parameter' }, { status: 400 });
  } catch (error) {
    console.error('SEO_AUDIT_DELETE_ERROR:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

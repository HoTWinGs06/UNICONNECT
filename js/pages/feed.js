// ============================================
// UniConnect — Campus Feed Page
// ============================================

export function renderFeed() {
  return `
  <main class="max-w-[680px] mx-auto px-container-padding-mobile md:px-0 py-stack-lg flex flex-col gap-gutter">
    <!-- Start a Post Bar -->
    <section class="bg-surface rounded-lg shadow-sm border border-outline-variant p-stack-lg flex flex-col gap-stack-md hover-lift">
      <div class="flex gap-stack-md items-center">
        <img alt="Your Avatar" class="w-12 h-12 rounded-full object-cover border border-outline-variant" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsfUhEUaR28wYVTF9ZZGGatNYTBpLsmECoc0hhuS-BMViNORCBgymuQTyvKR0tTmXcrKhbHMjXl7M67NOtlv_FGnS4l7fv8OqEaoC89z6kcEFvn1ksCyjmM-D5Km14cQjglwFX8Vqu6E3VEujc-q_Z8rBgDjX4_hIyH6JnWS-_iLw_npyirIduyXxVepSwzt6t8WJLOu2_jYaYe629qLkFf-JP8rkVgGbIjlO4GL-CCY8OW1PiUFayezTShe1HkvJbqUAE1FBgyRA"/>
        <button class="flex-1 text-left bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-body-md text-body-md py-3 px-4 rounded-full border border-outline-variant transition-colors">
          Start a post, share a resource...
        </button>
      </div>
      <div class="flex justify-around pt-2 border-t border-surface-container mt-2">
        <button class="flex items-center gap-2 text-on-surface-variant hover:bg-surface-container-low px-4 py-2 rounded-lg transition-colors press-scale">
          <span class="material-symbols-outlined text-secondary" style="font-variation-settings: 'FILL' 1;">image</span>
          <span class="font-label-md text-label-md hidden sm:inline">Media</span>
        </button>
        <button class="flex items-center gap-2 text-on-surface-variant hover:bg-surface-container-low px-4 py-2 rounded-lg transition-colors press-scale">
          <span class="material-symbols-outlined text-surface-tint" style="font-variation-settings: 'FILL' 1;">article</span>
          <span class="font-label-md text-label-md hidden sm:inline">Document</span>
        </button>
        <button class="flex items-center gap-2 text-on-surface-variant hover:bg-surface-container-low px-4 py-2 rounded-lg transition-colors press-scale">
          <span class="material-symbols-outlined text-primary-container" style="font-variation-settings: 'FILL' 1;">event</span>
          <span class="font-label-md text-label-md hidden sm:inline">Event</span>
        </button>
      </div>
    </section>

    <!-- Feed List -->
    <div class="flex flex-col gap-stack-lg">

      <!-- Card 1: Official Announcement -->
      <article class="bg-surface rounded-lg shadow-sm border border-outline-variant overflow-hidden hover-lift">
        <div class="h-1 bg-primary-container w-full"></div>
        <div class="p-stack-lg">
          <div class="flex items-start gap-stack-md mb-4">
            <div class="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center shrink-0 border border-outline-variant">
              <span class="material-symbols-outlined text-primary-container" style="font-variation-settings: 'FILL' 1;">account_balance</span>
            </div>
            <div class="flex-1">
              <h2 class="font-label-md text-label-md text-on-surface uppercase tracking-wider">Registrar's Office</h2>
              <p class="font-body-sm text-body-sm text-on-surface-variant">University Administration</p>
              <p class="font-label-sm text-label-sm text-outline flex items-center gap-1 mt-0.5">
                <span class="material-symbols-outlined text-[14px]">schedule</span> 2h ago
              </p>
            </div>
            <button class="text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors">
              <span class="material-symbols-outlined">more_horiz</span>
            </button>
          </div>
          <div class="font-body-md text-body-md text-on-surface mb-4 space-y-2">
            <p class="font-bold">⚠️ Spring 2024 Course Enrollment Opens Next Week!</p>
            <p>Please ensure you have reviewed your degree audit and met with your academic advisor prior to your assigned registration window. The course catalog has been updated with new elective seminars.</p>
            <div class="inline-flex items-center gap-1 bg-surface-container text-on-surface-variant px-2 py-1 rounded-sm mt-2">
              <span class="material-symbols-outlined text-[16px]">info</span>
              <span class="font-label-sm text-label-sm">Action Required</span>
            </div>
          </div>
        </div>
        <div class="border-t border-outline-variant px-stack-lg py-2 flex justify-between bg-surface-bright">
          <button class="feed-action flex items-center gap-2 text-on-surface-variant hover:bg-surface-container-low px-4 py-2 rounded-lg transition-colors font-label-md text-label-md press-scale" data-action="like">
            <span class="material-symbols-outlined">thumb_up</span> Like
          </button>
          <button class="flex items-center gap-2 text-on-surface-variant hover:bg-surface-container-low px-4 py-2 rounded-lg transition-colors font-label-md text-label-md press-scale">
            <span class="material-symbols-outlined">chat_bubble_outline</span> Comment (12)
          </button>
          <button class="flex items-center gap-2 text-on-surface-variant hover:bg-surface-container-low px-4 py-2 rounded-lg transition-colors font-label-md text-label-md press-scale">
            <span class="material-symbols-outlined">share</span> Share
          </button>
        </div>
      </article>

      <!-- Card 2: Research Highlight with Image -->
      <article class="bg-surface rounded-lg shadow-sm border border-outline-variant overflow-hidden hover-lift">
        <div class="p-stack-lg pb-0">
          <div class="flex items-start gap-stack-md mb-4">
            <img alt="Prof. Sarah Jenkins" class="w-12 h-12 rounded-full object-cover border border-outline-variant shrink-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVhjM381ava6GDrigrKAGbdrcUXTFUmAADo8hHHnN7_DvyZBIXxW2lc3DjWyJPdatk38NduH66SSwgpRXExZvZnBLJqtPp8jpakl6bkDh5WuWm3SZ-dOF8flzUQyfmeY0-JZtQG8zhRsLZWEMCfiwq8l7VkSZXj9ZiCGZSk9kR5Yq__X349j6_0zJEMQGlZ8iXhmx0s6_Uy19MiIaJ88YGJHmJRXnoOQ3XbMa3nevpqZEJEOQzxtrwfVYkqCeR45dMZmwOXdwm8AM"/>
            <div class="flex-1">
              <h2 class="font-label-md text-label-md text-on-surface">Prof. Sarah Jenkins</h2>
              <p class="font-body-sm text-body-sm text-on-surface-variant">Department of Computer Science • AI Ethics Lead</p>
              <p class="font-label-sm text-label-sm text-outline flex items-center gap-1 mt-0.5">
                <span class="material-symbols-outlined text-[14px]">public</span> 5h ago
              </p>
            </div>
            <button class="text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors">
              <span class="material-symbols-outlined">more_horiz</span>
            </button>
          </div>
          <div class="font-body-md text-body-md text-on-surface mb-4">
            <p>Excited to announce our lab's latest paper on "Interpretable Machine Learning Models in Healthcare" has been accepted for publication in the upcoming IEEE conference! A huge congratulations to my grad students for their tireless work over the past semester. We are pushing the boundaries of transparent AI. 🧠💻</p>
          </div>
        </div>
        <div class="w-full h-64 bg-surface-container-highest border-y border-outline-variant">
          <img alt="Research Visualization" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuADAylvuch_90YqNsa3l7e5CSSamAE2u--CSZ0AJYvZWht6m-ROpOoBt6g5ePVvWNboMjOqWd3n8sUG97gmxoUZXQ87TloPmfb2nVOIcLTs7vNj21RE5TtcZUR5BfdmAxocTh-Tfjo5ACWEk5oxO4ovltXNVj048Y8xM1UuZVpz4FTQcJwoNBSE1pDHz0oK5SaBm1r6Vr6gYgD5DtUyVk54PeQ99snQtPGE7leKTeDQHfBJN5WcGfGB44_BaZoVgrEUZFp3h0bONzQ"/>
        </div>
        <div class="px-stack-lg py-2 flex justify-between bg-surface-bright">
          <button class="feed-action flex items-center gap-2 text-secondary hover:bg-surface-container-low px-4 py-2 rounded-lg transition-colors font-label-md text-label-md press-scale liked" data-action="like">
            <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">thumb_up</span> 142 Likes
          </button>
          <button class="flex items-center gap-2 text-on-surface-variant hover:bg-surface-container-low px-4 py-2 rounded-lg transition-colors font-label-md text-label-md press-scale">
            <span class="material-symbols-outlined">chat_bubble_outline</span> 24 Comments
          </button>
          <button class="flex items-center gap-2 text-on-surface-variant hover:bg-surface-container-low px-4 py-2 rounded-lg transition-colors font-label-md text-label-md press-scale">
            <span class="material-symbols-outlined">share</span> Share
          </button>
        </div>
      </article>

      <!-- Card 3: Student Networking -->
      <article class="bg-surface rounded-lg shadow-sm border border-outline-variant overflow-hidden hover-lift">
        <div class="p-stack-lg">
          <div class="flex items-start gap-stack-md mb-4">
            <img alt="David Chen" class="w-12 h-12 rounded-full object-cover border border-outline-variant shrink-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4XGygvrT7G7LV6KJM69BKVnI9JsnuWJxghw36lB6MJ-frQHFgjvTzYfdRJmJbvS7AfN6RpO61skLFWHy8NZMs4wy5L6r5HSgc7Fxfks72pWrqBFdZXs2yBHYu3i5IAQhrAo4Br_fKLcAQigfcmvZZ3M7mRHXHEzRH-1i-H7rtgr620OzVEdQBuUeeQSLujBkq-v13LPL-rPYrVdh9nmGv-j4edSU-Iv9h17b53RQW2fWpnOnIEw40iEo0nuPT58qxNzpDQMLHOGQ"/>
            <div class="flex-1">
              <h2 class="font-label-md text-label-md text-on-surface">David Chen</h2>
              <p class="font-body-sm text-body-sm text-on-surface-variant">Junior • B.S. Software Engineering</p>
              <p class="font-label-sm text-label-sm text-outline flex items-center gap-1 mt-0.5">
                <span class="material-symbols-outlined text-[14px]">group</span> 1d ago
              </p>
            </div>
            <button class="text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors">
              <span class="material-symbols-outlined">more_horiz</span>
            </button>
          </div>
          <div class="font-body-md text-body-md text-on-surface mb-4">
            <p>Hey everyone! I'm looking to put together a team for the upcoming Global Campus Hackathon next month. I have strong experience in frontend (React/Tailwind) but we really need a solid backend developer (Node/Python) and someone with a flair for UX design. If you're interested in building something cool over a weekend, drop a comment or send me a DM! 🚀</p>
            <div class="flex gap-2 mt-3 flex-wrap">
              <span class="bg-surface-variant text-on-surface-variant px-2 py-1 rounded-sm font-label-sm text-label-sm">#Hackathon</span>
              <span class="bg-surface-variant text-on-surface-variant px-2 py-1 rounded-sm font-label-sm text-label-sm">#TeamBuilding</span>
              <span class="bg-surface-variant text-on-surface-variant px-2 py-1 rounded-sm font-label-sm text-label-sm">#SoftwareEngineering</span>
            </div>
          </div>
        </div>
        <div class="border-t border-outline-variant px-stack-lg py-2 flex justify-between bg-surface-bright">
          <button class="feed-action flex items-center gap-2 text-on-surface-variant hover:bg-surface-container-low px-4 py-2 rounded-lg transition-colors font-label-md text-label-md press-scale" data-action="like">
            <span class="material-symbols-outlined">thumb_up</span> 38
          </button>
          <button class="flex items-center gap-2 text-on-surface-variant hover:bg-surface-container-low px-4 py-2 rounded-lg transition-colors font-label-md text-label-md press-scale">
            <span class="material-symbols-outlined">chat_bubble_outline</span> 5 Comments
          </button>
          <button class="flex items-center gap-2 text-on-surface-variant hover:bg-surface-container-low px-4 py-2 rounded-lg transition-colors font-label-md text-label-md press-scale">
            <span class="material-symbols-outlined">send</span> DM David
          </button>
        </div>
      </article>

    </div>
  </main>`;
}

export function initFeed() {
  // Like button toggle
  document.querySelectorAll('.feed-action[data-action="like"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const isLiked = btn.classList.contains('liked');
      const icon = btn.querySelector('.material-symbols-outlined');
      if (isLiked) {
        btn.classList.remove('liked', 'text-secondary');
        btn.classList.add('text-on-surface-variant');
        icon.style.fontVariationSettings = "";
      } else {
        btn.classList.add('liked', 'text-secondary');
        btn.classList.remove('text-on-surface-variant');
        icon.style.fontVariationSettings = "'FILL' 1";
      }
    });
  });
}

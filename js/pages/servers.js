// ============================================
// UniConnect — Campus Servers Page (Discord-style)
// ============================================

export function renderServers() {
  return `
  <div class="flex h-[calc(100vh-64px)] md:h-screen overflow-hidden">

    <!-- Server Sidebar / Year Rail -->
    <aside class="w-[72px] bg-surface-container-highest border-r border-outline-variant flex flex-col items-center py-4 gap-3 shrink-0 thin-scrollbar overflow-y-auto">
      <!-- All Servers -->
      <button class="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container transition-all duration-200 shadow-sm server-btn active press-scale" data-server="all" title="All Servers">
        <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">hub</span>
      </button>

      <div class="w-8 h-0.5 bg-outline-variant rounded-full my-1"></div>

      <!-- Year Servers -->
      <button class="server-btn w-12 h-12 rounded-2xl bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-secondary hover:text-on-secondary transition-all duration-200 shadow-sm font-headline-md text-headline-md font-bold press-scale" data-server="y1" title="Year 1">
        Y1
      </button>
      <button class="server-btn w-12 h-12 rounded-2xl bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-secondary hover:text-on-secondary transition-all duration-200 shadow-sm font-headline-md text-headline-md font-bold press-scale" data-server="y2" title="Year 2">
        Y2
      </button>
      <button class="server-btn w-12 h-12 rounded-2xl bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-secondary hover:text-on-secondary transition-all duration-200 shadow-sm font-headline-md text-headline-md font-bold press-scale" data-server="y3" title="Year 3">
        Y3
      </button>
      <button class="server-btn w-12 h-12 rounded-2xl bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-secondary hover:text-on-secondary transition-all duration-200 shadow-sm font-headline-md text-headline-md font-bold press-scale" data-server="y4" title="Year 4">
        Y4
      </button>

      <div class="w-8 h-0.5 bg-outline-variant rounded-full my-1"></div>

      <!-- Special Servers -->
      <button class="server-btn w-12 h-12 rounded-2xl bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-secondary hover:text-on-secondary transition-all duration-200 shadow-sm press-scale" data-server="faculty" title="Faculty Lounge">
        <span class="material-symbols-outlined">school</span>
      </button>
      <button class="server-btn w-12 h-12 rounded-2xl bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-secondary hover:text-on-secondary transition-all duration-200 shadow-sm press-scale" data-server="clubs" title="Clubs & Societies">
        <span class="material-symbols-outlined">groups</span>
      </button>

      <!-- Add server -->
      <button class="w-12 h-12 rounded-2xl bg-surface-container-lowest border-2 border-dashed border-outline flex items-center justify-center text-outline hover:border-secondary hover:text-secondary transition-all duration-200 mt-auto press-scale" title="Create Server">
        <span class="material-symbols-outlined">add</span>
      </button>
    </aside>

    <!-- Channel List -->
    <aside class="w-60 bg-surface-container border-r border-outline-variant flex flex-col shrink-0 hidden md:flex">
      <div class="p-4 border-b border-outline-variant">
        <h2 class="font-headline-md text-headline-md text-on-surface font-semibold truncate" id="server-title">All Campus Servers</h2>
        <p class="font-label-sm text-label-sm text-on-surface-variant mt-0.5">12 Channels</p>
      </div>
      <div class="flex-1 overflow-y-auto thin-scrollbar py-2" id="channel-list">
        <!-- Text Channels -->
        <div class="px-3 py-2">
          <p class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1 flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">expand_more</span> Text Channels
          </p>
          <button class="channel-btn w-full text-left px-3 py-2 rounded-md text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors font-body-md text-body-md flex items-center gap-2 active" data-channel="general">
            <span class="material-symbols-outlined text-[18px]">tag</span> general
          </button>
          <button class="channel-btn w-full text-left px-3 py-2 rounded-md text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors font-body-md text-body-md flex items-center gap-2" data-channel="announcements">
            <span class="material-symbols-outlined text-[18px]">campaign</span> announcements
            <span class="ml-auto bg-secondary text-on-secondary text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">3</span>
          </button>
          <button class="channel-btn w-full text-left px-3 py-2 rounded-md text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors font-body-md text-body-md flex items-center gap-2" data-channel="resources">
            <span class="material-symbols-outlined text-[18px]">folder_open</span> resources
          </button>
          <button class="channel-btn w-full text-left px-3 py-2 rounded-md text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors font-body-md text-body-md flex items-center gap-2" data-channel="help-desk">
            <span class="material-symbols-outlined text-[18px]">help_outline</span> help-desk
          </button>
        </div>

        <!-- Subject Channels -->
        <div class="px-3 py-2 mt-2">
          <p class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1 flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">expand_more</span> Subjects
          </p>
          <button class="channel-btn w-full text-left px-3 py-2 rounded-md text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors font-body-md text-body-md flex items-center gap-2" data-channel="data-structures">
            <span class="material-symbols-outlined text-[18px]">tag</span> data-structures
          </button>
          <button class="channel-btn w-full text-left px-3 py-2 rounded-md text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors font-body-md text-body-md flex items-center gap-2" data-channel="algorithms">
            <span class="material-symbols-outlined text-[18px]">tag</span> algorithms
          </button>
          <button class="channel-btn w-full text-left px-3 py-2 rounded-md text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors font-body-md text-body-md flex items-center gap-2" data-channel="databases">
            <span class="material-symbols-outlined text-[18px]">tag</span> databases
          </button>
        </div>

        <!-- Voice Channels -->
        <div class="px-3 py-2 mt-2">
          <p class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1 flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">expand_more</span> Voice Channels
          </p>
          <button class="channel-btn w-full text-left px-3 py-2 rounded-md text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors font-body-md text-body-md flex items-center gap-2" data-channel="study-room-1">
            <span class="material-symbols-outlined text-[18px]">volume_up</span> Study Room 1
            <span class="ml-auto flex -space-x-1">
              <span class="w-5 h-5 rounded-full bg-green-400 border border-surface-container"></span>
              <span class="w-5 h-5 rounded-full bg-blue-400 border border-surface-container"></span>
            </span>
          </button>
          <button class="channel-btn w-full text-left px-3 py-2 rounded-md text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors font-body-md text-body-md flex items-center gap-2" data-channel="study-room-2">
            <span class="material-symbols-outlined text-[18px]">volume_up</span> Study Room 2
          </button>
          <button class="channel-btn w-full text-left px-3 py-2 rounded-md text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors font-body-md text-body-md flex items-center gap-2" data-channel="meeting-room">
            <span class="material-symbols-outlined text-[18px]">videocam</span> Meeting Room
          </button>
        </div>
      </div>

      <!-- User Bar -->
      <div class="p-3 border-t border-outline-variant bg-surface-container-lowest flex items-center gap-2">
        <div class="relative">
          <img alt="You" class="w-8 h-8 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsfUhEUaR28wYVTF9ZZGGatNYTBpLsmECoc0hhuS-BMViNORCBgymuQTyvKR0tTmXcrKhbHMjXl7M67NOtlv_FGnS4l7fv8OqEaoC89z6kcEFvn1ksCyjmM-D5Km14cQjglwFX8Vqu6E3VEujc-q_Z8rBgDjX4_hIyH6JnWS-_iLw_npyirIduyXxVepSwzt6t8WJLOu2_jYaYe629qLkFf-JP8rkVgGbIjlO4GL-CCY8OW1PiUFayezTShe1HkvJbqUAE1FBgyRA"/>
          <span class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-surface-container-lowest rounded-full"></span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-label-sm text-label-sm text-on-surface truncate">Alex Martinez</p>
          <p class="font-label-sm text-label-sm text-green-600 text-[10px]">Online</p>
        </div>
        <button class="p-1 text-on-surface-variant hover:text-on-surface transition-colors rounded">
          <span class="material-symbols-outlined text-[18px]">settings</span>
        </button>
      </div>
    </aside>

    <!-- Chat Area -->
    <main class="flex-1 flex flex-col bg-background min-w-0">
      <!-- Channel Header -->
      <div class="h-14 border-b border-outline-variant px-4 flex items-center gap-3 bg-surface shrink-0">
        <button class="md:hidden text-on-surface-variant p-1" id="mobile-channel-toggle">
          <span class="material-symbols-outlined">menu</span>
        </button>
        <span class="material-symbols-outlined text-on-surface-variant text-[18px]">tag</span>
        <h3 class="font-label-md text-label-md text-on-surface" id="channel-name">general</h3>
        <span class="hidden md:inline font-body-sm text-body-sm text-on-surface-variant ml-2 border-l border-outline-variant pl-3">Welcome! Share updates and connect with classmates.</span>
        <div class="ml-auto flex items-center gap-2">
          <button class="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
            <span class="material-symbols-outlined text-[20px]">search</span>
          </button>
          <button class="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
            <span class="material-symbols-outlined text-[20px]">push_pin</span>
          </button>
          <button class="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
            <span class="material-symbols-outlined text-[20px]">people</span>
          </button>
        </div>
      </div>

      <!-- Messages -->
      <div class="flex-1 overflow-y-auto thin-scrollbar p-4 space-y-5">
        <!-- Message 1 -->
        <div class="flex gap-3 group">
          <img alt="Prof. Kim" class="w-10 h-10 rounded-full object-cover shrink-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVhjM381ava6GDrigrKAGbdrcUXTFUmAADo8hHHnN7_DvyZBIXxW2lc3DjWyJPdatk38NduH66SSwgpRXExZvZnBLJqtPp8jpakl6bkDh5WuWm3SZ-dOF8flzUQyfmeY0-JZtQG8zhRsLZWEMCfiwq8l7VkSZXj9ZiCGZSk9kR5Yq__X349j6_0zJEMQGlZ8iXhmx0s6_Uy19MiIaJ88YGJHmJRXnoOQ3XbMa3nevpqZEJEOQzxtrwfVYkqCeR45dMZmwOXdwm8AM"/>
          <div>
            <div class="flex items-baseline gap-2">
              <span class="font-label-md text-label-md text-primary-container">Prof. Kim</span>
              <span class="font-label-sm text-label-sm text-outline">Today at 9:15 AM</span>
            </div>
            <p class="font-body-md text-body-md text-on-surface mt-1">Good morning everyone! Quick reminder: Assignment 3 on Binary Search Trees is due this Friday at midnight. Please don't hesitate to visit office hours if you're stuck.</p>
            <div class="flex gap-2 mt-2">
              <button class="flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded-full text-on-surface-variant hover:bg-surface-container-low transition-colors text-sm">
                👍 <span class="text-[12px] font-medium">8</span>
              </button>
              <button class="flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded-full text-on-surface-variant hover:bg-surface-container-low transition-colors text-sm">
                ✅ <span class="text-[12px] font-medium">5</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Message 2 -->
        <div class="flex gap-3 group">
          <img alt="Aisha N." class="w-10 h-10 rounded-full object-cover shrink-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4XGygvrT7G7LV6KJM69BKVnI9JsnuWJxghw36lB6MJ-frQHFgjvTzYfdRJmJbvS7AfN6RpO61skLFWHy8NZMs4wy5L6r5HSgc7Fxfks72pWrqBFdZXs2yBHYu3i5IAQhrAo4Br_fKLcAQigfcmvZZ3M7mRHXHEzRH-1i-H7rtgr620OzVEdQBuUeeQSLujBkq-v13LPL-rPYrVdh9nmGv-j4edSU-Iv9h17b53RQW2fWpnOnIEw40iEo0nuPT58qxNzpDQMLHOGQ"/>
          <div>
            <div class="flex items-baseline gap-2">
              <span class="font-label-md text-label-md text-secondary">Aisha N.</span>
              <span class="font-label-sm text-label-sm text-outline">Today at 9:42 AM</span>
            </div>
            <p class="font-body-md text-body-md text-on-surface mt-1">Thanks for the reminder! I had a quick question about balancing AVL trees — is the rotation logic the same as in the textbook chapter, or should we follow the approach from the lecture slides? They seem slightly different.</p>
          </div>
        </div>

        <!-- Message 3 -->
        <div class="flex gap-3 group">
          <img alt="Carlos R." class="w-10 h-10 rounded-full object-cover shrink-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsfUhEUaR28wYVTF9ZZGGatNYTBpLsmECoc0hhuS-BMViNORCBgymuQTyvKR0tTmXcrKhbHMjXl7M67NOtlv_FGnS4l7fv8OqEaoC89z6kcEFvn1ksCyjmM-D5Km14cQjglwFX8Vqu6E3VEujc-q_Z8rBgDjX4_hIyH6JnWS-_iLw_npyirIduyXxVepSwzt6t8WJLOu2_jYaYe629qLkFf-JP8rkVgGbIjlO4GL-CCY8OW1PiUFayezTShe1HkvJbqUAE1FBgyRA"/>
          <div>
            <div class="flex items-baseline gap-2">
              <span class="font-label-md text-label-md text-primary-container">Carlos R.</span>
              <span class="font-label-sm text-label-sm text-outline">Today at 10:05 AM</span>
            </div>
            <p class="font-body-md text-body-md text-on-surface mt-1">Hey Aisha, I had the same confusion. I ended up going with the lecture slides version because Prof. Kim confirmed in OH yesterday that's what we'll be tested on. The textbook one has an extra step that we can skip.</p>
          </div>
        </div>
      </div>

      <!-- Chat Input -->
      <div class="p-4 border-t border-outline-variant bg-surface shrink-0">
        <div class="flex items-center gap-2 bg-surface-container-low rounded-lg px-4 py-3 border border-outline-variant focus-within:border-secondary transition-colors">
          <button class="text-on-surface-variant hover:text-on-surface transition-colors shrink-0">
            <span class="material-symbols-outlined text-[20px]">add_circle</span>
          </button>
          <input class="flex-1 bg-transparent outline-none font-body-md text-body-md text-on-surface placeholder:text-outline min-w-0" placeholder="Message #general" type="text"/>
          <div class="flex items-center gap-1 shrink-0">
            <button class="text-on-surface-variant hover:text-on-surface transition-colors p-1">
              <span class="material-symbols-outlined text-[20px]">emoji_emotions</span>
            </button>
            <button class="text-on-surface-variant hover:text-on-surface transition-colors p-1">
              <span class="material-symbols-outlined text-[20px]">attach_file</span>
            </button>
            <button class="bg-secondary text-on-secondary w-8 h-8 rounded-full flex items-center justify-center hover:bg-secondary-container transition-colors press-scale ml-1">
              <span class="material-symbols-outlined text-[18px]">send</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>`;
}

export function initServers() {
  // Server pill switching
  const serverBtns = document.querySelectorAll('.server-btn');
  const serverTitle = document.getElementById('server-title');
  const serverNames = {
    all: 'All Campus Servers',
    y1: 'Year 1 Server',
    y2: 'Year 2 Server',
    y3: 'Year 3 Server',
    y4: 'Year 4 Server',
    faculty: 'Faculty Lounge',
    clubs: 'Clubs & Societies'
  };

  serverBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      serverBtns.forEach(b => {
        b.classList.remove('bg-secondary', 'text-on-secondary', 'active');
        b.classList.add('bg-surface-container-low', 'text-on-surface-variant');
      });
      btn.classList.remove('bg-surface-container-low', 'text-on-surface-variant');
      btn.classList.add('bg-secondary', 'text-on-secondary', 'active');
      if (serverTitle) serverTitle.textContent = serverNames[btn.dataset.server] || 'Server';
    });
  });

  // Channel switching
  const channelBtns = document.querySelectorAll('.channel-btn');
  const channelName = document.getElementById('channel-name');
  channelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      channelBtns.forEach(b => {
        b.classList.remove('bg-surface-container-low', 'text-on-surface', 'active');
        b.classList.add('text-on-surface-variant');
      });
      btn.classList.add('bg-surface-container-low', 'text-on-surface', 'active');
      btn.classList.remove('text-on-surface-variant');
      if (channelName) channelName.textContent = btn.dataset.channel;
    });
  });
}

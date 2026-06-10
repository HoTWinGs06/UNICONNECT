// ============================================
// UniConnect — Messages Page
// ============================================

export function renderMessages() {
  return `
  <div class="flex h-[calc(100vh-64px)] md:h-screen overflow-hidden">

    <!-- Conversations List -->
    <aside class="w-full md:w-80 border-r border-outline-variant bg-surface flex flex-col shrink-0" id="conversations-panel">
      <!-- Header -->
      <div class="p-4 border-b border-outline-variant">
        <div class="flex items-center justify-between mb-3">
          <h1 class="font-headline-md text-headline-md text-on-surface font-semibold text-[20px]">Messages</h1>
          <button class="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors press-scale">
            <span class="material-symbols-outlined text-[20px]">edit_square</span>
          </button>
        </div>
        <!-- Search -->
        <div class="relative">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
          <input class="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant font-body-sm text-body-sm text-on-surface placeholder:text-outline outline-none focus:border-secondary transition-colors" placeholder="Search conversations..." type="text"/>
        </div>
      </div>

      <!-- Filter Chips -->
      <div class="px-4 py-2 flex gap-2 border-b border-outline-variant">
        <button class="px-3 py-1.5 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm transition-colors">All</button>
        <button class="px-3 py-1.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm hover:bg-surface-container-low transition-colors">Unread</button>
        <button class="px-3 py-1.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm hover:bg-surface-container-low transition-colors">Groups</button>
      </div>

      <!-- Conversation List -->
      <div class="flex-1 overflow-y-auto thin-scrollbar">
        <!-- Active conversation -->
        <button class="msg-conversation w-full text-left p-4 flex gap-3 bg-surface-container-low border-l-2 border-secondary active" data-conv="sarah">
          <div class="relative shrink-0">
            <img alt="Prof. Sarah J." class="w-12 h-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVhjM381ava6GDrigrKAGbdrcUXTFUmAADo8hHHnN7_DvyZBIXxW2lc3DjWyJPdatk38NduH66SSwgpRXExZvZnBLJqtPp8jpakl6bkDh5WuWm3SZ-dOF8flzUQyfmeY0-JZtQG8zhRsLZWEMCfiwq8l7VkSZXj9ZiCGZSk9kR5Yq__X349j6_0zJEMQGlZ8iXhmx0s6_Uy19MiIaJ88YGJHmJRXnoOQ3XbMa3nevpqZEJEOQzxtrwfVYkqCeR45dMZmwOXdwm8AM"/>
            <span class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-surface rounded-full"></span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-baseline">
              <h3 class="font-label-md text-label-md text-on-surface truncate">Prof. Sarah Jenkins</h3>
              <span class="font-label-sm text-label-sm text-outline shrink-0">2:45 PM</span>
            </div>
            <p class="font-body-sm text-body-sm text-on-surface-variant truncate mt-0.5">Sure, let me send you the updated syllabus...</p>
          </div>
        </button>

        <!-- Unread conversation -->
        <button class="msg-conversation w-full text-left p-4 flex gap-3 hover:bg-surface-container-low transition-colors" data-conv="david">
          <div class="relative shrink-0">
            <img alt="David Chen" class="w-12 h-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4XGygvrT7G7LV6KJM69BKVnI9JsnuWJxghw36lB6MJ-frQHFgjvTzYfdRJmJbvS7AfN6RpO61skLFWHy8NZMs4wy5L6r5HSgc7Fxfks72pWrqBFdZXs2yBHYu3i5IAQhrAo4Br_fKLcAQigfcmvZZ3M7mRHXHEzRH-1i-H7rtgr620OzVEdQBuUeeQSLujBkq-v13LPL-rPYrVdh9nmGv-j4edSU-Iv9h17b53RQW2fWpnOnIEw40iEo0nuPT58qxNzpDQMLHOGQ"/>
            <span class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-surface rounded-full"></span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-baseline">
              <h3 class="font-label-md text-label-md text-on-surface truncate font-bold">David Chen</h3>
              <span class="font-label-sm text-label-sm text-secondary shrink-0 font-semibold">1:20 PM</span>
            </div>
            <p class="font-body-sm text-body-sm text-on-surface truncate mt-0.5 font-semibold">Hey! Are you joining the hackathon team?</p>
          </div>
          <span class="w-5 h-5 bg-secondary text-on-secondary rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 self-center">2</span>
        </button>

        <!-- Group conversation -->
        <button class="msg-conversation w-full text-left p-4 flex gap-3 hover:bg-surface-container-low transition-colors" data-conv="algo-group">
          <div class="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-on-surface-variant">groups</span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-baseline">
              <h3 class="font-label-md text-label-md text-on-surface truncate">Algo Study Group</h3>
              <span class="font-label-sm text-label-sm text-outline shrink-0">11:00 AM</span>
            </div>
            <p class="font-body-sm text-body-sm text-on-surface-variant truncate mt-0.5">Carlos: Let's meet at the library today...</p>
          </div>
        </button>

        <!-- More conversations -->
        <button class="msg-conversation w-full text-left p-4 flex gap-3 hover:bg-surface-container-low transition-colors" data-conv="priya">
          <div class="relative shrink-0">
            <img alt="Priya M." class="w-12 h-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsfUhEUaR28wYVTF9ZZGGatNYTBpLsmECoc0hhuS-BMViNORCBgymuQTyvKR0tTmXcrKhbHMjXl7M67NOtlv_FGnS4l7fv8OqEaoC89z6kcEFvn1ksCyjmM-D5Km14cQjglwFX8Vqu6E3VEujc-q_Z8rBgDjX4_hIyH6JnWS-_iLw_npyirIduyXxVepSwzt6t8WJLOu2_jYaYe629qLkFf-JP8rkVgGbIjlO4GL-CCY8OW1PiUFayezTShe1HkvJbqUAE1FBgyRA"/>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-baseline">
              <h3 class="font-label-md text-label-md text-on-surface truncate">Priya Malhotra</h3>
              <span class="font-label-sm text-label-sm text-outline shrink-0">Yesterday</span>
            </div>
            <p class="font-body-sm text-body-sm text-on-surface-variant truncate mt-0.5">Thanks for the notes! Really helpful 📝</p>
          </div>
        </button>
      </div>
    </aside>

    <!-- Chat View -->
    <main class="hidden md:flex flex-1 flex-col bg-background min-w-0">
      <!-- Chat Header -->
      <div class="h-14 border-b border-outline-variant px-4 flex items-center gap-3 bg-surface shrink-0">
        <div class="relative">
          <img alt="Prof. Sarah J." class="w-9 h-9 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVhjM381ava6GDrigrKAGbdrcUXTFUmAADo8hHHnN7_DvyZBIXxW2lc3DjWyJPdatk38NduH66SSwgpRXExZvZnBLJqtPp8jpakl6bkDh5WuWm3SZ-dOF8flzUQyfmeY0-JZtQG8zhRsLZWEMCfiwq8l7VkSZXj9ZiCGZSk9kR5Yq__X349j6_0zJEMQGlZ8iXhmx0s6_Uy19MiIaJ88YGJHmJRXnoOQ3XbMa3nevpqZEJEOQzxtrwfVYkqCeR45dMZmwOXdwm8AM"/>
          <span class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-surface rounded-full"></span>
        </div>
        <div>
          <h3 class="font-label-md text-label-md text-on-surface">Prof. Sarah Jenkins</h3>
          <p class="font-label-sm text-label-sm text-green-600 text-[11px]">Online</p>
        </div>
        <div class="ml-auto flex items-center gap-2">
          <button class="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
            <span class="material-symbols-outlined text-[20px]">videocam</span>
          </button>
          <button class="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
            <span class="material-symbols-outlined text-[20px]">call</span>
          </button>
          <button class="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
            <span class="material-symbols-outlined text-[20px]">more_vert</span>
          </button>
        </div>
      </div>

      <!-- Messages -->
      <div class="flex-1 overflow-y-auto thin-scrollbar p-6 space-y-4">
        <!-- Date divider -->
        <div class="flex items-center gap-3 my-2">
          <div class="flex-1 h-px bg-outline-variant"></div>
          <span class="font-label-sm text-label-sm text-outline">Today</span>
          <div class="flex-1 h-px bg-outline-variant"></div>
        </div>

        <!-- Received message -->
        <div class="flex gap-3 max-w-[75%]">
          <img alt="" class="w-8 h-8 rounded-full object-cover shrink-0 mt-1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVhjM381ava6GDrigrKAGbdrcUXTFUmAADo8hHHnN7_DvyZBIXxW2lc3DjWyJPdatk38NduH66SSwgpRXExZvZnBLJqtPp8jpakl6bkDh5WuWm3SZ-dOF8flzUQyfmeY0-JZtQG8zhRsLZWEMCfiwq8l7VkSZXj9ZiCGZSk9kR5Yq__X349j6_0zJEMQGlZ8iXhmx0s6_Uy19MiIaJ88YGJHmJRXnoOQ3XbMa3nevpqZEJEOQzxtrwfVYkqCeR45dMZmwOXdwm8AM"/>
          <div>
            <div class="bg-surface-container rounded-2xl rounded-tl-sm px-4 py-3">
              <p class="font-body-md text-body-md text-on-surface">Hi Alex! I wanted to follow up on your research proposal. I think the scope is excellent, but we might need to narrow down the methodology section a bit.</p>
            </div>
            <span class="font-label-sm text-label-sm text-outline mt-1 block ml-1">2:30 PM</span>
          </div>
        </div>

        <!-- Sent message -->
        <div class="flex gap-3 max-w-[75%] ml-auto flex-row-reverse">
          <div>
            <div class="bg-secondary text-on-secondary rounded-2xl rounded-tr-sm px-4 py-3">
              <p class="font-body-md text-body-md">Absolutely, Professor! I'll revise the methodology to focus specifically on the qualitative analysis portion. Could you send me the updated syllabus for reference?</p>
            </div>
            <span class="font-label-sm text-label-sm text-outline mt-1 block mr-1 text-right flex items-center justify-end gap-1">
              2:42 PM
              <span class="material-symbols-outlined text-secondary text-[14px]" style="font-variation-settings: 'FILL' 1;">done_all</span>
            </span>
          </div>
        </div>

        <!-- Received message -->
        <div class="flex gap-3 max-w-[75%]">
          <img alt="" class="w-8 h-8 rounded-full object-cover shrink-0 mt-1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVhjM381ava6GDrigrKAGbdrcUXTFUmAADo8hHHnN7_DvyZBIXxW2lc3DjWyJPdatk38NduH66SSwgpRXExZvZnBLJqtPp8jpakl6bkDh5WuWm3SZ-dOF8flzUQyfmeY0-JZtQG8zhRsLZWEMCfiwq8l7VkSZXj9ZiCGZSk9kR5Yq__X349j6_0zJEMQGlZ8iXhmx0s6_Uy19MiIaJ88YGJHmJRXnoOQ3XbMa3nevpqZEJEOQzxtrwfVYkqCeR45dMZmwOXdwm8AM"/>
          <div>
            <div class="bg-surface-container rounded-2xl rounded-tl-sm px-4 py-3">
              <p class="font-body-md text-body-md text-on-surface">Sure, let me send you the updated syllabus with the revised timeline. Give me a moment! 📄</p>
            </div>
            <span class="font-label-sm text-label-sm text-outline mt-1 block ml-1">2:45 PM</span>
          </div>
        </div>
      </div>

      <!-- Message Input -->
      <div class="p-4 border-t border-outline-variant bg-surface shrink-0">
        <div class="flex items-center gap-2 bg-surface-container-low rounded-xl px-4 py-3 border border-outline-variant focus-within:border-secondary transition-colors">
          <button class="text-on-surface-variant hover:text-on-surface transition-colors shrink-0">
            <span class="material-symbols-outlined text-[20px]">add_circle</span>
          </button>
          <input class="flex-1 bg-transparent outline-none font-body-md text-body-md text-on-surface placeholder:text-outline min-w-0" placeholder="Type a message..." type="text"/>
          <div class="flex items-center gap-1 shrink-0">
            <button class="text-on-surface-variant hover:text-on-surface transition-colors p-1">
              <span class="material-symbols-outlined text-[20px]">emoji_emotions</span>
            </button>
            <button class="text-on-surface-variant hover:text-on-surface transition-colors p-1">
              <span class="material-symbols-outlined text-[20px]">mic</span>
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

export function initMessages() {
  // Conversation switching
  const convBtns = document.querySelectorAll('.msg-conversation');
  convBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      convBtns.forEach(b => {
        b.classList.remove('bg-surface-container-low', 'border-l-2', 'border-secondary', 'active');
      });
      btn.classList.add('bg-surface-container-low', 'border-l-2', 'border-secondary', 'active');
    });
  });
}

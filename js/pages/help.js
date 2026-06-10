// ============================================
// UniConnect — Create Help Request Page
// ============================================

export function renderHelp() {
  return `
  <main class="max-w-2xl mx-auto px-container-padding-mobile md:px-container-padding-desktop py-stack-lg">
    <!-- Back navigation -->
    <button class="flex items-center gap-1 text-on-surface-variant hover:text-on-surface font-label-md text-label-md mb-6 transition-colors" onclick="window.location.hash='/feed'">
      <span class="material-symbols-outlined text-[18px]">arrow_back</span>
      Back to Feed
    </button>

    <!-- Form Card -->
    <div class="bg-surface rounded-xl border border-outline-variant shadow-sm overflow-hidden hover-lift">
      <!-- Header -->
      <div class="bg-gradient-to-r from-secondary to-primary-container p-6">
        <h1 class="font-headline-lg text-headline-lg text-on-secondary font-semibold mb-1">Create Help Request</h1>
        <p class="font-body-md text-body-md text-on-secondary/80">Describe what you need help with and connect with peers or tutors</p>
      </div>

      <div class="p-6 space-y-6">
        <!-- Subject/Title -->
        <div>
          <label class="block font-label-md text-label-md text-on-surface mb-2" for="help-title">Request Title *</label>
          <input class="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all font-body-md text-body-md text-on-surface placeholder:text-outline" id="help-title" placeholder="e.g., Need help understanding AVL tree rotations" type="text"/>
        </div>

        <!-- Category -->
        <div>
          <label class="block font-label-md text-label-md text-on-surface mb-2" for="help-category">Category *</label>
          <div class="relative">
            <select class="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all font-body-md text-body-md text-on-surface appearance-none cursor-pointer" id="help-category">
              <option value="" disabled selected>Select a category</option>
              <option>Course Help — Tutoring</option>
              <option>Course Help — Study Partner</option>
              <option>Assignment Clarification</option>
              <option>Lab / Project Assistance</option>
              <option>Technical Issue</option>
              <option>Career Guidance</option>
              <option>Other</option>
            </select>
            <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
          </div>
        </div>

        <!-- Course -->
        <div>
          <label class="block font-label-md text-label-md text-on-surface mb-2" for="help-course">Related Course (optional)</label>
          <input class="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all font-body-md text-body-md text-on-surface placeholder:text-outline" id="help-course" placeholder="e.g., CS 301 — Data Structures" type="text"/>
        </div>

        <!-- Description -->
        <div>
          <label class="block font-label-md text-label-md text-on-surface mb-2" for="help-desc">Description *</label>
          <textarea class="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all font-body-md text-body-md text-on-surface placeholder:text-outline resize-none" id="help-desc" placeholder="Describe your issue in detail. What have you tried so far? What concepts are you struggling with?" rows="5"></textarea>
        </div>

        <!-- Urgency & Preferred Time -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block font-label-md text-label-md text-on-surface mb-2" for="help-urgency">Urgency</label>
            <select class="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all font-body-md text-body-md text-on-surface appearance-none cursor-pointer" id="help-urgency">
              <option>Low — No rush</option>
              <option selected>Medium — Within a few days</option>
              <option>High — Need help ASAP</option>
            </select>
          </div>
          <div>
            <label class="block font-label-md text-label-md text-on-surface mb-2" for="help-time">Preferred Meeting Time</label>
            <input class="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all font-body-md text-body-md text-on-surface" id="help-time" type="datetime-local"/>
          </div>
        </div>

        <!-- File Upload Area -->
        <div>
          <label class="block font-label-md text-label-md text-on-surface mb-2">Attachments (optional)</label>
          <div class="border-2 border-dashed border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center bg-surface-container-lowest hover:border-secondary hover:bg-surface-container-low transition-all cursor-pointer" id="file-upload-area">
            <span class="material-symbols-outlined text-on-surface-variant text-[40px] mb-2">cloud_upload</span>
            <p class="font-body-md text-body-md text-on-surface-variant mb-1">Drop files here or click to upload</p>
            <p class="font-label-sm text-label-sm text-outline">Screenshots, code snippets, documents (Max 10MB)</p>
            <input accept="image/*,.pdf,.doc,.docx,.txt,.py,.java,.cpp,.js" class="hidden" id="file-input" multiple type="file"/>
          </div>
        </div>

        <!-- Visibility -->
        <div>
          <label class="block font-label-md text-label-md text-on-surface mb-3">Visibility</label>
          <div class="flex gap-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input checked class="w-4 h-4 accent-secondary" name="visibility" type="radio" value="public"/>
              <span class="font-body-md text-body-md text-on-surface">Public</span>
              <span class="font-label-sm text-label-sm text-on-surface-variant">— Visible to all</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input class="w-4 h-4 accent-secondary" name="visibility" type="radio" value="private"/>
              <span class="font-body-md text-body-md text-on-surface">Private</span>
              <span class="font-label-sm text-label-sm text-on-surface-variant">— Tutors only</span>
            </label>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant">
          <button class="px-6 py-2.5 font-label-md text-label-md text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors" onclick="window.location.hash='/feed'">
            Cancel
          </button>
          <button class="px-8 py-2.5 bg-secondary text-on-secondary font-label-md text-label-md rounded-lg hover:bg-secondary-container transition-colors shadow-sm press-scale flex items-center gap-2" id="submit-help">
            <span class="material-symbols-outlined text-[18px]">send</span>
            Submit Request
          </button>
        </div>
      </div>
    </div>
  </main>`;
}

export function initHelp() {
  // File upload area click-to-browse
  const uploadArea = document.getElementById('file-upload-area');
  const fileInput = document.getElementById('file-input');
  if (uploadArea && fileInput) {
    uploadArea.addEventListener('click', () => fileInput.click());

    // Drag & drop visual feedback
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('border-secondary', 'bg-surface-container-low');
    });
    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('border-secondary', 'bg-surface-container-low');
    });
    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('border-secondary', 'bg-surface-container-low');
    });
  }

  // Submit button feedback
  const submitBtn = document.getElementById('submit-help');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      submitBtn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">progress_activity</span> Submitting...`;
      setTimeout(() => {
        submitBtn.innerHTML = `<span class="material-symbols-outlined text-[18px]">check_circle</span> Submitted!`;
        submitBtn.classList.remove('bg-secondary');
        submitBtn.classList.add('bg-green-600');
        setTimeout(() => {
          window.location.hash = '/feed';
        }, 1000);
      }, 1500);
    });
  }
}

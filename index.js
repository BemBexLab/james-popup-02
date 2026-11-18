document.addEventListener("alpine:init", () => {
  Alpine.data("danceBattle", () => ({
    stats: [],
    teams: [],
    slides: [],
    activeSlide: 0,
    loadError: false,
    init() {
      this.loadBattle();
    },
    async loadBattle() {
      this.loadError = false;
      try {
        // Replace this URL with the Laravel endpoint returning the same JSON shape.
        const response = await fetch("dummy.json");
        if (!response.ok)
          throw new Error(`Battle request failed (${response.status})`);
        const data = await response.json();
        this.stats = data.stats;
        this.teams = data.teams;
        this.slides = data.slides;
      } catch (error) {
        this.loadError = true;
        console.error(error);
      }
    },
    selectSlide(index) {
      if (!this.slides.length) return;
      this.activeSlide = (index + this.slides.length) % this.slides.length;
      this.$nextTick(() => {
        const strip = this.$refs.thumbnails;
        const button = strip.querySelectorAll("button")[this.activeSlide];
        const delta =
          button.getBoundingClientRect().left -
          strip.getBoundingClientRect().left;
        strip.scrollTo({
          left:
            strip.scrollLeft +
            delta -
            (strip.clientWidth - button.offsetWidth) / 2,
          behavior: "instant",
        });
      });
    },
    openPreview(index) {
      this.selectSlide(index);
      this.$refs.preview.showModal();
      document.body.style.overflow = "hidden";
    },
  }));
});

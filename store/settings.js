export const state = () => ({
  settings: {
    theme: 'auto',
    rainbow: false,
  }
})

export const mutations = {
  toggleRainbow(state) {
    state.settings.rainbow = !state.settings.rainbow;
  },
  updateRainbow(state, rainbow) {
    console.log(rainbow);
    state.settings.rainbow = rainbow;
  },
  setTheme(state, theme) {
    if (theme === 'auto' || theme === 'dark' || theme === 'light') {
      state.settings.theme = theme;
    }
  }

  
  
}
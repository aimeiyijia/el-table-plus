import ElTableTs from './modules/el-table-ts'
import { App } from 'vue'

type ComponentType = any

interface ComponentInstance {
  install: (app: App) => void
}

interface CreateOptions {
  components?: ComponentType[]
}

function create ({
  components = []
}: CreateOptions = {}): ComponentInstance {
  const installTargets: App[] = []
  function registerComponent (
    app: App,
    name: string,
    component: ComponentType
  ): void {
    const registered = app.component(name)
    if (!registered) {
      app.component(name, component)
    }
  }
  function install (app: App): void {
    if (installTargets.includes(app)) return
    installTargets.push(app)
    components.forEach((component) => {
      const { name } = component
      registerComponent(app, name, component)
    })
  }
  return {
    install
  }
}

const Components = [ElTableTs]

export default create({
  components: Components
})

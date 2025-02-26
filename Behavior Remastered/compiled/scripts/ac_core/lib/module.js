import EventEmitter from "../../core/lib/event.js";
import server from "../../core/lib/server.js";
import uacStorage from "./storage.js";
export class ModuleConstructor extends Map {
    events = new EventEmitter('UAC:Module <Common>');
    get Module() { return Module; }
}
const module = new ModuleConstructor;
export default module;
export class Module extends EventEmitter {
    constructor(id, name = '', desc = '', data = {}, defaultToggle = true) {
        if (module.has(id))
            throw new Error(`Module '${id}' already exists`);
        super(`UAC:Module <${id}>`);
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.data = data;
        module.set(id, this);
        if (!defaultToggle)
            server.waitFor(1).then(() => this.toggle = false);
    }
    id;
    name;
    desc;
    data;
    configParser;
    #toggle = true;
    get toggle() { return this.#toggle; }
    set toggle(v) { this.setToggle(v); }
    setToggle(toggle, executer = '[System]') {
        if (this.#toggle === toggle)
            return;
        const evd = {
            executer,
            module: this,
            cancel: false
        };
        module.events.emit(toggle ? 'enable' : 'disable', evd);
        const evdp = {
            executer,
            cancel: evd.cancel
        };
        this.emit(toggle ? 'enable' : 'disable', evdp);
        if (!evdp.cancel)
            this.#toggle = toggle;
        return !evdp.cancel;
    }
}
uacStorage.addEventListener('save', ({ data }) => {
    data.modules = Array.from(module, ([k, v]) => [k, [v.toggle, v.data]]);
}, { priority: 100 });
uacStorage.addEventListener('load', ({ data }) => {
    if (data.modules) {
        for (const [k, [v, dat]] of data.modules) {
            const m = module.get(k);
            if (!m)
                continue;
            m.data = dat;
            if (m.configParser)
                m.configParser.obj = dat;
            m.setToggle(v, '[Storage]');
        }
    }
}, { priority: 100 });

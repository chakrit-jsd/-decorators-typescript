// Decorators property
function prefix(prefix: string) {
    return function (target: any, propertyKey: string) {
        const prop = `_${propertyKey}`
        Reflect.defineProperty(target, propertyKey, {
            get() {
                return this[prop]
            },
            set(value: string) {
                this[prop] = `${prefix}_${value}`
            }
        })
    }       
}

// Decorators method
function wrapLog(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log(descriptor.value, target, propertyKey)
    const originalMethod = descriptor.value as Function
    descriptor.value = function (...args: any[]) {
        console.log("/////////////////////////")
        originalMethod.apply(this, args)
        console.log("/////////////////////////")
    }
}

// Decorators Class
function timeStamp(timeZone: string, locales = "en-EN") {
    return function <T extends {new (...args: any[]): {}}>(target: T) {
        return class extends target {
            createdAt: string = new Date().toLocaleString(locales, { timeZone });
        }
    }
}

type Gender = "unknow" | "male" | "female"

@timeStamp("Asia/Bangkok")
class Customer {
    @prefix("TH")
    name: string;

    gender: Gender;
    createdAt: string = ""

    constructor(name: string, gender: Gender) {
        this.name = name
        this.gender = gender
    }

    @wrapLog
    showInfo() {
        console.log(`Name: ${this.name} | Gender: ${this.gender} | ${this.createdAt}`)
    }

}

# 领域设计器

## Project setup
```
pnpm i
```

## Development
```
# shell 1 = component 编译组件
cd libs/solid-component-preview
pnpm build:component:watch

# shell 2 = style 编译组件样式
cd libs/solid-component-preview
pnpm build:style:watch

# shell 3 = domain-designer 启动设计器
cd apps/domain-designer
pnpm start

# shell 4 = websocket 启动websocker
cd apps/domain-designer
pnpm serve
``` 

import { type Component, type ComponentProps, For, createEffect, createMemo, createSignal } from 'solid-js'
import { render } from 'solid-js/web'
import { type ContrastLevelType, type VariantType, createMaterialTheme } from '../src/index'

import './index.scss'
import { DYNAMIC_SCHEME_FIELDS, MaterialTheme } from '../src/schemes'

const SurfaceColorMap = {
    Surface: {
        bg: 'surface',
        fg: 'onSurface',
    },
    'Surface container highest': {
        bg: 'surfaceContainerHighest',
        fg: 'onSurface',
    },
    'Surface container high': {
        bg: 'surfaceContainerHigh',
        fg: 'onSurface',
    },
    'Surface container': {
        bg: 'surfaceContainer',
        fg: 'onSurface',
    },
    'Surface container low': {
        bg: 'surfaceContainerLow',
        fg: 'onSurface',
    },
    'Surface container lowest': {
        bg: 'surfaceContainerLowest',
        fg: 'onSurface',
    },
    'Surface dim': {
        bg: 'surfaceDim',
        fg: 'onSurface',
    },
    'Surface bright': {
        bg: 'surfaceBright',
        fg: 'onSurface',
    },
}

const SurfaceColorKeys = Object.keys(SurfaceColorMap) as Array<keyof typeof SurfaceColorMap>

const App = () => {
    // M3 default: #9f86ff
    // We're using SolidJS' primary color for the default color
    const [color, setColor] = createSignal('#2c4f7c')
    const [variant, setVariant] = createSignal<VariantType>('tonal_spot')
    const [dark, setDark] = createSignal(false)
    const [contrastLevel, setContrastLevel] = createSignal<ContrastLevelType>('default')
    const [customBgToken, setCustomBgToken] = createSignal<(typeof DYNAMIC_SCHEME_FIELDS)[number]>('primary')
    const [customFgToken, setCustomFgToken] = createSignal<(typeof DYNAMIC_SCHEME_FIELDS)[number]>('onPrimary')

    const [scheme] = createMaterialTheme(color, {
        variant,
        dark,
        contrastLevel,
    })

    const [surfaceIndex, setSurfaceIndex] = createSignal<(typeof SurfaceColorKeys)[number]>('Surface')
    const SurfaceColorTokens = createMemo(() => SurfaceColorMap[surfaceIndex()])
    const surfaceColor = createMemo(() => ({
        bg: scheme[SurfaceColorTokens().bg],
        fg: scheme[SurfaceColorTokens().fg],
    }))

    createEffect(() => {
        document.body.style.backgroundColor = scheme.surface
        document.body.style.color = scheme.onSurface

        document.body.style.setProperty('--m3-ibg', scheme.surfaceContainerHighest)
        document.body.style.setProperty('--m3-itx', scheme.onSurface)
        document.body.style.setProperty('--m3-ilb', scheme.onSurfaceVariant)
    })

    return (
        <>
            <h1>
                SolidJS <code>createMaterialTheme()</code> showcase
            </h1>

            <div class="inputs">
                <input
                    value={scheme.sourceColorArgb}
                    type="color"
                    label="Source color"
                    onChange={e => setColor(e.target.value)}
                />

                <select
                    value={dark() ? 'dark' : 'light'}
                    label="Theme"
                    onChange={e => {
                        document.documentElement.dataset.theme = e.target.value
                        setDark(e.target.value === 'dark')
                    }}
                    required
                >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                </select>

                <select label="Variant" value={variant()} onChange={e => setVariant(e.target.value)} required>
                    <option value="neutral">Neutral</option>
                    <option value="monochrome">Monochrome</option>
                    <option value="tonal_spot">Tonal spot</option>
                    <option value="vibrant">Vibrant</option>
                    <option value="expressive">Expressive</option>
                    <option value="fidelity">Fidelity</option>
                    <option value="content">Content</option>
                    <option value="rainbow">Rainbow</option>
                    <option value="fruit_salad">Fruit salad</option>
                    <option value="image_fidelity">Image fidelity</option>
                </select>

                <select
                    label="Contrast Level"
                    value={contrastLevel()}
                    onChange={e => setContrastLevel(e.target.value as ContrastLevelType)}
                    required
                >
                    <option value="default">Default</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="reduced">Reduced</option>
                </select>
            </div>

            <div class="grid">
                <Box background={scheme.primary} foreground={scheme.onPrimary}>
                    Primary
                    <code>primary / onPrimary</code>
                </Box>
                <Box background={scheme.secondary} foreground={scheme.onSecondary}>
                    Secondary
                    <code>secondary / onSecondary</code>
                </Box>
                <Box background={scheme.tertiary} foreground={scheme.onTertiary}>
                    Tertiary
                    <code>tertiary / onTertiary</code>
                </Box>
                <Box background={scheme.primaryContainer} foreground={scheme.onPrimaryContainer}>
                    Primary container
                    <code>primaryContainer / onPrimaryContainer</code>
                </Box>
                <Box background={scheme.secondaryContainer} foreground={scheme.onSecondaryContainer}>
                    Secondary container
                    <code>secondaryContainer / onSecondaryContainer</code>
                </Box>
                <Box background={scheme.tertiaryContainer} foreground={scheme.onTertiaryContainer}>
                    Tertiary container
                    <code>tertiaryContainer / onTertiaryContainer</code>
                </Box>
                <Box background={scheme.background} foreground={scheme.onBackground}>
                    Background
                    <code>background / onBackground</code>
                </Box>
                <Box
                    background={surfaceColor().bg}
                    foreground={surfaceColor().fg}
                    onClick={() =>
                        setSurfaceIndex(
                            SurfaceColorKeys.at(
                                (SurfaceColorKeys.findIndex(k => k === surfaceIndex()) + 1) % SurfaceColorKeys.length,
                            ) as keyof typeof SurfaceColorMap,
                        )
                    }
                >
                    {surfaceIndex()}
                    <code>
                        {SurfaceColorTokens().bg} / {SurfaceColorTokens().fg}
                    </code>
                    <p style={`color: ${scheme.onSurfaceVariant}`}>(Click to cycle)</p>
                </Box>
                <Box background={scheme.error} foreground={scheme.onError}>
                    Error
                    <code>error / onError</code>
                </Box>
            </div>

            <h2>Custom color token preview</h2>
            <div class="inputs">
                <div class="labeled">
                    <label>Background</label>
                    <select value={customBgToken()} onChange={e => setCustomBgToken(e.target.value)}>
                        <For each={DYNAMIC_SCHEME_FIELDS}>
                            {token => (
                                <option value={token} selected={token === customBgToken()}>
                                    {token}
                                </option>
                            )}
                        </For>
                    </select>
                </div>
                <div class="labeled">
                    <label>Foreground</label>
                    <select value={customFgToken()} onChange={e => setCustomFgToken(e.target.value)}>
                        <For each={DYNAMIC_SCHEME_FIELDS}>
                            {token => (
                                <option value={token} selected={token === customFgToken()}>
                                    {token}
                                </option>
                            )}
                        </For>
                    </select>
                </div>
            </div>
            <Box background={scheme[customBgToken()]} foreground={scheme[customFgToken()]}>
                {customBgToken()}
                <code>
                    {customBgToken()} / {customFgToken()}
                </code>
            </Box>
        </>
    )
}

const Box: Component<
    Pick<ComponentProps<'div'>, 'children' | 'onClick'> & { background: string; foreground?: string }
> = props => (
    <div
        class="box"
        style={`background: ${props.background}; color: ${props.foreground ?? 'currentColor'}`}
        {...props}
    />
)

render(() => <App />, document.body)

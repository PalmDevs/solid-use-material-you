import { Hct, argbFromHex, hexFromArgb } from '@material/material-color-utilities'
import { createEffect, createMemo, createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'
import {
    type ContrastLevelType,
    ContrastLevelTypeMap,
    DYNAMIC_SCHEME_FIELDS,
    type MaterialTheme,
    PALETTE_FIELDS,
    type VariantType,
    buildDynamicScheme,
} from './schemes'
import { type MaybeAccessor, isPreferColorSchemeDark, rgbaToHex, sourceColorFromImage, toValue } from './utils'

const REGEX_URL = /(http|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/g
const REGEX_RGBA = /^rgba?/i

/**
 * Creates a Material 3 theme based on the source color or image URL
 * @param source Source color or image URL, signal or a string
 * @param options Extra options
 * @returns An array of the color scheme and the state of the hook
 */
export function createMaterialTheme(
    source: MaybeAccessor<string | number>,
    options?: {
        variant?: MaybeAccessor<VariantType>
        contrastLevel?: MaybeAccessor<ContrastLevelType>
        dark?: MaybeAccessor<boolean>
        crossOrigin?: MaybeAccessor<string>
    },
) {
    const [componentState, setComponentState] = createSignal<'' | 'error' | 'loading' | 'done'>('')
    // Initially null, will be set to a valid scheme after the hook is done anyways
    const [scheme, setScheme] = createStore<MaterialTheme>(null as unknown as MaterialTheme)
    const [argbSourceColor, setARGBSourceColor] = createSignal<number>(0)
    const contrastLevel = createMemo(() => ContrastLevelTypeMap[toValue(options?.contrastLevel) ?? 'default'])
    const variant = createMemo(() => toValue(options?.variant) ?? 'tonal_spot')
    const isDark = createMemo(() => toValue(options?.dark) ?? isPreferColorSchemeDark())
    const crossOrigin = createMemo(() => toValue(options?.crossOrigin) ?? 'anonymous')
    const [dominants, setDominants] = createSignal<number[]>([])

    createEffect(() => {
        const sourceColor = toValue(source).toString()

        // source is URL
        if (REGEX_URL.test(sourceColor)) {
            setComponentState('loading')
            const img = document.createElement('img')

            img.crossOrigin = crossOrigin()
            img.referrerPolicy = 'no-referrer'
            img.src = argbSourceColor().toString()

            sourceColorFromImage(img, 3)
                .then(scores => {
                    setARGBSourceColor(scores[0]!)
                    setDominants(scores)
                })
                .catch(() => {
                    setComponentState('error')
                    setARGBSourceColor(0)
                })
        }

        let possibleHexColor = sourceColor

        if (REGEX_RGBA.test(sourceColor)) {
            possibleHexColor = rgbaToHex(sourceColor)
        }

        // hex color
        if (sourceColor.startsWith('#')) {
            setARGBSourceColor(argbFromHex(possibleHexColor))
        }
    })

    createEffect(() => {
        const sourceColor = argbSourceColor()
        const hct = Hct.fromInt(sourceColor)
        const dynamicScheme = buildDynamicScheme(hct, variant(), isDark(), contrastLevel(), dominants())

        for (const field of DYNAMIC_SCHEME_FIELDS) {
            // @ts-expect-error: :shrug:
            setScheme(field, hexFromArgb(dynamicScheme[field as keyof MaterialTheme]))
        }

        for (const field of PALETTE_FIELDS) {
            // @ts-expect-error: :shrug:
            setScheme(field, dynamicScheme[field as keyof MaterialTheme])
        }

        setComponentState('done')
    })

    return [scheme, componentState] as const
}

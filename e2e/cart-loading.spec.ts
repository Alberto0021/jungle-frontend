import { expect, test } from '@playwright/test'

test('mostra o skeleton do carrinho e recupera após falha temporária', async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem(
            'kurio:cart:v1',
            JSON.stringify([{ id: '042', quantity: 1 }]),
        )
        sessionStorage.removeItem('kurio:test:cart-loading-retry')
    })

    await page.goto('http://localhost:5173/carrinho?mockCartLoading=1', {
        waitUntil: 'commit',
    })

    await expect(
        page.getByRole('status', { name: 'Carregando resumo do carrinho' }),
    ).toBeVisible()

    const errorMessage = page.getByText('Não foi possível carregar o carrinho.')
    await expect(errorMessage).toBeVisible({ timeout: 20_000 })

    await page.evaluate(() => {
        sessionStorage.setItem('kurio:test:cart-loading-retry', '1')
    })

    await page.getByRole('button', { name: 'Tentar novamente' }).click()

    await expect(page.getByText('1.206 ETH', { exact: true })).toBeVisible()
    await expect(errorMessage).toHaveCount(0)
})
import { expect, test } from '@playwright/test'

test('confirmação sem pedido oferece caminho de volta ao carrinho', async ({ page }) => {
    await page.goto('http://localhost:5173/confirmacao')

    await expect(
        page.getByRole('heading', { name: 'Nenhum pedido para confirmar' }),
    ).toBeVisible()

    await page.getByRole('link', { name: 'Voltar ao carrinho' }).click()
    await expect(page).toHaveURL(/\/carrinho\/?$/)
})


import { render, screen } from '@testing-library/react'
import Home from '@/app/page'
import '@testing-library/jest-dom'

jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: jest.fn(),
            pathname: '/',
        }
    },
}))

describe('Home Page', () => {
    beforeEach(() => {
        render(<Home />)
    })

    it('renders the main heading with correct text', () => {
        const heading = screen.getByRole('heading', {
            level: 1,
            name: /BUC SUPPLY NETWORK/i
        })
        expect(heading).toBeInTheDocument()
    })

    it('renders all call-to-action buttons', () => {
        expect(screen.getByRole('button', { name: /LAUNCH DASHBOARD/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /START FREE TRIAL/i })).toBeInTheDocument()
    })

    it('renders all feature sections', () => {
        expect(screen.getByText(/^Blockchain$/)).toBeInTheDocument()
        expect(screen.getByText(/^Neural AI$/)).toBeInTheDocument()
        expect(screen.getByText(/^Live Analytics$/)).toBeInTheDocument()
        expect(screen.getByText(/^Enterprise Security$/)).toBeInTheDocument()
    })
})

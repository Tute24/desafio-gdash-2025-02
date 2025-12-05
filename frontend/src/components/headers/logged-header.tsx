import { Link, useNavigate } from 'react-router-dom'
import { ModalComponent } from '../modal/modal'
import { signOutRequest } from '@/api/auth/sign-out-request'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { House, LogOut, Menu, User } from 'lucide-react'
import { Button } from '../ui/button'
import { useState } from 'react'

export default function LoggedHeader() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  async function signOutHandler() {
    try {
      setIsLoading(true)
      const response = await signOutRequest()

      if (response.success) {
        window.alert(response.message)
        navigate('/')
      } else {
        window.alert(`Couldn't sign out successfully.`)
      }
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <>
      <div className="flex flex-row py-5 bg-neutral-200 max-h-[85px] text-center items-center w-full">
        <nav className="cursor-pointer flex items-center justify-between flex-row w-full px-5 sm:text-xl font-poppins font-semibold">
          <div data-testid="dashboard-reference">
            <Link to="/portal/dashboard">
              <House className="text-cyan-700" size={50} />
            </Link>
          </div>
          <div className="hidden sm:block">
            <Link to="/portal/user-profile">
              <div className="hover:underline text-cyan-700">My Profile</div>
            </Link>
          </div>
          <div className="hidden sm:block">
            <ModalComponent
              guideText="Sign Out"
              dialogText="Sign Out"
              requestHandler={signOutHandler}
              isLoading={isLoading}
              buttonLayout={
                <Button variant={'ghost'} className="cursor-pointer">
                  <LogOut className="text-cyan-700" size={30} />
                  <div className="text-cyan-700 font-semibold text-lg">
                    SignOut
                  </div>
                </Button>
              }
            />
          </div>
          <div className="block sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Menu className="text-cyan-700" size={28} />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="font-medium text-cyan-700 px-3 bg-white"
              >
                <DropdownMenuLabel className="text-xl font-bold font-poppins">
                  Options
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-cyan-700 -mx-3" />
                <DropdownMenuItem>
                  <Button variant={'ghost'}>
                    <User size={30} className="text-cyan-700" />
                    <Link to="/portal/user-profile">
                      <div className="hover:underline text-cyan-700 text-lg">
                        My Profile
                      </div>
                    </Link>
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <ModalComponent
                    guideText="Sign Out"
                    dialogText="Sign Out"
                    requestHandler={signOutHandler}
                    isLoading={isLoading}
                    buttonLayout={
                      <Button variant={'ghost'} className="cursor-pointer">
                        <LogOut className="text-cyan-700" size={30} />
                        <div className="text-cyan-700 font-semibold text-lg">
                          SignOut
                        </div>
                      </Button>
                    }
                  />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
      </div>
      <hr className="mb-5 border-2 border-cyan-700" />
    </>
  )
}

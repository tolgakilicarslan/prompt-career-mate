import { useState } from "react"
import { Layout } from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"
import { 
  User, 
  Bell, 
  Shield, 
  Download, 
  Trash2, 
  Mail,
  Key,
  Globe,
  Save
} from "lucide-react"

const Settings = () => {
  const { user, signOut } = useAuth()
  const { toast } = useToast()
  
  // Profile settings
  const [displayName, setDisplayName] = useState(user?.email?.split('@')[0] || "")
  const [email, setEmail] = useState(user?.email || "")
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [jobAlerts, setJobAlerts] = useState(true)
  const [applicationReminders, setApplicationReminders] = useState(true)
  
  // Privacy settings
  const [profilePublic, setProfilePublic] = useState(false)
  const [dataSharing, setDataSharing] = useState(false)

  const handleSaveProfile = () => {
    // TODO: Implement profile update
    toast({
      title: "Profile Updated",
      description: "Your profile settings have been saved successfully.",
    })
  }

  const handleExportData = () => {
    // TODO: Implement data export
    toast({
      title: "Data Export",
      description: "Your data export will be emailed to you shortly.",
    })
  }

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion with confirmation
    toast({
      title: "Account Deletion",
      description: "Account deletion requires confirmation. Check your email.",
      variant: "destructive",
    })
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient">Settings</h1>
            <p className="text-muted-foreground mt-2">
              Manage your account preferences and privacy settings
            </p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              Account
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile">
            <Card className="card-elegant p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profile Information
                  </h3>
                  <p className="text-muted-foreground">
                    Update your personal information and preferences
                  </p>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter your display name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile} className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card className="card-elegant p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification Preferences
                  </h3>
                  <p className="text-muted-foreground">
                    Choose how you want to be notified about important updates
                  </p>
                </div>

                <Separator />

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about your applications via email
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <Label htmlFor="job-alerts">Job Alerts</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Get notified about new job opportunities that match your profile
                      </p>
                    </div>
                    <Switch
                      id="job-alerts"
                      checked={jobAlerts}
                      onCheckedChange={setJobAlerts}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        <Label htmlFor="app-reminders">Application Reminders</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Remind me to follow up on pending applications
                      </p>
                    </div>
                    <Switch
                      id="app-reminders"
                      checked={applicationReminders}
                      onCheckedChange={setApplicationReminders}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy">
            <Card className="card-elegant p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Privacy & Security
                  </h3>
                  <p className="text-muted-foreground">
                    Control your data privacy and security preferences
                  </p>
                </div>

                <Separator />

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="profile-public">Public Profile</Label>
                      <p className="text-sm text-muted-foreground">
                        Make your profile visible to potential employers
                      </p>
                    </div>
                    <Switch
                      id="profile-public"
                      checked={profilePublic}
                      onCheckedChange={setProfilePublic}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="data-sharing">Analytics Data Sharing</Label>
                      <p className="text-sm text-muted-foreground">
                        Help improve our services by sharing anonymous usage data
                      </p>
                    </div>
                    <Switch
                      id="data-sharing"
                      checked={dataSharing}
                      onCheckedChange={setDataSharing}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Account Settings */}
          <TabsContent value="account">
            <div className="space-y-6">
              {/* Data Export */}
              <Card className="card-elegant p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Download className="w-5 h-5" />
                      Export Your Data
                    </h3>
                    <p className="text-muted-foreground">
                      Download a copy of all your data including documents, applications, and settings
                    </p>
                  </div>
                  <Button 
                    onClick={handleExportData}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export Data
                  </Button>
                </div>
              </Card>

              {/* Sign Out */}
              <Card className="card-elegant p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Sign Out</h3>
                    <p className="text-muted-foreground">
                      Sign out of your account on this device
                    </p>
                  </div>
                  <Button 
                    onClick={signOut}
                    variant="outline"
                  >
                    Sign Out
                  </Button>
                </div>
              </Card>

              {/* Danger Zone */}
              <Card className="card-elegant p-6 border-destructive/50">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-destructive flex items-center gap-2">
                      <Trash2 className="w-5 h-5" />
                      Danger Zone
                    </h3>
                    <p className="text-muted-foreground">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                  </div>
                  <Button 
                    onClick={handleDeleteAccount}
                    variant="destructive"
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}

export default Settings
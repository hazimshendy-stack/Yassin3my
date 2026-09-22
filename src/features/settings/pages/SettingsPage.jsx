import { Globe, Bell, Palette } from 'lucide-react';
import { PageHeader } from '../../../components/PageHeader.jsx';
import { Card, CardHeader } from '../../../components/Card.jsx';
import { Select } from '../../../components/Select.jsx';
import { Button } from '../../../components/Button.jsx';
import { useUI } from '../../../components/UIProvider.jsx';
import { useToast } from '../../../hooks/useToast.js';
import { useLocalStorage } from '../../../hooks/useLocalStorage.js';
import './SettingsPage.module.css';

export default function SettingsPage() {
  const { lang, setLang } = useUI();
  const toast = useToast();
  const [notifications, setNotifications] = useLocalStorage(
    'egyskills.settings.notifications',
    'all'
  );

  return (
    <div className="fade-in">
      <PageHeader
        breadcrumbs={[{ label: 'الإعدادات' }]}
        title="الإعدادات"
        subtitle="خصّص تجربتك على المنصة."
      />

      <div className="settings__grid">
        <Card className="settings__card">
          <CardHeader
            title="اللغة"
            subtitle="اختر لغة عرض المنصة."
          />
          <div className="settings__row">
            <Globe size={16} className="settings__icon" />
            <Select
              label="لغة الواجهة"
              value={lang}
              onChange={(e) => {
                setLang(e.target.value);
                toast.success('تم تحديث اللغة');
              }}
              options={[
                { value: 'ar', label: 'العربية' },
                { value: 'en', label: 'English' },
              ]}
            />
          </div>
        </Card>

        <Card className="settings__card">
          <CardHeader
            title="الإشعارات"
            subtitle="تحكم في كيفية وصول التنبيهات إليك."
          />
          <div className="settings__row">
            <Bell size={16} className="settings__icon" />
            <Select
              label="مستوى الإشعارات"
              value={notifications}
              onChange={(e) => {
                setNotifications(e.target.value);
                toast.success('تم تحديث تفضيلات الإشعارات');
              }}
              options={[
                { value: 'all', label: 'جميع الإشعارات' },
                { value: 'important', label: 'المهمة فقط' },
                { value: 'none', label: 'بدون إشعارات' },
              ]}
            />
          </div>
        </Card>

        <Card className="settings__card settings__card--full">
          <CardHeader
            title="المظهر"
            subtitle="المنصة تعمل بمظهر داكن ثابت للحفاظ على تجربة موحّدة."
          />
          <div className="settings__row settings__row--between">
            <div className="settings__theme">
              <Palette size={16} className="settings__icon" />
              <div>
                <p className="settings__theme-title">المظهر الداكن (أسود + أخضر)</p>
                <p className="settings__theme-sub">قيمة ثابتة في هذا الإصدار.</p>
              </div>
            </div>
            <Button
              variant="outline"
              disabled
              title="المظهر الثابت لا يمكن تغييره في هذا الإصدار"
            >
              مُفعّل
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

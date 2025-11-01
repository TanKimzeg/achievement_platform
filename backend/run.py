import os
from app import create_app, db
from app.models import User, Class, Achievement, AuditLog

# 创建应用实例
app = create_app(os.getenv('FLASK_ENV', 'development'))

@app.shell_context_processor
def make_shell_context():
    """为Flask shell提供上下文"""
    return {
        'db': db,
        'User': User,
        'Class': Class,
        'Achievement': Achievement,
        'AuditLog': AuditLog
    }

@app.cli.command()
def init_db():
    """初始化数据库"""
    db.create_all()
    print('数据库初始化完成')

@app.cli.command()
def create_admin():
    """创建管理员账户"""
    admin = User(
        username='admin',
        name='系统管理员',
        role='admin'
    )
    admin.set_password('admin123')
    
    db.session.add(admin)
    db.session.commit()
    print('管理员账户创建成功: admin/admin123')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)